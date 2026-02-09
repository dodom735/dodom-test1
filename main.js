// --- [1. 데이터 정의: 광기의 극대화] ---
// --- [1. 데이터 정의: 광기의 극대화] ---
// 이 섹션의 모든 하드코딩된 규칙은 Gemini API의 지시문으로 대체됩니다.

// --- [2. 핵심 유틸리티] ---
// 기존 getRandom 및 fixJosa 함수는 Gemini API가 모든 변환을 처리하므로 더 이상 필요 없습니다.


// --- [3. 메인 변환 로직] ---
async function convertToPrincessSpeak(text) {
    if (!text.trim()) return { text: "평범한 말을 적어주세요! 🥹", power: 0 };

    try {
        const response = await fetch('http://localhost:3000/generate-princess-speak', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ text }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Backend API request failed.');
        }

        const data = await response.json();
        // The power calculation will likely need to be adjusted based on the Gemini API response
        // For now, let's make it a simple calculation based on length, or a fixed value.
        // Or, we can refine this later if the API provides a "power" score.
        // For now, let's make it fixed for demo purposes.
        const power = Math.min(100, Math.floor(data.princessSpeak.length / text.length * 15 + 45));

        return {
            text: data.princessSpeak,
            power: power,
            princessTitle: data.princessTitle
        };
    } catch (error) {
        console.error('Error in convertToPrincessSpeak:', error);
        return { text: `API 호출 오류 발생: ${error.message} 😭`, power: 0 };
    }
}

// --- [4. 이벤트 리스너: 시각 효과 추가] ---
document.addEventListener('DOMContentLoaded', () => {
    const UI = {
        input: document.getElementById('input-text'),
        btn: document.getElementById('translate-button'),
        card: document.getElementById('result-card'),
        text: document.getElementById('result-text'), // This is back to having an ID
        power: document.getElementById('princess-power'), // This is back to having an ID
        fill: document.getElementById('power-fill'), // This is back to having an ID
        title: document.getElementById('princess-title'), // This is back to having an ID
        copy: document.getElementById('copy-button')
    };

    // 효과음 추가 (placeholder)
    const sparkleSound = new Audio('audio/sparkle.mp3'); // 뾰로롱 효과음 파일 경로

    UI.btn.addEventListener('click', async () => {
        const val = UI.input.value;
        if (!val.trim()) {
            UI.text.textContent = "평범한 말을 적어주세요! 🥹";
            UI.card.classList.remove('hidden');
            return;
        }

        UI.btn.disabled = true;
        const btnLabel = UI.btn.querySelector('.btn-text') || UI.btn;
        btnLabel.textContent = '품격 심사 중... 💅';

        // 효과음 재생
        if (sparkleSound) sparkleSound.play();

        // 게이지 바 초기화
        if (UI.fill) UI.fill.style.width = '0%';
        if (UI.card) UI.card.classList.remove('rainbow-bg'); // 모든 경우에 초기화

        try {
            const res = await convertToPrincessSpeak(val);
            UI.text.textContent = `"${res.text}"`;
            UI.power.textContent = `${res.power}%`;
            
            // 게이지 바 애니메이션
            if (UI.fill) {
                // 짧은 딜레이 후 애니메이션 시작
                setTimeout(() => {
                    UI.fill.style.transition = 'width 1.5s ease-out'; // 애니메이션 지속 시간 설정
                    UI.fill.style.width = `${res.power}%`;
                }, 100);
            }
            
            // 광기 서린 타이틀 & 독설 시스템 (Gemini API가 결정)
            UI.title.textContent = res.princessTitle;

            // 공주력 90% 이상 시 무지개 배경 효과
            if (res.power >= 90) {
                if (UI.card) UI.card.classList.add('rainbow-bg');
            }


            UI.card.classList.remove('hidden');
            setTimeout(() => document.body.style.animation = "", 500); // 흔들림 효과 리셋

        } catch (error) {
            console.error("공주 말투 변환 중 오류 발생:", error);
            UI.text.textContent = `오류 발생: ${error.message}. 백엔드 서버가 실행 중인지, Gemini API 키가 올바른지 확인해주세요. 😭`;
            UI.power.textContent = `0%`;
            if (UI.fill) UI.fill.style.width = `0%`;
            UI.title.textContent = "🪨 돌멩이 같은 오류 발생!";
            UI.card.classList.remove('hidden');
        } finally {
            UI.btn.disabled = false;
            btnLabel.textContent = '✨ 공주로 승격하기 ✨';
            // 게이지 바 애니메이션을 위해 transition 속성 초기화 (다음 번 클릭 시 재적용)
            if (UI.fill) {
                setTimeout(() => {
                    UI.fill.style.transition = ''; 
                }, 1600); // 애니메이션 시간보다 길게 설정
            }
        }
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