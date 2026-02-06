const inputText = document.getElementById('input-text');
const translateButton = document.getElementById('translate-button');
const resultText = document.getElementById('result-text');
const copyButton = document.getElementById('copy-button');
const toastMessage = document.getElementById('toast-message');
const princessPowerDisplay = document.getElementById('princess-power');
const princessTitleDisplay = document.getElementById('princess-title');
const lastUpdatedDisplay = document.getElementById('last-updated');
const powerFill = document.getElementById('power-fill');
const resultCard = document.getElementById('result-card');

// --- [1. 데이터 정의: 광기의 극대화] ---
const PRONOUN_MAP = {
    '나': '본 공주', '나는': '본 공주는', '내가': '본 공주가', '내': '본 공주의',
    '저': '아기 공주', '저는': '아기 공주는', '제가': '아기 공주가', '저의': '아기 공주의'
};

const NOUN_MAP = {
    '집': '장미 향기가 가득한 비밀 궁궐', '돈': '반짝이는 순금 다이아몬드', 
    '밥': '천상의 맛을 담은 고귀한 만찬', '코딩': '찬란한 보석을 수놓는 바이브 코딩',
    '사랑': '영원한 사랑의 빛줄기', '컴퓨터': '마법의 지혜가 담긴 거울'
};

const ADJECTIVES = ['눈부신', '황홀한', '사랑스러운', '고귀한', '은하수 같은', '장미빛', '찬란한', '영롱한'];
const EMOJIS = ['👑', '✨', '💖', '🥹', '🎀', '💎', '🌸', '🧚‍♀️', '💫', '🌟', '🌷', '🦋', '🦢', '💄', '💍', '🦄'];

const EXAGGERATED_PHRASES = [ // Re-added EXAGGERATED_PHRASES
    '오호호! ✨ 아가 공주는', '천사 공주께서는', '눈부신 미모의 본 공주가 말하길,', '온 세상이 감탄할지니, 본 공주는'
];

const CONNECTIVES = ['하시옵고', '이옵나니', '하시매', '이옵고', '그러하시온데', '또한', '말씀드리옵나이다']; // Re-added CONNECTIVES

// --- [2. 핵심 유틸리티] ---
const getRandom = (arr) => arr[Math.floor(Math.random() * arr.length)]; // Corrected name

// 조사 교정 함수 (받침 유무에 따라 은/는, 이/가 등 자동 교정)
function fixJosa(text) {
    return text.replace(/([가-힣])(은\/는|이\/가|을\/를|와\/과|으로\/로)/g, (match, word, type) => {
        const lastChar = word.charCodeAt(word.length - 1);
        const hasBatchim = (lastChar - 0xac00) % 28 > 0;
        const josaMap = {
            '은/는': hasBatchim ? '은' : '는',
            '이/가': hasBatchim ? '이' : '가',
            '을/를': hasBatchim ? '을' : '를',
            '와/과': hasBatchim ? '과' : '와',
            '으로/로': (lastChar - 0xac00) % 28 === 8 ? '로' : (hasBatchim ? '으로' : '로')
        };
        return word + josaMap[type];
    });
}

// Function to update timestamp
function updateTimestamp() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const timestamp = `${year}-${month}-${day} ${hours}:${minutes}`;
    if (lastUpdatedDisplay) {
        lastUpdatedDisplay.textContent = `최신 업데이트: ${timestamp}`;
    }
}

// Function to generate sparkles dynamically
function generateSparkles(containerId, count) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = ''; 

    for (let i = 0; i < count; i++) {
        const sparkle = document.createElement('div');
        sparkle.classList.add('sparkle');
        sparkle.style.top = `${Math.random() * 100}%`;
        sparkle.style.left = `${Math.random() * 100}%`;
        sparkle.style.width = `${Math.random() * 5 + 3}px`;
        sparkle.style.height = sparkle.style.width;
        sparkle.style.animationDelay = `${Math.random() * 2}s`;
        sparkle.style.animationDuration = `${Math.random() * 1 + 0.5}s`;
        container.appendChild(sparkle);
    }
}


// --- [3. 메인 변환 로직] ---
function convertToPrincessSpeak(text) {
    if (!text.trim()) return { text: "평범한 말을 적어주세요! 🥹", power: 0 };

    let result = text.trim();

    // 1. 명사 및 대명사 치환 (조사를 예약어로 남김)
    Object.keys(NOUN_MAP).forEach(key => {
        const regex = new RegExp(key + "(이|가|은|는|을|를|와|과|으로|로)?", "g");
        result = result.replace(regex, (match, josa) => {
            const type = josa ? (josa.match(/[이가]/) ? '이/가' : josa.match(/[은는]/) ? '은/는' : josa.match(/[을를]/) ? '을/를' : josa.match(/[와과]/) ? '와/과' : '으로/로') : '';
            return NOUN_MAP[key] + (type || '');
        });
    });

    Object.keys(PRONOUN_MAP).forEach(key => {
        result = result.replace(new RegExp(key, "g"), PRONOUN_MAP[key]);
    });

    // 2. 문장 연결 및 광기 서린 형용사 주입
    // 단어 사이사이에 형용사와 이모지를 폭발적으로 넣음
    let words = result.split(/\s+/);
    let decoratedWords = words.map(word => {
        let dec = word;
        if (word.length > 1 && Math.random() < 0.4) dec = getRandom(ADJECTIVES) + " " + dec; // 형용사 추가
        dec += getRandom(EMOJIS); // 단어 끝에 이모지 무조건 하나
        if (Math.random() < 0.7) dec += getRandom(EMOJIS); // 70% 확률로 하나 더
        return dec;
    });

    result = decoratedWords.join(" ");

    // 3. 문장 전체를 하나의 흐름으로 통합 (가장 중요한 부분!)
    // 문장을 쪼개지 않고, 맨 앞과 맨 뒤에만 임팩트를 주어 매끄럽게 만듭니다.
    const prefix = getRandom(EXAGGERATED_PHRASES) + " "; // Use getRandom here
    let suffix = "";

    // 질문인지 평서문인지 판단하여 어미 결정
    if (text.includes("?")) {
        suffix = " 라고 감히 여쭈어보아도 되겠사와요? 💖✨";
    } else {
        suffix = " 라고 본 공주가 우아하게 선포하옵나이다, 오호호! 👑🌸";
    }

    let finalResult = prefix + result + suffix;

    // 4. 최종 조사 교정 실행
    finalResult = fixJosa(finalResult);

    return {
        text: finalResult,
        power: Math.min(100, Math.floor(finalResult.length / text.length * 25 + 30))
    };
}

// --- 이벤트 리스너 및 실행 ---
document.addEventListener('DOMContentLoaded', () => { // DOMContentLoaded를 사용하여 요소가 로드된 후 실행
    // Note: Global variables inputText, translateButton, etc. are already defined at the top.
    // No need to re-declare them locally using const.

    if (translateButton) {
        translateButton.addEventListener('click', () => {
            const input = inputText.value;
            translateButton.disabled = true;
            translateButton.querySelector('.btn-text').textContent = '아가 공주가 품격을 올리는 중... ✨'; // 버튼 텍스트 변경

            setTimeout(() => {
                const result = convertToPrincessSpeak(input);
                resultText.textContent = result.text;
                
                // Update UI elements from new structure
                const power = result.power;
                if (princessPowerDisplay) princessPowerDisplay.textContent = `${power}%`;
                if (powerFill) powerFill.style.width = `${power}%`; // Update power bar fill
                if (princessTitleDisplay) princessTitleDisplay.textContent = `${power > 80 ? '진정한 광기의 공주' : '수줍은 아가 공주'}`;
                
                if (resultCard) resultCard.classList.remove('hidden'); // Show result card

                translateButton.disabled = false;
                translateButton.querySelector('.btn-text').textContent = '품격 올리기'; // 버튼 텍스트 변경
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

    // Initial state setting
    if (inputText) inputText.value = '';
    if (translateButton) translateButton.disabled = true;
    if (resultCard) resultCard.classList.add('hidden'); // Hide result card initially

    updateTimestamp(); // Update timestamp on page load
    generateSparkles('sparkle-layer', 40); // Generate 40 sparkles for increased density
});


function showToast(msg) {
    if (toastMessage) { // toastMessage가 존재하는지 확인
        toastMessage.textContent = msg;
        toastMessage.classList.add('show');
        setTimeout(() => toastMessage.classList.remove('show'), 2000);
    }
}
