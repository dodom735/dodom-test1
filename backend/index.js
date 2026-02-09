require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // Enable parsing of JSON request bodies

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
    console.error('GEMINI_API_KEY is not set in the .env file.');
    process.exit(1);
}

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

// Define the system instruction for the Gemini model
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

app.post('/generate-princess-speak', async (req, res) => {
    const { text } = req.body;

    if (!text) {
        return res.status(400).json({ error: 'Text is required in the request body.' });
    }

    try {
        const result = await model.generateContent({
            contents: [{ parts: [{ text: `SYSTEM_INSTRUCTION: ${systemInstruction}\nUSER_INPUT: ${text}` }] }],
        });
        const response = await result.response;
        const generatedContent = response.text();

        // Attempt to parse the generated content as JSON
        let parsedResponse;
        try {
            parsedResponse = JSON.parse(generatedContent);
        } catch (jsonError) {
            console.error('Error parsing Gemini response as JSON:', jsonError);
            // If Gemini doesn't return valid JSON, try to handle it as plain text
            // and provide a default title.
            return res.status(500).json({
                error: 'Gemini did not return valid JSON. Check prompt instructions.',
                princessSpeak: generatedContent, // Return raw content for debugging
                princessTitle: "👑 혼돈의 공주 (JSON 파싱 오류)"
            });
        }
        
        // Ensure both properties exist in the parsed response
        if (!parsedResponse.princessSpeak || !parsedResponse.princessTitle) {
            return res.status(500).json({
                error: 'Gemini response JSON missing required properties (princessSpeak or princessTitle).',
                princessSpeak: parsedResponse.princessSpeak || generatedContent,
                princessTitle: parsedResponse.princessTitle || "👑 불완전한 공주 (속성 누락)"
            });
        }

        res.json({
            princessSpeak: parsedResponse.princessSpeak,
            princessTitle: parsedResponse.princessTitle
        });
    } catch (error) {
        console.error('Error calling Gemini API:', error);
        res.status(500).json({ error: 'Failed to generate princess speak.' });
    }
});

app.listen(port, () => {
    console.log(`Backend server running on port ${port}`);
});
