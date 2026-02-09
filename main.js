// --- [1. 데이터 정의: 광기의 극대화] ---
// ⚠️ 경고: 이 파일에 API 키를 직접 노출하는 것은 보안상 매우 위험합니다! ⚠️
// 실제 서비스에서는 반드시 백엔드 서버를 통해 API 키를 안전하게 관리해야 합니다.
// 사용자 요청에 따라 클라이언트 측에서 직접 API를 호출하도록 구현되었습니다.
const GEMINI_API_KEY = "YOUR_GEMINI_API_KEY_HERE"; // 여기에 Gemini API 키를 입력하세요!

// Google Generative AI SDK (CDN을 통해 로드)
import { GoogleGenerativeAI } from "https://esm.run/@google/generative-ai";


// --- [1. 데이터 정의: 광기의 극대화] ---
// 이 섹션의 모든 하드코딩된 규칙은 Gemini API의 지시문으로 대체됩니다.

// --- [2. 핵심 유틸리티] ---
// 기존 getRandom 및 fixJosa 함수는 Gemini API가 모든 변환을 처리하므로 더 이상 필요 없습니다.


// --- [3. 메인 변환 로직] ---
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-pro" }); // gemini-pro 모델 사용

const SYSTEM_INSTRUCTION = `
당신은 평범한 문장을 과장된 '공주어'로 변환하고 그 '공주력'을 심사하는 까다로운 심사위원 공주입니다.

변환 규칙:
1. 1인칭(나, 저) 금지. 무조건 '본 공주', '아기공주', '공주님' 등 3인칭 사용.
2. 이모티콘 밀도 극대화: 문장 시작, 중간(단어 사이), 끝에 이모티콘을 쏟아부으세요. 
   - 사용 이모티콘: 👑, ✨, 💖, 🥹, 🎀, 🍭, 💘, 🧚‍♀️, 🍰, 💍, 🌸, 🍬, 🦋, 🧁, 🦄, 💒, 🍨, 🦢, 🩰, 💅, 🧸, 🥂, 🕊️, 💎, 💄.
3. 말투: 세상에서 가장 우아하면서도 재수없을 정도로 귀여운 극강의 애교 말투.

심사 규칙 (princessLevel):
1. 공주력 점수는 매우 '보수적'이고 '냉정'하게 책정하세요. 
2. 평범한 일상어(배고파, 졸려 등)는 공주어로 바꿔도 30~50점대에 머물러야 합니다.
3. 아주 정성스럽고 화려한 공주어라도 90점을 넘기기 매우 어렵게 설정하세요.
4. 100점은 정말 누가 봐도 완벽한 로열 패밀리의 품격과 애교가 느껴질 때만 드물게 부여하세요.
5. 사용자가 100점을 받기 위해 계속 도전하고 싶게끔 점수를 짜게 주어야 합니다.

결과는 반드시 JSON 형식으로만 응답하세요.
`;

async function convertToPrincessSpeak(input) {
    if (!input.trim()) {
        return {
            princessText: "평범한 말을 적어주세요! 🥹",
            princessTitle: "👑 예비 공주",
            princessLevel: 0
        };
    }

    try {
        const response = await model.generateContent({
            contents: [{ parts: [{ text: `이 비루한 문장을 고귀한 공주어로 바꾸고 심사하라: "${input}"` }] }],
            generationConfig: {
                // responseMimeType: "application/json", // This doesn't seem to work as expected in the browser SDK
                // responseSchema is not directly supported in the browser SDK `generateContent` method's config.
                // We'll rely on parsing the text response as JSON and handle errors.
            },
            systemInstruction: { parts: [{ text: SYSTEM_INSTRUCTION }] },
        });

        const generatedContent = response.response.text();
        let parsedResult;

        try {
            parsedResult = JSON.parse(generatedContent);
        } catch (e) {
            console.error("Gemini response was not valid JSON:", generatedContent, e);
            return {
                princessText: generatedContent || "공주가 💎 너무 👑 기품 🎀 넘쳐서 ✨ 말을 잃었어여 💍 🦢",
                princessTitle: "👑 혼돈의 공주 (JSON 파싱 오류)",
                princessLevel: 0
            };
        }

        // Validate required properties
        if (!parsedResult.princessText || !parsedResult.princessTitle || parsedResult.princessLevel === undefined) {
            console.error("Gemini response JSON missing required properties:", parsedResult);
            return {
                princessText: parsedResult.princessText || "공주가 💎 너무 👑 기품 🎀 넘쳐서 ✨ 말을 잃었어여 💍 🦢",
                princessTitle: parsedResult.princessTitle || "👑 불완전한 공주 (속성 누락)",
                princessLevel: parsedResult.princessLevel || 0
            };
        }

        return {
            princessText: parsedResult.princessText,
            princessTitle: parsedResult.princessTitle,
            princessLevel: parsedResult.princessLevel
        };

    } catch (error) {
        console.error("Error calling Gemini API directly:", error);
        return {
            princessText: `API 호출 오류 발생: ${error.message} 😭`,
            princessTitle: "🪨 돌멩이 같은 오류 발생!",
            princessLevel: 0
        };
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
            UI.text.textContent = `"${res.princessText}"`;
            UI.power.textContent = `${res.princessLevel}%`;
            
            // 게이지 바 애니메이션
            if (UI.fill) {
                // 짧은 딜레이 후 애니메이션 시작
                setTimeout(() => {
                    UI.fill.style.transition = 'width 1.5s ease-out'; // 애니메이션 지속 시간 설정
                    UI.fill.style.width = `${res.princessLevel}%`;
                }, 100);
            }
            
            // 광기 서린 타이틀 & 독설 시스템 (Gemini API가 결정)
            UI.title.textContent = res.princessTitle;

            // 공주력 90% 이상 시 무지개 배경 효과
            if (res.princessLevel >= 90) {
                if (UI.card) UI.card.classList.add('rainbow-bg');
            }


            UI.card.classList.remove('hidden');
            document.body.style.animation = ""; // 흔들림 효과 리셋
            // Gemini가 독설 칭호를 부여했을 경우 흔들림 효과 추가
            if (res.princessTitle.includes("평민") || res.princessTitle.includes("가짜") || res.princessTitle.includes("무뢰배")) {
                document.body.style.animation = "shake 0.5s ease"; 
            }

        } catch (error) {
            console.error("공주 말투 변환 중 오류 발생:", error);
            UI.text.textContent = `오류 발생: ${error.message}. Gemini API 키가 올바른지 확인해주세요. 😭`;
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