const inputText = document.getElementById('input-text');
const translateButton = document.getElementById('translate-button');
const resultText = document.getElementById('result-text');
const copyButton = document.getElementById('copy-button');
const toastMessage = document.getElementById('toast-message');

const PRONOUN_MAP = {
    '나': '공주는', '나는': '공주는', '내가': '공주가', '내': '공주의', '저': '공주는', '저는': '공주는', '제가': '공주가', '저의': '공주의',
    '우리': '공주님들은', '우리는': '공주님들은', '우리가': '공주님들이', '우리의': '공주님들의'
};

const EXAGGERATED_PHRASES = [
    '정말이지...', '세상에!', '어머나!', '맙소사!', '이게 무슨 일이죠?', '정말 곤란하답니다 🥹', '공주 심장이 콩닥콩닥!', '어떡하죠? 💖', '말도 안돼요!', '공주는 행복하답니다 ✨'
];

const EMOJIS = ['👑', '✨', '💖', '🥹', '🎀', '💎', '🌸', '🧚‍♀️', '🦄', '💫', '🌟', '🌷', '🦋', '🦢'];

function getRandomElement(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

function convertToPrincessSpeak(text) {
    if (!text.trim()) {
        return "평범한 말을 적어주세요! 공주가 기다리고 있답니다 🥹";
    }

    let result = text;

    // 1. Pronoun Replacement
    for (const [key, value] of Object.entries(PRONOUN_MAP)) {
        // Use regex with word boundaries to avoid partial matches
        const regex = new RegExp(`\b${key}\b`, 'g');
        result = result.replace(regex, value);
    }

    // 2. Exaggerated Phrases & Emojis
    // Split by sentence-ending punctuation (., ?, !)
    const sentences = result.split(/([.!?]+)/);
    let princessSentences = [];

    for (let i = 0; i < sentences.length; i++) {
        let sentence = sentences[i].trim();
        if (sentence === '' || sentences[i].match(/^[.!?]+$/)) { // Handle empty strings and just punctuation
            princessSentences.push(sentences[i]);
            continue;
        }

        // Add exaggerated phrase randomly
        if (Math.random() < 0.3) { // 30% chance
            sentence = getRandomElement(EXAGGERATED_PHRASES) + ' ' + sentence;
        }

        // Add emoji to sentence end
        if (sentences[i+1] && sentences[i+1].match(/^[.!?]+$/)) { // Check if the next element is punctuation
            sentence += getRandomElement(EMOJIS);
        } else if (!sentences[i+1]) { // End of text and no punctuation followed
             sentence += getRandomElement(EMOJIS);
        }
        
        princessSentences.push(sentence);
    }

    result = princessSentences.join('');
    
    // 3. Add random emojis more aggressively to the end of the text
    if (Math.random() < 0.5) { // 50% chance for more emojis at the very end
        result += ' ' + Array.from({length: Math.floor(Math.random() * 3) + 1}, () => getRandomElement(EMOJIS)).join('');
    }

    return result.trim();
}

// Event Listeners
translateButton.addEventListener('click', () => {
    const input = inputText.value;
    translateButton.disabled = true;
    translateButton.textContent = '공주가 생각 중이에요... ✨'; // Loading state
    
    // Simulate processing time for better UX
    setTimeout(() => {
        resultText.textContent = convertToPrincessSpeak(input);
        translateButton.disabled = false;
        translateButton.textContent = '✨ 공주로 만들어줘 ✨';
    }, 800);
});

copyButton.addEventListener('click', async () => {
    const textToCopy = resultText.textContent;
    try {
        await navigator.clipboard.writeText(textToCopy);
        showToast('공주어 복사 완료 👑');
    } catch (err) {
        console.error('Failed to copy text:', err);
        alert('복사에 실패했습니다 🥹');
    }
});

inputText.addEventListener('input', () => {
    translateButton.disabled = inputText.value.trim() === '';
});

// Initial state
translateButton.disabled = true; // Disable until input is provided

function showToast(message) {
    toastMessage.textContent = message;
    toastMessage.classList.add('show');
    setTimeout(() => {
        toastMessage.classList.remove('show');
    }, 3000); // Hide after 3 seconds
}
