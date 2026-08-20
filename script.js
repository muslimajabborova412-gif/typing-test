// Луғати калимаҳои васеъ барои се забон (зиёда аз калимаҳои асосӣ, ки ба таври тасодуфӣ интихоб мешаванд)
const wordsData = {
    tg: [
        "китоб", "мактаб", "барнома", "хона", "мошин", "дунё", "вақт", "кор", "дарс", "хонанда",
        "дониш", "компютер", "забон", "тез", "навиштан", "суръат", "ҷаҳон", "олам", "ҷвон", "дӯст",
        "илм", "технология", "сухан", "ҳаёт", "модар", "падар", "бародар", "хоҳар", "ватан", "замин",
        "об", "ҳаво", "оташ", "сол", "моҳ", "ҳафта", "шаҳр", "деҳа", "роҳ", "нақша", "бози", "футбол"
    ],
    ru: [
        "лицо", "ребенок", "самый", "казаться", "любить", "почему", "у", "вода", "бы", "жена",
        "страна", "дверь", "ничто", "очень", "свое", "даже", "почему", "год", "значить", "при",
        "время", "человек", "дело", "жизнь", "день", "рука", "работа", "слово", "место", "лицо",
        "друг", "глаз", "вопрос", "дом", "сторона", "страна", "мир", "женщина", "сила", "часть"
    ],
    en: [
        "time", "person", "year", "way", "day", "thing", "man", "world", "life", "hand",
        "part", "child", "eye", "woman", "place", "work", "week", "case", "point", "government",
        "company", "number", "group", "problem", "fact", "be", "have", "do", "say", "get",
        "make", "go", "know", "take", "see", "come", "think", "look", "want", "give"
    ]
};

let currentLang = 'ru';
let words = [];
let timeLeft = 60;
let timerInterval = null;
let isPlaying = false;
let currentWordIndex = 0;
let correctWordsCount = 0;
let incorrectWordsCount = 0;

const wordDisplay = document.getElementById('word-display');
const wordInput = document.getElementById('word-input');
const timeDisplay = document.getElementById('time');
const startBtn = document.getElementById('start-btn');
const resultContainer = document.getElementById('result-container');
const finalScore = document.getElementById('final-score');
const langSelect = document.getElementById('lang-select');
const registerBtn = document.getElementById('register-btn');
const loginBtn = document.getElementById('login-btn');
const userGreeting = document.getElementById('user-greeting');

// Тафтиши бақайдгирии қаблӣ дар браузер
window.addEventListener('DOMContentLoaded', () => {
    const savedUser = localStorage.getItem('typing_username');
    if (savedUser) {
        userGreeting.textContent = `Хуш омадед, ${savedUser}!`;
        registerBtn.style.display = 'none';
        loginBtn.textContent = 'Баромадан';
    }
});

// Тугмаи сабти ном (Регистратсия)
registerBtn.addEventListener('click', () => {
    const username = prompt('Лутфан номи худро ворид кунед:');
    if (username && username.trim() !== '') {
        localStorage.setItem('typing_username', username.trim());
        userGreeting.textContent = `Хуш омадед, ${username.trim()}!`;
        registerBtn.style.display = 'none';
        loginBtn.textContent = 'Баромадан';
    }
});

// Тугмаи ворид шудан / баромадан
loginBtn.addEventListener('click', () => {
    const savedUser = localStorage.getItem('typing_username');
    if (savedUser) {
        localStorage.removeItem('typing_username');
        userGreeting.textContent = '';
        registerBtn.style.display = 'inline-block';
        loginBtn.textContent = 'Ворид шудан';
    } else {
        const username = prompt('Номи корбарии худро ворид кунед:');
        if (username && username.trim() !== '') {
            localStorage.setItem('typing_username', username.trim());
            userGreeting.textContent = `Хуш омадед, ${username.trim()}!`;
            registerBtn.style.display = 'none';
            loginBtn.textContent = 'Баромадан';
        }
    }
});

// Иваз кардани забон тавассути меню
langSelect.addEventListener('change', (e) => {
    currentLang = e.target.value;
    generateRandomWords();
    if (!isPlaying) renderWords();
});

// Функцияи сохтани 500 калимаи тасодуфӣ (рандом)
function generateRandomWords() {
    const baseList = wordsData[currentLang];
    words = [];
    // Аз рӯи луғат 500 калимаи рандом генерация мекунем
    for (let i = 0; i < 500; i++) {
        const randomIndex = Math.floor(Math.random() * baseList.length);
        words.push(baseList[randomIndex]);
    }
}

// Дар оғоз калимаҳоро месозем
generateRandomWords();

startBtn.addEventListener('click', startGame);

function startGame() {
    isPlaying = true;
    timeLeft = 60;
    currentWordIndex = 0;
    correctWordsCount = 0;
    incorrectWordsCount = 0;
    
    generateRandomWords(); // Ҳар дафъа калимаҳои нав ва рандом меоянд
    wordInput.value = '';
    wordInput.disabled = false;
    wordInput.focus();
    if(resultContainer) resultContainer.style.display = 'none';
    startBtn.style.display = 'none';
    
    renderWords();
    
    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        timeLeft--;
        if(timeDisplay) timeDisplay.textContent = timeLeft;
        
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            stopGame();
        }
    }, 1000);
}

function renderWords() {
    wordDisplay.innerHTML = '';
    // Танҳо 30 калимаи аввалро дар экран нишон медиҳем, то ки суръат паст нашавад
    const displaySlice = words.slice(currentWordIndex, currentWordIndex + 30);
    displaySlice.forEach((word, index) => {
        const span = document.createElement('span');
        span.textContent = word + " ";
        if (index === 0) {
            span.classList.add('current');
        }
        wordDisplay.appendChild(span);
    });
}

wordInput.addEventListener('input', () => {
    if (!isPlaying) return;

    const typedValue = wordInput.value;
    
    if (typedValue.endsWith(' ')) {
        const cleanTyped = typedValue.trim();
        const currentWord = words[currentWordIndex];
        const wordSpans = wordDisplay.children;
        
        if (cleanTyped === currentWord) {
            if(wordSpans[0]) wordSpans[0].classList.add('correct');
            correctWordsCount++;
        } else {
            if(wordSpans[0]) wordSpans[0].classList.add('incorrect');
            incorrectWordsCount++;
        }

        currentWordIndex++;
        wordInput.value = '';

        if (currentWordIndex >= words.length) {
            stopGame();
            return;
        }

        renderWords(); // Намоиши қисми навбатии калимаҳо
    }
});

function stopGame() {
    isPlaying = false;
    wordInput.disabled = true;
    startBtn.style.display = 'inline-block';
    startBtn.textContent = "Аз нав бозӣ кардан";
    
    if (resultContainer) {
        resultContainer.style.display = 'block';
        finalScore.textContent = `Дуруст: ${correctWordsCount} | Хато: ${incorrectWordsCount} | Ҳамагӣ: ${correctWordsCount + incorrectWordsCount}`;
    }
}

renderWords();
