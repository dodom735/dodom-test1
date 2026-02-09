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
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

const systemInstruction = `
너는 어떤 텍스트든 '공주님의 우아한 일기' 스타일로 재구성하는 최고의 AI 비서이다. 다음 규칙을 엄격하게 지켜서 출력해라:

1.  **작문 모드**: 입력된 문장의 단어를 단순히 치환하는 것을 넘어, 문장 전체를 '공주님의 우아한 일기' 스타일로 재창조하라. 이는 가장 중요하다.
2.  **자연스러운 어미**: 문장 끝은 '~했답니당 💖', '~해용 ✨', '~어울리네용 🦢'처럼 자연스럽고 애교 넘치는 로열 말투로 통일하라. 한국어 문법과 조사를 완벽하게 사용하며, 어미가 반복되지 않도록 주의하라.
3.  **이모지 폭격**: 모든 단어 사이에 최소 하나 이상의 이모지를 무작위로 사용하여 문장을 장식하라. 글자보다 이모지가 더 눈에 띄도록 하되, 너무 과도하여 가독성을 해치지 않도록 균형을 맞춰라.
4.  **다양한 어휘**: 공주님이라면 사용할 법한 고귀하고 아름다운 형용사, 명사, 대명사를 풍부하게 활용하라. (예: '나' -> '본 공주', '집' -> '장미 향기가 가득한 비밀 궁궐', '코딩' -> '찬란한 보석을 수놓는 바이브 코딩')
5.  **독설 칭호 포함 (선택적)**: 만약 원문의 내용이나 변환된 결과의 '공주력'이 매우 낮다고 판단되면, 독설적인 칭호(예: "길가에 핀 잡초 같은 평민", "황실에서 쫓겨난 가짜 공주")를 함께 출력할 수 있다.
6.  **출력 형식**: 결과는 반드시 JSON 형식으로 반환해야 한다. 다음 두 가지 속성을 포함해야 한다:
    *   \`princessSpeak\`: 변환된 공주 말투 텍스트.
    *   \`princessTitle\`: 해당 텍스트에 어울리는 공주력 칭호 (예: "💎 7성급 로열 다이아몬드 공주", "🌸 수줍은 핑크 진주 아기공주", "길가에 핀 잡초 같은 평민").
    
예시 출력:
\`\`\`json
{
  "princessSpeak": "아기공주는 바이브 코딩으로 아주 즐거운 하루를 보냈답니당! 이런 고귀한 취미는 본 공주에게 딱 어울리네용 ✨",
  "princessTitle": "💎 7성급 로열 다이아몬드 공주"
}
\`\`\`
`;

async function convertToPrincessSpeak(text) {
    if (!text.trim()) return { text: "평범한 말을 적어주세요! 🥹", power: 0, princessTitle: "👑 예비 공주" };

    try {
        const result = await model.generateContent({
            contents: [{ parts: [{ text: `SYSTEM_INSTRUCTION: ${systemInstruction}\nUSER_INPUT: ${text}` }] }],
        });
        const response = await result.response;
        const generatedContent = response.text();

        let parsedResponse;
        try {
            parsedResponse = JSON.parse(generatedContent);
        } catch (jsonError) {
            console.error('Error parsing Gemini response as JSON:', jsonError);
            return {
                text: generatedContent,
                power: 0,
                princessTitle: "👑 혼돈의 공주 (JSON 파싱 오류)"
            };
        }
        
        if (!parsedResponse.princessSpeak || !parsedResponse.princessTitle) {
            return {
                text: parsedResponse.princessSpeak || generatedContent,
                power: 0,
                princessTitle: parsedResponse.princessTitle || "👑 불완전한 공주 (속성 누락)"
            };
        }

        const power = Math.min(100, Math.floor(parsedResponse.princessSpeak.length / text.length * 15 + 45));

        return {
            text: parsedResponse.princessSpeak,
            power: power,
            princessTitle: parsedResponse.princessTitle
        };
    } catch (error) {
        console.error('Error calling Gemini API directly:', error);
        return { text: `API 호출 오류 발생: ${error.message} 😭`, power: 0, princessTitle: "🪨 돌멩이 같은 오류 발생!" };
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