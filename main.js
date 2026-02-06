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

const NOUN_MAP = {
    '집': '화려한 장미 궁궐',
    '돈': '반짝이는 금화',
    '밥': '고귀한 만찬(수라상)',
    '학교': '지식의 상아탑',
    '회사': '황금빛 직무 궁전',
    '친구': '소중한 벗',
    '시간': '찬란한 순간',
    '하루': '눈부신 하루',
    '오늘': '찬란한 금일',
    '내일': '희망찬 명일',
    '어제': '아련한 작일',
    '길': '꽃길',
    '물': '영롱한 샘물',
    '책': '지혜의 서책',
    '꿈': '환상적인 몽상',
    '마음': '아가의 여린 마음',
    '생각': '고귀한 사색',
    '일': '존귀한 소임',
    '사람': '고귀한 백성',
    '선물': '하늘이 내린 선물',
    '옷': '아름다운 비단 옷',
    '얼굴': '눈부신 미모',
    '나이': '고귀한 연세',
    '사랑': '영원한 사랑',
    '세상': '아름다운 세상',
    '세젤예': '세상에서 제일 예쁜',
    '세젤귀': '세상에서 제일 귀여운',
    '공주님': '존귀하신 공주님',
    '왕자님': '늠름하신 왕자님',
    '아름답다': '눈부시게 아름답다',
    '예쁘다': '어여쁘시다',
    '귀엽다': '사랑스러우시다',
    '멋지다': '황홀하시다',
    '행복하다': '더없이 행복하다',
    '슬프다': '비통하시다',
    '화나다': '진노하시다',
    '기쁘다': '환희에 차시다',
    '피곤하다': '고단하시다',
    '아프다': '고통스러우시다',
    '배고프다': '고귀한 알람이 울리옵니다',
    '졸리다': '잠이 쏟아지옵니다',
    '힘들다': '버거우시옵니다',
    '좋다': '성스러이 좋사옵니다',
    '싫다': '심히 싫사옵니다',
};

const ARCHAIC_SUFFIXES = [
    '옵니다', '하나이다', '하옵니다', '이옵니다', '이옵소서', '이옵고', '하옵소서', '하오나', '하시옵니까', '하겠사와요', '이옵니다요', '이옵니다만',
    '합니다요', '합죠', '옵니다요', '으리까', '으리라', '옵나이다', '옵고', '이다요'
];

const INTERMEDIATE_CONNECTIVES = [
    '하시옵고', '이옵니다만', '이옵고', '이옵니다', '하시옵나이다', '그러하옵니다', '또한', '그리하여', '아가의 생각으로는', '이뿐만이 아니옵니다'
];

const INTERJECTIONS = [
    '(우아하게 손을 흔들며)', '(눈부신 미모를 뽐내며)', '오호호호!', '(반짝이는 눈빛으로)', '(도도한 표정으로)', '(살포시 미소 지으며)',
    '으응?', '어머나!', '호잇!', '데헷!', '쀼잉!', '헤으응', '크흠,', '앗!', '꺄르륵', '흐음~'
];

const SENTENCE_END_DECORATIONS = [
    '이옵니다, 오호호! ✨', '이옵니다, 아가는 그리 생각하옵니다 💖', '이옵나이다, 공주는 심히 기쁘옵니다 👑', '하옵니다, 부디 헤아려 주시옵소서 🥹',
    '이옵니다, 별처럼 빛나는 공주가 말씀드리옵니다 💫', '이옵니다, 꺄르륵! 🎀', '이옵니다, 잊지 마시옵소서 🌸', '이옵니다, 영원히! 💎',
    '이옵니다, 감히 거절할 수 없사옵니다 🧚‍♀️', '이옵니다, 공주님의 말씀이시옵니다 🦄', '이옵니다, 총총 🌟', '이옵니다, 총총 🌷', '이옵니다, 총총 🦋'
];

const SENTENCE_END_TRANSFORMATIONS = [
    // Interrogative (prioritize specific questions)
    { regex: /는\s+것이\s+맞나\s*[\?!]*$/, replacement: '는 것이 참말로 옳사옵니까? 오호호, 그리 여쭈옵니다! ✨', type: 'interrogative' }, // "맞나?" specific
    { regex: /게\s+맞나\s*[\?!]*$/, replacement: '것이 참으로 옳사옵니까? 💖', type: 'interrogative' }, // "괜찮은게 맞나?"
    { regex: /(이|가)\s+맞나\s*[\?!]*$/, replacement: '$1 참으로 옳사옵니까? 👑', type: 'interrogative' }, // "이게 맞나?"
    { regex: /(입니까|습니까|ㅂ니까)\s*[\?!]*$/, replacement: '$1? 아가가 궁금하옵니다 🥹', type: 'interrogative' },
    { regex: /(나요|가요|인가요|하나요)\s*[\?!]*$/, replacement: '하옵니까? 🎀', type: 'interrogative' },
    { regex: /(할까|일까|을까|ㄹ까)\s*[\?!]*$/, replacement: '$1 하옵니까? 🌸', type: 'interrogative' },
    { regex: /(어때|하니|하니깐|니)\s*[\?!]*$/, replacement: '하시옵니까? 💎', type: 'interrogative' }, // Informal questions
    { regex: /(뭐|누구|언제|어디|어떻게|왜)\s*[\?!]*$/, replacement: '$1이옵니까? 🦄', type: 'interrogative' }, // Wh-questions
    { regex: /([.?!])\s*$/, replacement: '이옵니까? ✨', type: 'interrogative', fallback: true }, // Generic question ending

    // Declarative/Propositive/Imperative
    { regex: /(습니다|ㅂ니다|하옵니다)\s*[\.!]*$/, replacement: '하옵니다, 이 공주가 말씀드리옵니다 💖', type: 'declarative' },
    { regex: /(아요|어요|지요|죠)\s*[\.!]*$/, replacement: '이옵니다, 그리 생각하옵니다 👑', type: 'declarative' },
    { regex: /(할게|갈게|을게|ㄹ게)\s*[\.!]*$/, replacement: '$1 이옵니다, 소인이 그리 하겠사옵니다 💫', type: 'declarative' },
    { regex: /(하자|가자|을까|ㄹ까)\s*[\.!]*$/, replacement: '$1 하옵시다, 어서 서두르시옵소서 🌷', type: 'propositive' },
    { regex: /(해라|거라|아라|어라)\s*[\.!]*$/, replacement: '하시옵소서, 이 공주가 명하옵니다 🦋', type: 'imperative' },
    { regex: /(할게|할게요|갈게요)\s*[\.!]*$/, replacement: '하겠사옵니다, 부디 허락하시옵소서! 🧚‍♀️', type: 'declarative' },
    { regex: /(이다|야|어|군|네|네)\s*[\.!]*$/, replacement: '이옵니다, 그리 알고 계시옵소서! 🌟', type: 'declarative', fallback: true }, // Informal declarative
    { regex: /([.?!])\s*$/, replacement: '이옵니다, 오호호! ✨', type: 'declarative', fallback: true }, // Generic declarative ending
];

// Helper function for Korean particle adjustment (은/는, 이/가, 을/를, 에/에게, 와/과, 로/으로)
function getJosa(word, particleType) {
    if (!word || typeof word !== 'string') return '';
    const lastChar = word.charCodeAt(word.length - 1);
    // Check for final consonant (받침)
    // Korean characters start from U+AC00
    // (lastChar - 0xAC00) % 28 determines the presence of a final consonant.
    // If it's 0, there is no final consonant.
    const hasFinalConsonant = (lastChar - 0xAC00) % 28 !== 0;

    switch (particleType) {
        case '은/는':
            return hasFinalConsonant ? '은' : '는';
        case '이/가':
            return hasFinalConsonant ? '이' : '가';
        case '을/를':
            return hasFinalConsonant ? '을' : '를';
        case '와/과':
            return hasFinalConsonant ? '과' : '와';
        case '으로/로':
            // 'ㄹ' ending is a special case for '으로/로'
            if ((lastChar - 0xAC00) % 28 === 8) { // If last char has 'ㄹ' 받침
                return '로';
            }
            return hasFinalConsonant ? '으로' : '로';
        case '아/야':
            return hasFinalConsonant ? '아' : '야';
        default:
            return '';
    }
}


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

    let processedText = text;
    let pronounCount = 0;
    let exaggeratedPhraseCount = 0;
    let emojiCount = 0;

    // 1. Advanced Noun Replacement (Prioritize longer matches)
    const nounKeys = Object.keys(NOUN_MAP).sort((a, b) => b.length - a.length);
    for (const key of nounKeys) {
        // Use a more robust word boundary for Korean, matching any non-Korean character or whitespace
        const regex = new RegExp(`(?<=\\s|^)${key}(?=\\s|$)`, 'g');
        processedText = processedText.replace(regex, (match) => {
            return NOUN_MAP[key];
        });
    }

    // 2. Pronoun Replacement (with count)
    const pronounKeys = Object.keys(PRONOUN_MAP).sort((a, b) => b.length - a.length);

    for (const key of pronounKeys) {
        const regex = new RegExp(`(?<=\\s|^)${key}(?=\\s|$)`, 'g');
        processedText = processedText.replace(regex, (match) => {
            pronounCount++;
            return PRONOUN_MAP[key];
        });
    }

    // 3. Sentence Segmentation
    // Split by punctuation, keeping them with the sentence they end
    const rawSentences = processedText.split(/([.!?]+)/g);
    // Filter out empty strings and re-merge delimiters to their sentences
    let sentences = [];
    for (let i = 0; i < rawSentences.length; i++) {
        if (rawSentences[i].trim() === '') continue;
        if (rawSentences[i].match(/^[.!?]+$/) && sentences.length > 0) {
            sentences[sentences.length - 1] += rawSentences[i];
        } else {
            sentences.push(rawSentences[i]);
        }
    }
    // Handle newlines as sentence separators too, if they are not already part of a sentence with punctuation
    sentences = sentences.flatMap(s => s.includes('\n') ? s.split('\n') : s);
    sentences = sentences.filter(s => s.trim() !== ''); // Final filter for empty sentences

    let finalPrincessSentences = [];

    // Apply EXAGGERATED_PHRASES once at the very beginning of the entire text
    let globalPrefixAdded = false;
    if (sentences.length > 0) {
        sentences[0] = getRandomElement(EXAGGERATED_PHRASES) + ' ' + sentences[0];
        exaggeratedPhraseCount++;
        globalPrefixAdded = true;
    }


    for (let i = 0; i < sentences.length; i++) {
        let sentence = sentences[i].trim();
        if (!sentence) continue;

        let currentPunctuation = '';
        const trailingPunctuationMatch = sentence.match(/([.!?]+)$/);
        if (trailingPunctuationMatch) {
            currentPunctuation = trailingPunctuationMatch[0];
            sentence = sentence.slice(0, -currentPunctuation.length).trim();
        }

        let processedSentence = sentence;

        // Add adjectives to make it longer
        const words = processedSentence.split(' ');
        let adjectiveInserted = 0;
        for (let j = 0; j < words.length; j++) {
            if (words[j].length > 1 && Math.random() < 0.2 && adjectiveInserted < 2) { // Max 2 adjectives per sentence
                const adjective = getRandomElement(['눈부신', '황홀한', '사랑스러운', '찬란한', '고귀한', '아름다운', '영롱한', '반짝이는']);
                words.splice(j, 0, adjective);
                adjectiveInserted++;
            }
        }
        processedSentence = words.join(' ');


        // Randomly insert interjections (less aggressively than before)
        if (Math.random() < 0.15) { // 15% chance
            const interjection = getRandomElement(INTERJECTIONS);
            if (processedSentence.length > 10 && processedSentence.indexOf(' ') !== -1) {
                const spaceIndex = processedSentence.indexOf(' ', processedSentence.length / 2); // Insert around middle
                processedSentence = processedSentence.slice(0, spaceIndex) + ' ' + interjection + ' ' + processedSentence.slice(spaceIndex);
            } else {
                processedSentence = interjection + ' ' + processedSentence;
            }
            emojiCount++; // Interjections often imply emojis
        }

        // Apply Josa (Particle) Adjustment - targeting common patterns
        // This regex looks for word followed by (은/는), (이/가) etc. and applies getJosa
        // This is a broad pass, perfect accuracy is NLP-hard.
        processedSentence = processedSentence.replace(/(\S+)(은\/는)/g, (match, p1) => p1 + getJosa(p1, '은/는'));
        processedSentence = processedSentence.replace(/(\S+)(이\/가)/g, (match, p1) => p1 + getJosa(p1, '이/가'));
        processedSentence = processedSentence.replace(/(\S+)(을\/를)/g, (match, p1) => p1 + getJosa(p1, '을/를'));
        processedSentence = processedSentence.replace(/(\S+)(와\/과)/g, (match, p1) => p1 + getJosa(p1, '와/과'));
        processedSentence = processedSentence.replace(/(\S+)(으로\/로)/g, (match, p1) => p1 + getJosa(p1, '으로/로'));
        processedSentence = processedSentence.replace(/(\S+)(아\/야)/g, (match, p1) => p1 + getJosa(p1, '아/야'));


        if (i === sentences.length - 1) { // This is the very last sentence
            let transformedEnding = false;
            for (const endingRule of SENTENCE_END_TRANSFORMATIONS) {
                if (endingRule.regex.test(processedSentence)) {
                    processedSentence = processedSentence.replace(endingRule.regex, endingRule.replacement);
                    transformedEnding = true;
                    exaggeratedPhraseCount++; // These replacements are lengthy
                    emojiCount += 2; // Often include emojis
                    break;
                }
            }
            if (!transformedEnding) {
                processedSentence += getRandomElement(SENTENCE_END_DECORATIONS);
                exaggeratedPhraseCount++;
                emojiCount += 2;
            }
        } else { // Intermediate sentences
            // Use simple archaic suffixes or intermediate connectives
            let intermediateTransformed = false;
            // Try to replace common endings with simple archaic connectives
            for (const suffix of ['다', '요', '어', '아', '지']) {
                if (processedSentence.endsWith(suffix)) {
                    processedSentence = processedSentence.slice(0, -suffix.length) + getRandomElement(INTERMEDIATE_CONNECTIVES);
                    intermediateTransformed = true;
                    break;
                }
            }
            if (!intermediateTransformed) {
                 processedSentence += ' ' + getRandomElement(INTERMEDIATE_CONNECTIVES); // Fallback connective
            }
            // Add a period for clarity if it's an intermediate sentence and no punctuation is there
            if (!processedSentence.match(/[.!?]$/) && Math.random() < 0.7) {
                 processedSentence += '. ';
            }
        }

        finalPrincessSentences.push(processedSentence);
    }

    let finalResult = finalPrincessSentences.join(' ').replace(/\s{2,}/g, ' ').trim();

    // Ensure there's a proper ending if somehow missed (should be handled by last sentence logic)
    if (!finalResult.match(/[.!?]$/) && sentences.length > 0) {
        finalResult += getRandomElement(SENTENCE_END_DECORATIONS);
        emojiCount += 2;
        exaggeratedPhraseCount++;
    }


    return {
        text: finalResult,
        pronounCount: pronounCount,
        exaggeratedPhraseCount: exaggeratedPhraseCount,
        emojiCount: emojiCount,
        originalLength: text.length,
        princessLength: finalResult.length
    };
}

function calculatePrincessPower(conversionResult) {
    let score = 0;
    const { pronounCount, exaggeratedPhraseCount, emojiCount, originalLength, princessLength } = conversionResult;

    // Base score on transformation (significantly increased impact)
    score += pronounCount * 30; // More impact
    score += exaggeratedPhraseCount * 40; // More impact
    score += emojiCount * 15; // More impact

    // Bonus for length increase - much more aggressive and no hard cap
    if (originalLength > 0) {
        // Aim for 3x length, so a multiplier based on that
        const lengthRatio = princessLength / originalLength;
        score += Math.min(200, (lengthRatio - 1) * 100); // Up to 200 points for extreme length increase
    }

    // Bonus for overall complexity and dramatic flair
    score += (pronounCount + exaggeratedPhraseCount + emojiCount) * 5;


    // Max possible score for a very long, highly transformed text
    const MAX_POSSIBLE_SCORE = 1200; // Adjusted for much higher scores due to new logic

    let percentage = Math.min(100, Math.floor((score / MAX_POSSIBLE_SCORE) * 100));
    
    // Ensure it's not 100% too easily, but allow it more often now
    if (percentage === 100 && Math.random() < 0.5) { // 50% chance to slightly reduce if it hits 100%
        percentage = 95 + Math.floor(Math.random() * 5); // 95-99
    }
    // A minimum princess power even for short texts (more generous)
    if (percentage < 20 && originalLength > 0) percentage = 20 + Math.floor(Math.random() * 10); // 20-29%
    if (percentage < 10 && originalLength === 0) percentage = 0; // If no input, 0%

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
