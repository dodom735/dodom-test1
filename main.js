const inputText = document.getElementById('input-text');
const translateButton = document.getElementById('translate-button');
const resultText = document.getElementById('result-text');
const copyButton = document.getElementById('copy-button');
const toastMessage = document.getElementById('toast-message');
const princessPowerDisplay = document.getElementById('princess-power');
const princessTitleDisplay = document = document.getElementById('princess-title');

// --- 데이터 설정 (기존 데이터 유지 및 강화) ---
const PRONOUN_MAP = {
    '나': '공주는', '나는': '공주는', '내가': '공주가', '내': '공주의', '저': '공주는', '저는': '공주는', '제가': '공주가', '저의': '공주의',
    '우리': '공주님들은', '우리들은': '공주님들은', '우리가': '공주님들이'
};

const NOUN_MAP = {
    '집': '화려한 장미 궁궐', '돈': '반짝이는 금화', '밥': '고귀한 만찬(수라상)', '학교': '지식의 상아탑', '회사': '황금빛 직무 궁전',
    '친구': '소중한 벗', '시간': '찬란한 순간', '배고파': '고귀한 알람이 울리옵니다', '졸려': '잠이 쏟아지옵니다'
};

const EXAGGERATED_PHRASES = [
    '오늘도 공주는', '아가 공주는', '아가 토끼 공주는', '천사 공주께서는', '눈부신 미모의 공주가 말하길,'
];

const CONNECTIVES = ['하시옵고,', '이옵나니,', '하시매,', '이옵고,', '그러하시온데,', '또한,'];

const EMOJIS = ['👑', '✨', '💖', '🥹', '🎀', '💎', '🌸', '🧚‍♀️', '💫', '🌟', '🌷'];

const SENTENCE_END_TRANSFORMATIONS = [
    { regex: /(맞나|인가|인가요|맞나요)\?*$/, replacement: '참말로 옳사옵니까? 오호호, 그리 여쭈옵니다! ✨' },
    { regex: /(어|다|아|요|죠|니)\.*$/, replacement: '이옵니다, 잊지 마시옵소서! 🌸' }
];

// --- 헬퍼 함수 ---
function getRandomElement(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

// 조사 자동 교정 (은/는, 이/가 등)
function fixJosa(text) {
    return text.replace(/([가-힣])(은\/는|이\/가|을\/를)/g, (match, word, josa) => {
        const lastChar = word.charCodeAt(word.length - 1);
        const hasBatchim = (lastChar - 0xac00) % 28 > 0;
        const josaMap = {
            '은/는': hasBatchim ? '은' : '는',
            '이/가': hasBatchim ? '이' : '가',
            '을/를': hasBatchim ? '을' : '를'
        };
        return word + josaMap[josa];
    });
}

// --- 메인 변환 로직 ---
function convertToPrincessSpeak(text) {
    if (!text.trim()) return { text: "평범한 말을 적어주세요! 🥹", power: 0 };

    let result = text.trim();

    // 1. 명사 및 대명사 치환
    Object.keys(NOUN_MAP).forEach(key => {
        // Use a more robust word boundary for Korean, matching any non-Korean character or whitespace
        const regex = new RegExp(`(?<=\\s|^)${key}(?=\\s|$)`, 'g');
        result = result.replace(regex, NOUN_MAP[key]);
    });
    Object.keys(PRONOUN_MAP).forEach(key => {
        const regex = new RegExp(`(?<=\\s|^)${key}(?=\\s|$)`, 'g');
        result = result.replace(regex, PRONOUN_MAP[key]);
    });

    // 2. 문장 쪼개기 및 중간 연결
    // 마침표나 물음표로 문장을 나누되, 마지막 조각은 따로 처리함
    let segments = result.split(/[.!?]\s*/).filter(s => s.length > 0);
    
    // 시작 수식어 (딱 한 번)
    let princessFullText = getRandomElement(EXAGGERATED_PHRASES) + " ";

    segments.forEach((seg, index) => {
        let currentSeg = seg.trim();
        
        if (index < segments.length - 1) {
            // 중간 문장들: 연결 어미로 부드럽게 잇기
            // '어', '다', '요', '죠' 등으로 끝나는 어미를 제거하고 연결 어미 추가
            currentSeg = currentSeg.replace(/(어|다|요|죠|니)$/, ""); // 더 많은 어미 고려
            princessFullText += currentSeg + getRandomElement(CONNECTIVES) + " ";
        } else {
            // 마지막 문장: 화려한 종결 어미 적용
            let transformed = false;
            for (const rule of SENTENCE_END_TRANSFORMATIONS) {
                if (rule.regex.test(currentSeg)) {
                    currentSeg = currentSeg.replace(rule.regex, rule.replacement);
                    transformed = true;
                    break;
                }
            }
            if (!transformed) princessFullText += currentSeg + " 이옵니다, 오호호! ✨";
            else princessFullText += currentSeg; // 이미 변환되었으면 추가 장식 없음
        }
    });

    // 3. 이모지 무작위 삽입 (광기 보정)
    let finalResult = princessFullText.split(" ").map(word => 
        Math.random() < 0.3 ? word + getRandomElement(EMOJIS) : word
    ).join(" ");

    // 4. 조사 최종 교정
    finalResult = fixJosa(finalResult);

    return {
        text: finalResult,
        power: Math.min(100, Math.floor((finalResult.length / text.length) * 20 + 40))
    };
}

// --- 이벤트 리스너 및 실행 ---
translateButton.addEventListener('click', () => {
    const input = inputText.value;
    translateButton.disabled = true;
    translateButton.textContent = '공주가 생각 중... ✨';

    setTimeout(() => {
        const result = convertToPrincessSpeak(input);
        resultText.textContent = result.text;
        princessPowerDisplay.textContent = `공주력: ${result.power}%`;
        princessTitleDisplay.textContent = `칭호: ${result.power > 80 ? '진정한 광기의 공주' : '수줍은 아가 공주'}`;
        
        translateButton.disabled = false;
        translateButton.textContent = '✨ 공주로 만들어줘 ✨';
    }, 600);
});

copyButton.addEventListener('click', () => {
    navigator.clipboard.writeText(resultText.textContent);
    showToast('공주어 복사 완료 👑');
});

function showToast(msg) {
    toastMessage.textContent = msg;
    toastMessage.classList.add('show');
    setTimeout(() => toastMessage.classList.remove('show'), 2000);
}