const inputText = document.getElementById('input-text');
const translateButton = document.getElementById('translate-button');
const resultText = document.getElementById('result-text');
const copyButton = document.getElementById('copy-button');
const toastMessage = document.getElementById('toast-message');
const princessPowerDisplay = document.getElementById('princess-power'); // Re-added display element
const princessTitleDisplay = document.getElementById('princess-title'); // Re-added display element
const lastUpdatedDisplay = document.getElementById('last-updated'); // Re-added display element

// --- [1. 데이터 정의: 더 화려하고 미치게] ---
const PRONOUN_MAP = {
    '나': '공주는', '나는': '공주는', '내가': '공주가', '내': '공주의', '저': '공주는', '저는': '공주는', '제가': '공주가'
};

const NOUN_MAP = {
    '집': '장미 향기가 가득한 비밀 궁궐',
    '돈': '반짝이는 순금 다이아몬드',
    '밥': '천상의 맛을 담은 고귀한 만찬',
    '코딩': '찬란한 보석을 수놓는 바이브 코딩',
    '오늘': '눈부시게 아름다운 금일',
    '친구': '소중하고 우아한 나의 벗'
};

const ADJECTIVES = ['눈부신', '황홀한', '사랑스러운', '고귀한', '은하수 같은', '장미빛'];
const EMOJIS = ['👑', '✨', '💖', '🥹', '🎀', '💎', '🌸', '🧚‍♀️', '💫', '🌟', '🌷', '🦋', '🦢'];
const CONNECTIVES = ['하시옵고,', '이옵나니,', '하시매,', '이옵고,', '그러하시온데,', '또한,']; // Re-added

// --- [2. 핵심 유틸리티: 조사 자동 교정] ---
function getRandomElement(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

function getJosa(word, type) {
    if (!word || typeof word !== 'string') return '';
    const lastChar = word.charCodeAt(word.length - 1);
    // Check for final consonant (받침)
    const hasBatchim = (lastChar - 0xac00) % 28 > 0;
    const josaMap = {
        '이/가': hasBatchim ? '이' : '가',
        '은/는': hasBatchim ? '은' : '는',
        '을/를': hasBatchim ? '을' : '를',
        '와/과': hasBatchim ? '과' : '와', // Added for completeness
        '으로/로': (lastChar - 0xac00) % 28 === 8 ? '로' : (hasBatchim ? '으로' : '로') // Added for completeness
    };
    return josaMap[type] || '';
}

// Function to update timestamp (re-added)
function updateTimestamp() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const timestamp = `${year}-${month}-${day} ${hours}:${minutes}`;
    if (lastUpdatedDisplay) { // Check if element exists before updating
        lastUpdatedDisplay.textContent = `최신 업데이트: ${timestamp}`;
    }
}


// --- [3. 메인 변환 로직: 통합형 만연체] ---
function convertToPrincessSpeak(text) {
    if (!text.trim()) {
        return {
            text: "평범한 말을 적어주세요! 🥹",
            power: 0
        };
    }

    let processedText = text.trim();

    // 1. 단어 치환
    // 긴 키워드부터 처리하여 부분 일치 방지
    const allKeys = [...Object.keys(NOUN_MAP), ...Object.keys(PRONOUN_MAP)].sort((a, b) => b.length - a.length);

    allKeys.forEach(key => {
        const replacement = NOUN_MAP[key] || PRONOUN_MAP[key];
        // 단어 경계를 사용하여 정확한 단어만 치환
        const regex = new RegExp(`\\b${key}\\b`, 'g');
        processedText = processedText.replace(regex, replacement);
    });

    // 2. 시작 수식어 (딱 한 번)
    processedText = "오호호! ✨ 아가 공주는 " + processedText;

    // 3. 문장 종결 처리 및 중간 연결 (만연체)
    // . ! ? 로 문장을 나누지만, 마지막 마침표만 최종 변환에 사용
    // 중간 마침표는 CONNECTIVES로 변환
    let sentences = processedText.split(/([.!?])/); // 마침표를 포함하여 분리
    sentences = sentences.filter(s => s.trim() !== ''); // 빈 문자열 제거

    let finalPrincessText = [];
    for (let i = 0; i < sentences.length; i++) {
        let currentPart = sentences[i].trim();

        // 마침표가 현재 파트의 마지막인지 확인
        const isPunctuation = currentPart.match(/^[.!?]$/);

        if (isPunctuation) { // 마침표인 경우
            if (i === sentences.length - 1) { // 전체 텍스트의 마지막 마침표
                // 이 부분은 최종 어미 변환에서 처리되므로 여기서는 그냥 추가하거나 무시
                // 현재는 빈 문자열로 두어 아래 최종 처리 로직에 맡김
                // 혹은 문장 끝 장식을 위한 임시 마커로 사용 가능
                finalPrincessText.push(''); // 최종 처리를 위해 현재 마침표는 비워둠
            } else { // 중간 마침표
                // 중간 연결어로 대체 (예: ~하옵고, ~이옵니다만)
                finalPrincessText.push(getRandomElement(CONNECTIVES));
            }
        } else { // 텍스트 부분인 경우
            let seg = currentPart;

            // 광기 불어넣기 (단어 사이 형용사 및 이모지 폭탄)
            let words = seg.split(" ");
            let decoratedWords = words.map(word => {
                let decorated = word;
                if (word.length > 1 && Math.random() < 0.4) decorated = getRandomElement(ADJECTIVES) + " " + decorated;
                if (Math.random() < 0.3) decorated += getRandomElement(EMOJIS); // 이모지 빈도 조절
                return decorated;
            });
            seg = decoratedWords.join(" ");
            
            finalPrincessText.push(seg);
        }
    }

    processedText = finalPrincessText.join(' ').replace(/\s{2,}/g, ' ').trim();

    // 4. 최종 문장 종결 어미 적용 (가장 마지막에 딱 한 번)
    let finalEndingApplied = false;
    // 마지막 텍스트에서 가장 적절한 어미를 찾아서 치환
    const endings = [
        { regex: /([나다요죠니어])\s*$/, replacement: '라고 감히 여쭈어봐도 되겠사와요? 💖' }, // ~니, ~나, ~요, ~죠 등의 끝말
        { regex: /([었겠])(습니다|습니다요|ㅂ니다|하옵니다)\s*$/, replacement: '$1사옵니다, 부디 헤아려 주시옵소서! 🥹' }, // ~었사옵니다, ~겠사옵니다
        { regex: /다\s*$/, replacement: '라고 생각하옵니다, 잊지 마시옵소서! 🌸' },
        { regex: /([.!?])\s*$/, replacement: '이옵니다, 오호호! ✨' } // 기본 마침표
    ];

    for (const endingRule of endings) {
        if (processedText.match(endingRule.regex)) {
            processedText = processedText.replace(endingRule.regex, endingRule.replacement);
            finalEndingApplied = true;
            break;
        }
    }
    // 어떤 규칙도 맞지 않거나, 문장 끝에 마침표가 없는 경우 기본 장식 추가
    if (!finalEndingApplied) {
        processedText += '이옵니다, 공주님의 말씀이시옵니다! 👑';
    }


    // 5. 최종 조사 교정 (한 번만 적용)
    processedText = processedText.replace(/(\S+)(이\/가|은\/는|을\/를|와\/과|으로\/로)/g, (match, word, type) => {
        return word + getJosa(word, type);
    });
    
    // 이모지 카운트는 간략화된 로직에 맞춰 제거 (필요시 복원)
    // exaggeratedPhraseCount 또한 간략화된 로직에 맞춰 제거 (필요시 복원)

    return {
        text: processedText,
        power: Math.min(100, Math.floor(processedText.length / text.length * 20 + 40)) // 길이 기반 파워
    };
}

// --- 이벤트 리스너 및 실행 ---
document.addEventListener('DOMContentLoaded', () => { // DOMContentLoaded를 사용하여 요소가 로드된 후 실행
    const translateButton = document.getElementById('translate-button');
    const copyButton = document.getElementById('copy-button');
    const inputText = document.getElementById('input-text');

    if (translateButton) {
        translateButton.addEventListener('click', () => {
            const input = inputText.value;
            translateButton.disabled = true;
            translateButton.textContent = '아가 공주가 품격을 올리는 중... ✨'; // 버튼 텍스트 변경

            setTimeout(() => {
                const result = convertToPrincessSpeak(input);
                resultText.textContent = result.text;
                
                const power = result.power;
                princessPowerDisplay.textContent = `공주력: ${power}%`;
                princessTitleDisplay.textContent = `칭호: ${power > 80 ? '진정한 광기의 공주' : '수줍은 아가 공주'}`;
                
                translateButton.disabled = false;
                translateButton.textContent = '품격 올리기'; // 버튼 텍스트 변경
            }, 600);
        });
    }

    if (copyButton) {
        copyButton.addEventListener('click', () => {
            navigator.clipboard.writeText(resultText.textContent);
            showToast('공주어 복사 완료 👑');
        });
    }

    if (inputText) {
        inputText.addEventListener('input', () => {
            if (translateButton) {
                translateButton.disabled = inputText.value.trim() === '';
            }
        });
    }

    // 초기 상태 설정
    if (inputText) inputText.value = '';
    if (translateButton) translateButton.disabled = true;

    updateTimestamp(); // 페이지 로드 시 타임스탬프 업데이트
});


function showToast(msg) {
    if (toastMessage) { // toastMessage가 존재하는지 확인
        toastMessage.textContent = msg;
        toastMessage.classList.add('show');
        setTimeout(() => toastMessage.classList.remove('show'), 2000);
    }
}

// updateTimestamp 함수가 전역 스코프에 없었을 경우를 대비하여 DOMContentLoaded 밖에서 정의
function updateTimestamp() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const timestamp = `${year}-${month}-${day} ${hours}:${minutes}`;
    // lastUpdatedDisplay가 null일 경우를 대비하여 추가 확인
    if (lastUpdatedDisplay) {
        lastUpdatedDisplay.textContent = `최신 업데이트: ${timestamp}`;
    }
}