const inputText = document.getElementById('input-text');
const translateButton = document.getElementById('translate-button');
const resultText = document.getElementById('result-text');
const copyButton = document.getElementById('copy-button');
const toastMessage = document.getElementById('toast-message');
const princessPowerDisplay = document.getElementById('princess-power');
const princessTitleDisplay = document.getElementById('princess-title');
const lastUpdatedDisplay = document.getElementById('last-updated'); // Re-added display element

// --- [1. 데이터 정의: 더 화려하고 미치게] ---
const PRONOUN_MAP = {
    '나': '본 공주는', '나는': '본 공주는', '내가': '아기 공주가', '내': '본 공주의', '저': '본 공주는', '저는': '본 공주는', '제가': '아기 공주가', '저의': '본 공주의'
};

const NOUN_MAP = {
    '집': '장미 향기가 가득한 비밀 궁궐',
    '돈': '반짝이는 순금 다이아몬드',
    '밥': '천상의 맛을 담은 고귀한 만찬',
    '코딩': '찬란한 보석을 수놓는 바이브 코딩',
    '오늘': '눈부시게 아름다운 금일',
    '친구': '소중하고 우아한 나의 벗',
    '사랑': '영원한 사랑의 빛줄기',
    '시간': '찰나의 영원과 같은 순간',
    '컴퓨터': '마법의 지혜가 담긴 거울',
    '모두': '존귀하신 모든 백성'
};

const ADJECTIVES = ['눈부신', '황홀한', '사랑스러운', '고귀한', '은하수 같은', '장미빛', '찬란한', '영롱한', '매혹적인', '섬세한', '우아한', '아리따운', '환상적인'];
const EMOJIS = ['👑', '✨', '💖', '🥹', '🎀', '💎', '🌸', '🧚‍♀️', '💫', '🌟', '🌷', '🦋', '🦢', '💖', '✨']; // 더 많은 이모지, 중복 허용
const EXAGGERATED_PHRASES = [
    '오호호! ✨ 아가 공주는', '천사 공주께서는', '눈부신 미모의 본 공주가 말하길,', '온 세상이 감탄할지니, 본 공주는'
];
const CONNECTIVES = ['하시옵고', '이옵나니', '하시매', '이옵고', '그러하시온데', '또한', '말씀드리옵나이다']; // 중간 연결어

// --- [2. 핵심 유틸리티: 조사 자동 교정] ---
function getRandomElement(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

function getJosa(word, type) {
    if (!word || typeof word !== 'string') return '';
    const lastChar = word.charCodeAt(word.length - 1);
    const hasBatchim = (lastChar - 0xac00) % 28 > 0;
    const josaMap = {
        '이/가': hasBatchim ? '이' : '가',
        '은/는': hasBatchim ? '은' : '는',
        '을/를': hasBatchim ? '을' : '를',
        '와/과': hasBatchim ? '과' : '와',
        '으로/로': (lastChar - 0xac00) % 28 === 8 ? '로' : (hasBatchim ? '으로' : '로')
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

    // 1. 글로벌 Noun/Pronoun Replacement (더 엄격한 단어 경계)
    // 긴 키워드부터 처리하여 부분 일치 및 순서 문제 방지
    const orderedNounKeys = Object.keys(NOUN_MAP).sort((a, b) => b.length - a.length);
    orderedNounKeys.forEach(key => {
        const replacement = NOUN_MAP[key];
        // 단어 경계: 앞뒤로 공백, 구두점, 문자열 시작/끝을 확인
        const regex = new RegExp(`(?<=\\s|^|[.!?,"'])${key}(?=\\s|$|[.!?,"'])`, 'g');
        processedText = processedText.replace(regex, replacement);
    });

    const orderedPronounKeys = Object.keys(PRONOUN_MAP).sort((a, b) => b.length - a.length);
    orderedPronounKeys.forEach(key => {
        const replacement = PRONOUN_MAP[key];
        const regex = new RegExp(`(?<=\\s|^|[.!?,"'])${key}(?=\\s|$|[.!?,"'])`, 'g');
        processedText = processedText.replace(regex, replacement);
    });

    // 2. 1인칭 대명사 강제 ("본 공주", "아기 공주"로 고정)
    // PRONOUN_MAP에 없는 일반적인 1인칭도 추가적으로 처리
    processedText = processedText.replace(/\b(나|나는|내가|내게|나를)\b/g, '본 공주');
    processedText = processedText.replace(/\b(저|저는|제가|저의)\b/g, '아기 공주');

    // 3. 시작 수식어 (딱 한 번)
    processedText = getRandomElement(EXAGGERATED_PHRASES) + " " + processedText;

    // 4. 문장 중간 마침표를 최소화하고 연결어로 길게 이어가기
    // 텍스트의 마지막에 있는 마침표를 제외한 모든 마침표, 느낌표, 물음표를 연결어로 대체
    processedText = processedText.replace(/([.!?])(?!\s*$)/g, (match, punc) => {
        return getRandomElement(CONNECTIVES) + ' ';
    });
    // 마지막에 남을 수 있는 마침표도 제거하여 아래 최종 어미 처리에서만 적용되도록 함
    processedText = processedText.replace(/[.!?\s]+$/, '').trim();

    // 5. 광기 불어넣기 (단어 사이 형용사 및 이모지 폭탄)
    let words = processedText.split(/\s+/); // 공백 기준으로 분리
    let crazyResultParts = words.map(word => {
        let decorated = word;
        // 단어에 형용사 추가
        if (word.length > 1 && Math.random() < 0.3) { // 빈도 조절
            decorated = getRandomElement(ADJECTIVES) + " " + decorated;
        }
        // 단어마다 이모지 1~2개씩 추가 (광기!)
        decorated += getRandomElement(EMOJIS);
        if (Math.random() < 0.5) decorated += getRandomElement(EMOJIS); // 50% 확률로 하나 더
        return decorated;
    });
    let finalCrazyResult = crazyResultParts.join(" ");

    // 6. "one-shot conversion" 최종 문장 종결 (LLM이 한 번에 완결하는 느낌)
    // 기존 마침표를 제거한 상태에서, 하나의 최종 로열 공주님 어미를 붙임
    // '재수없을 정도로 고귀한 로열 공주님' 톤을 반영
    finalCrazyResult = finalCrazyResult.replace(/[.!?\s]+$/, '').trim(); // 혹시 남아있을 구두점 제거

    // 특정 조건에 따라 다른 최종 어미를 붙여 다양성 확보
    // 여기서는 사용자의 요청에 따라 '재수없을 정도로 고귀한' 톤을 직접 반영한 어미를 사용
    if (finalCrazyResult.endsWith("하옵니까") || finalCrazyResult.endsWith("사옵니까") || finalCrazyResult.endsWith("오리까")) {
        finalCrazyResult += "라고 감히 본 공주가 여쭈어보옵니다, 오호호! 💖✨";
    } else {
        finalCrazyResult += "라고 본 공주가 생각하옵니다, 감히 거역할 수 없는 진리이옵니다! 👑🌸";
    }
    
    // 7. 최종 조사 교정
    finalCrazyResult = finalCrazyResult.replace(/(\S+)(이\/가|은\/는|을\/를|와\/과|으로\/로)/g, (match, word, type) => {
        return word + getJosa(word, type);
    });

    return {
        text: finalCrazyResult,
        power: Math.min(100, Math.floor(finalCrazyResult.length / text.length * 20 + 50)) // 더욱 공격적인 파워 계산
    };
}