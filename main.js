// --- [1. 데이터 정의: 광기의 극대화] ---
const PRONOUN_MAP = {
    '나': '본 공주', '나는': '본 공주는', '내가': '본 공주가', '내': '본 공주의',
    '저': '아기 공주', '저는': '아기 공주는', '제가': '아기 공주가', '저의': '아기 공주의'
};

const NOUN_MAP = {
    '집': '장미 향기가 가득한 비밀 궁궐', '돈': '반짝이는 순금 다이아몬드', 
    '밥': '천상의 맛을 담은 고귀한 만찬', '코딩': '찬란한 보석을 수놓는 바이브 코딩',
    '사랑': '영원한 사랑의 빛줄기', '컴퓨터': '마법의 지혜가 담긴 거울', '일': '고귀한 소임'
};

const ADJECTIVES = ['눈부신', '황홀한', '사랑스러운', '고귀한', '은하수 같은', '장미빛', '찬란한', '영롱한', '치명적인', '도도한'];
const EMOJIS = ['👑', '✨', '💖', '🥹', '🎀', '💎', '🌸', '🧚‍♀️', '💫', '🌟', '🌷', '🦋', '🦢', '💄', '💍', '🦄'];
const EXAGGERATED_PHRASES = ['오호호! ✨ 아가 공주는', '천사 공주께서는', '눈부신 미모의 본 공주가 말하길,', '온 세상이 감탄할지니, 본 공주는'];

const INSULTING_TITLES = [ // 독설 타이틀 추가
    "길가에 핀 잡초 같은 평민",
    "황실에서 쫓겨난 가짜 공주",
    "매너라고는 없는 야생마 같은 공주",
    "공주력 최하층민",
    "본 공주가 혀를 차는 무뢰배 공주",
    "마차 바퀴 아래 깔린 공주",
    "하품만 나오는 지루한 공주",
    "드레스가 다 해진 빈티지 공주",
    "시녀도 고개 젓는 게으른 공주",
    "마법의 힘이 1도 없는 허수아비 공주"
];


// --- [2. 핵심 유틸리티] ---
const getRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];

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

// --- [3. 메인 변환 로직] ---
function convertToPrincessSpeak(text) {
    if (!text.trim()) return { text: "평범한 말을 적어주세요! 🥹", power: 0 };
    let result = text.trim();

    // 1. 단어 치환
    Object.keys(NOUN_MAP).forEach(key => {
        result = result.split(key).join(NOUN_MAP[key]);
    });
    Object.keys(PRONOUN_MAP).forEach(key => {
        result = result.split(key).join(PRONOUN_MAP[key]);
    });

    // 2. 이모지 및 형용사 폭탄 (밀도 70%)
    let words = result.split(/\s+/);
    result = words.map(word => {
        let dec = word;
        if (Math.random() < 0.5) dec = getRandom(ADJECTIVES) + " " + dec;
        dec += getRandom(EMOJIS);
        if (Math.random() < 0.6) dec += getRandom(EMOJIS);
        return dec;
    }).join(" ");

    // 3. 통합형 만연체 생성 (중복 차단)
    const prefix = getRandom(EXAGGERATED_PHRASES) + " ";
    const suffix = text.includes("?") ? " 라고 감히 여쭈어보아도 되겠사와요? 💖✨" : " 라고 본 공주가 우아하게 선포하옵나이다, 오호호! 👑🌸";
    
    let finalResult = fixJosa(prefix + result + suffix);

    return {
        text: finalResult,
        power: Math.min(100, Math.floor(finalResult.length / text.length * 15 + 45))
    };
}

// --- [4. 이벤트 리스너: 시각 효과 추가] ---
document.addEventListener('DOMContentLoaded', () => {
    const UI = {
        input: document.getElementById('input-text'),
        btn: document.getElementById('translate-button'),
        card: document.getElementById('result-card'),
        text: document.getElementById('result-text'),
        power: document.getElementById('princess-power'),
        fill: document.getElementById('power-fill'),
        title: document.getElementById('princess-title'),
        copy: document.getElementById('copy-button')
    };

    // 효과음 추가 (placeholder)
    const sparkleSound = new Audio('audio/sparkle.mp3'); // 뾰로롱 효과음 파일 경로

    UI.btn.addEventListener('click', () => {
        const val = UI.input.value;
        UI.btn.disabled = true;
        const btnLabel = UI.btn.querySelector('.btn-text') || UI.btn;
        btnLabel.textContent = '품격 심사 중... 💅';

        // 효과음 재생
        if (sparkleSound) sparkleSound.play();

        setTimeout(() => {
            const res = convertToPrincessSpeak(val);
            UI.text.textContent = `"${res.text}"`;
            UI.power.textContent = `${res.power}%`;
            if (UI.fill) UI.fill.style.width = `${res.power}%`;
            
            // 광기 서린 타이틀 & 독설 시스템
            if (res.power > 85) {
                UI.title.textContent = "💎 7성급 로열 다이아몬드 공주";
                document.body.style.animation = "shake 0.5s ease"; // 화면 흔들림 효과
                if (UI.card) UI.card.classList.remove('rainbow-bg'); // 혹시 모를 잔여 클래스 제거
            } else if (res.power > 60) {
                UI.title.textContent = "🌸 수줍은 핑크 진주 아기공주";
                if (UI.card) UI.card.classList.remove('rainbow-bg');
            } else {
                UI.title.textContent = getRandom(INSULTING_TITLES); // 독설 타이틀 무작위 선택
                document.body.style.animation = "shake 0.5s ease"; // 화면 흔들림 효과
                if (UI.card) UI.card.classList.remove('rainbow-bg');
            }

            // 공주력 90% 이상 시 무지개 배경 효과
            if (res.power >= 90) { // 90%를 넘으면
                if (UI.card) UI.card.classList.add('rainbow-bg');
            }


            UI.card.classList.remove('hidden');
            UI.btn.disabled = false;
            btnLabel.textContent = '✨ 공주로 승격하기 ✨';
            setTimeout(() => document.body.style.animation = "", 500); // 흔들림 효과 리셋
        }, 800);
    });

    UI.copy.addEventListener('click', () => {
        navigator.clipboard.writeText(UI.text.textContent);
        const toast = document.getElementById('toast-message');
        toast.textContent = "황실의 문장이 복사되었습니다 👑";
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 2000);
    });

    // 초기 상태 및 업데이트 일자
    updateTimestamp();
    generateSparkles('sparkle-layer', 40); // 스파클 재생성
});

// 페이지 로드 시 타임스탬프 업데이트 (한 번만 실행)
function updateTimestamp() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const timestamp = `${year}-${month}-${day} ${hours}:${minutes}`;
    const lastUpdatedElement = document.getElementById('last-updated');
    if (lastUpdatedElement) {
        lastUpdatedElement.textContent = `최신 업데이트: ${timestamp}`;
    }
}

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