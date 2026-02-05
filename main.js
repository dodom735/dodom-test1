const inputText = document.getElementById('input-text');
const translateButton = document.getElementById('translate-button');
const resultText = document.getElementById('result-text');
const copyButton = document.getElementById('copy-button');
const toastMessage = document.getElementById('toast-message');
const princessPowerDisplay = document.getElementById('princess-power'); // New
const princessTitleDisplay = document.getElementById('princess-title'); // New

const PRONOUN_MAP = {
    '나': '공주는', '나는': '공주는', '내가': '공주가', '내': '공주의', '저': '공주는', '저는': '공주는', '제가': '공주가', '저의': '공주의',
    '우리': '공주님들은', '우리는': '공주님들은', '우리가': '공주님들이', '우리의': '공주님들의', '내게': '공주에게', '나를': '공주를'
};

const EXAGGERATED_PHRASES = [
    '오늘도 공주는', '아가 공주는', '아가 토끼 공주는', '공주가 말하길,', '이 공주는', '놀랍게도, 공주는', '천사 공주께서는', '귀여운 아가는'
];

const EMOJIS = ['👑', '✨', '💖', '🥹', '🎀', '💎', '🌸', '🧚‍♀️', '🦄', '💫', '🌟', '🌷', '🦋', '🦢', '🌟']; // Increased density

// Keywords for Princess Titles - more specific matches first
const PRINCESS_TITLES = [
    { keywords: ['사랑해', '좋아해', '내꺼'], title: '사랑에 빠진 공주' },
    { keywords: ['배고파', '먹을까', '뭐먹지'], title: '항상 배가 고픈 공주' },
    { keywords: ['졸려', '피곤해', '자고싶다'], title: '잠자는 숲속의 공주' },
    { keywords: ['화나', '짜증나', '싫어'], title: '버럭 공주' },
    { keywords: ['힘들어', '어려워'], title: '지쳐버린 공주' },
    { keywords: ['행복해', '기뻐', '최고'], title: '세상 행복한 공주' },
    { keywords: ['심심해', '할 일 없어'], title: '지루한 공주' },
    { keywords: ['놀러가', '여행', '갈까'], title: '모험을 떠나는 공주' },
    { keywords: ['고마워', '감사'], title: '감사하는 마음의 공주' },
    { keywords: ['미안해', '잘못'], title: '반성하는 공주' },
    { keywords: ['더워', '더움'], title: '뜨거운 성격의 공주' },
    { keywords: ['추워', '추움'], title: '추위를 타는 공주' },
    { keywords: ['눈물', '슬퍼'], title: '눈물이 많은 공주' },
    { keywords: ['비밀', '쉿'], title: '비밀을 간직한 공주' },
    { keywords: ['멋져', '예뻐', '아름다워'], title: '자신감 넘치는 공주' },
    { keywords: ['공부', '과제', '시험'], title: '열공 공주' },
    { keywords: ['일', '야근', '퇴근'], title: '열일하는 공주' },
    { keywords: ['커피', '카페인'], title: '커피를 사랑하는 공주' },
    { keywords: ['게임', '롤'], title: '게임하는 공주' },
    { keywords: ['운동', '헬스'], title: '운동하는 공주' },
    { keywords: ['강아지', '고양이', '동물'], title: '동물을 사랑하는 공주' },
    { keywords: ['멍청', '바보', '미련'], title: '조금 맹한 공주' },
    { keywords: ['선물', '줘'], title: '선물 받고 싶은 공주' },
    { keywords: ['결혼', '남자친구', '여자친구'], title: '사랑을 꿈꾸는 공주' },
];


function getRandomElement(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

function convertToPrincessSpeak(text) {
    if (!text.trim()) {
        return {
            text: "평범한 말을 적어주세요! 공주가 기다리고 있답니다 🥹",
            pronounCount: 0,
            exaggeratedPhraseCount: 0,
            emojiCount: 0,
            originalLength: text.length,
            princessLength: "평범한 말을 적어주세요! 공주가 기다리고 있답니다 🥹".length
        };
    }

    let result = text;
    let pronounCount = 0;
    let exaggeratedPhraseCount = 0;
    let emojiCount = 0;

    // 1. Pronoun Replacement (with count)
    // Use regex with word boundaries to avoid partial matches and ensure correct Korean word boundaries
    // \b doesn't work well with Korean. Use lookarounds for more accurate word boundaries.
    const pronounKeys = Object.keys(PRONOUN_MAP).sort((a, b) => b.length - a.length); // Process longer words first

    for (const key of pronounKeys) {
        // Lookbehind (?<=^|\s) for start of string or whitespace
        // Lookahead (?=\s|$) for whitespace or end of string
        const regex = new RegExp(`(?<=^|\s)${key}(?=\s|$)`, 'g');
        result = result.replace(regex, (match) => {
            pronounCount++;
            return PRONOUN_MAP[key];
        });
    }

    // 2. Exaggerated Phrases & Emojis
    // Split by punctuation and then process segments
    const segments = result.split(/([.!?]+)/g); // Split but keep delimiters

    let princessSegments = [];
    for (let i = 0; i < segments.length; i++) {
        let segment = segments[i];
        if (segment.trim() === '') {
            princessSegments.push(segment);
            continue;
        }
        if (segment.match(/^[.!?]+$/)) { // If it's just punctuation, append it as is
            princessSegments.push(segment);
            continue;
        }

        // Always insert an exaggerated phrase
        segment = getRandomElement(EXAGGERATED_PHRASES) + ' ' + segment;
        exaggeratedPhraseCount++;

        // Randomly insert emojis within the segment more aggressively
        // Split by word boundaries or whitespace to insert emojis effectively
        const wordsAndSpaces = segment.split(/(\s+)/); // Split by whitespace, keeping delimiters
        let tempSegment = [];
        for (let j = 0; j < wordsAndSpaces.length; j++) {
            tempSegment.push(wordsAndSpaces[j]);
            // Insert emoji after a non-whitespace word with higher probability
            if (wordsAndSpaces[j].trim() !== '' && Math.random() < 0.5) { // 50% chance after each non-empty word
                tempSegment.push(getRandomElement(EMOJIS));
                emojiCount++;
            }
        }
        segment = tempSegment.join('');
        
        princessSegments.push(segment);
    }
    result = princessSegments.join('');

    // Store counts for Princess Power calculation
    return {
        text: result.trim(),
        pronounCount: pronounCount,
        exaggeratedPhraseCount: exaggeratedPhraseCount,
        emojiCount: emojiCount,
        originalLength: text.length,
        princessLength: result.length
    };
}

function calculatePrincessPower(conversionResult) {
    let score = 0;
    const { pronounCount, exaggeratedPhraseCount, emojiCount, originalLength, princessLength } = conversionResult;

    // Base score on transformation
    score += pronounCount * 15; // Increased impact
    score += exaggeratedPhraseCount * 20; // Increased impact
    score += emojiCount * 7; // Increased impact

    // Bonus for length increase - more aggressive
    if (originalLength > 0) {
        score += Math.min(70, (princessLength - originalLength) / originalLength * 30); // Max 70 points
    }

    // Max possible score for a very long, highly transformed text
    const MAX_POSSIBLE_SCORE = 700; // Adjusted for higher scores

    let percentage = Math.min(100, Math.floor((score / MAX_POSSIBLE_SCORE) * 100));
    
    // Ensure it's not 100% too easily
    if (percentage === 100 && Math.random() < 0.8) { // 80% chance to slightly reduce if it hits 100%
        percentage = 98 + Math.floor(Math.random() * 2); // 98 or 99
    }
     if (percentage === 100 && Math.random() < 0.8) { // 80% chance to slightly reduce if it hits 100%
        percentage = 98 + Math.floor(Math.random() * 2); // 98 or 99
    }

    // A minimum princess power even for short texts (slightly increased)
    if (percentage < 10 && originalLength > 0 && pronounCount > 0) percentage = 10 + Math.floor(Math.random() * 5); // 10-14%

    return percentage;
}

function determinePrincessTitle(originalText) {
    let foundTitle = "평범한 백성 🥺"; // Default title

    // Search for keywords (case-insensitive and prioritize longer matches)
    const sortedTitles = [...PRINCESS_TITLES].sort((a, b) => {
        const lenA = Math.max(...a.keywords.map(k => k.length));
        const lenB = Math.max(...b.keywords.map(k => k.length));
        return lenB - lenA; // Sort by longest keyword first
    });

    for (const titleEntry of sortedTitles) {
        for (const keyword of titleEntry.keywords) {
            // Use regex for whole word match where appropriate, or simple includes for phrases
            const regex = new RegExp(`\b${keyword}\b`, 'i'); // Case-insensitive whole word match
            if (regex.test(originalText)) {
                foundTitle = titleEntry.title;
                return foundTitle;
            }
        }
    }
    return foundTitle;
}


// Event Listeners
translateButton.addEventListener('click', () => {
    const input = inputText.value.trim(); // Trim input
    
    // Clear previous results immediately
    resultText.textContent = '';
    princessPowerDisplay.textContent = '공주력: 0%';
    princessTitleDisplay.textContent = '칭호: (평범한 백성)';

    if (!input) {
        resultText.textContent = "평범한 말을 적어주세요! 공주가 기다리고 있답니다 🥹";
        showToast('텍스트를 입력해주세요! 🎀');
        return;
    }

    translateButton.disabled = true;
    translateButton.textContent = '공주가 생각 중이에요... ✨'; // Loading state
    
    // Simulate processing time for better UX
    setTimeout(() => {
        const conversionResult = convertToPrincessSpeak(input);
        resultText.textContent = conversionResult.text;

        const power = calculatePrincessPower(conversionResult);
        princessPowerDisplay.textContent = `공주력: ${power}%`;

        const title = determinePrincessTitle(input);
        princessTitleDisplay.textContent = `칭호: ${title}`;

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
inputText.value = ''; // Clear input on load
translateButton.disabled = true; // Disable until input is provided

function showToast(message) {
    toastMessage.textContent = message;
    toastMessage.classList.add('show');
    setTimeout(() => {
        toastMessage.classList.remove('show');
    }, 3000); // Hide after 3 seconds
}

function updateTimestamp() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const timestamp = `${year}-${month}-${day} ${hours}:${minutes}`;
    document.getElementById('last-updated').textContent = `최신 업데이트: ${timestamp}`;
}

updateTimestamp();
