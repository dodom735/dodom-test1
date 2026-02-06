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

// --- [2. 핵심 유틸리티: 조사 자동 교정] ---
function getJosa(word, type) {
    const lastChar = word.charCodeAt(word.length - 1);
    const hasBatchim = (lastChar - 0xac00) % 28 > 0;
    const josaMap = {
        '이/가': hasBatchim ? '이' : '가',
        '은/는': hasBatchim ? '은' : '는',
        '을/를': hasBatchim ? '을' : '를'
    };
    return josaMap[type] || '';
}

// --- [3. 메인 변환 로직: 통합형 만연체] ---
function convertToPrincessSpeak(text) {
    if (!text.trim()) return { text: "평범한 말을 적어주세요! 🥹", power: 0 };

    let result = text.trim();

    // 1. 단어 치환 및 조사 예약
    Object.keys(NOUN_MAP).forEach(key => {
        const replacement = NOUN_MAP[key];
        // 조사가 붙을 수 있는 자리를 예약함
        result = result.split(key + "가").join(replacement + "이/가");
        result = result.split(key + "이").join(replacement + "이/가");
        result = result.split(key + "는").join(replacement + "은/는");
        result = result.split(key + "은").join(replacement + "은/는");
        result = result.split(key).join(replacement);
    });

    Object.keys(PRONOUN_MAP).forEach(key => {
        result = result.split(key).join(PRONOUN_MAP[key]);
    });

    // 2. 시작과 끝 수식어 (딱 한 번만!)
    result = "오호호! ✨ 아가 공주는 " + result;
    
    // 3. 문장 종결 처리 (중복 방지)
    result = result.replace(/[.!?\s]+$/, ""); // 기존 마침표 제거
    if (result.endsWith("나") || result.endsWith("까")) {
        result += "라고 감히 여쭈어봐도 되겠사와요? 💖";
    } else {
        result += "라고 생각하옵니다, 잊지 마시옵소서! 🌸";
    }

    // 4. 광기 불어넣기 (단어 사이 형용사 및 이모지 폭탄)
    let words = result.split(" ");
    let crazyResult = words.map(word => {
        let decorated = word;
        if (Math.random() < 0.4) decorated = getRandomElement(ADJECTIVES) + " " + decorated;
        if (Math.random() < 0.6) decorated += getRandomElement(EMOJIS);
        return decorated;
    }).join(" ");

    // 5. 최종 조사 교정
    crazyResult = crazyResult.replace(/([가-힣])(이\/가|은\/는|을\/를)/g, (match, word, type) => {
        return word + getJosa(word, type);
    });

    return {
        text: crazyResult,
        power: Math.min(100, Math.floor(crazyResult.length / text.length * 15 + 40))
    };
}

function getRandomElement(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

// --- 이벤트 리스너 및 실행 ---
translateButton.addEventListener('click', () => {
    const input = inputText.value;
    translateButton.disabled = true;
    translateButton.textContent = '공주가 생각 중... ✨';

    setTimeout(() => {
        const result = convertToPrincessSpeak(input);
        resultText.textContent = result.text;
        // princessPowerDisplay와 princessTitleDisplay를 직접 업데이트
        const power = result.power;
        princessPowerDisplay.textContent = `공주력: ${power}%`;
        princessTitleDisplay.textContent = `칭호: ${power > 80 ? '진정한 광기의 공주' : '수줍은 아가 공주'}`;
        
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
