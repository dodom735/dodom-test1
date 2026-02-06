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

// Function to generate sparkles dynamically
function generateSparkles(containerId, count) {
    const container = document.getElementById(containerId);
    if (!container) return;

    // Clear existing sparkles to avoid accumulation on re-render if any
    container.innerHTML = ''; 

    for (let i = 0; i < count; i++) {
        const sparkle = document.createElement('div');
        sparkle.classList.add('sparkle');
        sparkle.style.top = `${Math.random() * 100}%`;
        sparkle.style.left = `${Math.random() * 100}%`;
        sparkle.style.width = `${Math.random() * 5 + 3}px`; // 3-8px
        sparkle.style.height = sparkle.style.width;
        sparkle.style.animationDelay = `${Math.random() * 2}s`;
        sparkle.style.animationDuration = `${Math.random() * 1 + 0.5}s`; // 0.5-1.5s
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
        if (Math.random() < 0.4) dec = getRandom(ADJECTIVES) + " " + dec; // 형용사 추가
        dec += getRandom(EMOJIS); // 단어 끝에 이모지 무조건 하나
        if (Math.random() < 0.7) dec += getRandom(EMOJIS); // 70% 확률로 하나 더
        return dec;
    });

    result = decoratedWords.join(" ");

    // 3. 문장 전체를 하나의 흐름으로 통합 (가장 중요한 부분!)
    // 문장을 쪼개지 않고, 맨 앞과 맨 뒤에만 임팩트를 주어 매끄럽게 만듭니다.
    const prefix = "오호호! ✨ 존귀하신 본 공주가 읊조리길, ";
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
            translateButton.querySelector('.btn-text').textContent = '아가 공주가 품격을 올리는 중... ✨'; // Update text inside span

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
                translateButton.querySelector('.btn-text').textContent = '품격 올리기'; // Update text inside span
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