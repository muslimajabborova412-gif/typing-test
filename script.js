const wordsData = {
    tg: ["китоб", "мактаб", "барнома", "хона", "мошин", "дунё", "вақт", "кор", "дарс", "хонанда", "дониш", "компютер", "забон", "тез", "навиштан", "суръат", "ҷаҳон", "олам", "ҷвон", "дӯст"],
    ru: ["лицо", "ребенок", "самый", "казаться", "любить", "почему", "вода", "бы", "жена", "страна", "дверь", "ничто", "очень", "свое", "даже", "время", "человек", "дело", "жизнь", "день"],
    en: ["time", "person", "year", "way", "day", "thing", "man", "world", "life", "hand", "part", "child", "eye", "woman", "place", "work", "week", "case", "point", "government"]
};

let words = [];
let currentWordIndex = 0;
let currentLang = 'ru';
let timeLimit = 60;
let timeLeft = 60;
let timerInterval = null;
let isPlaying = false;
let correctCount = 0;
let incorrectCount = 0;

const wordDisplay = document.getElementById('word-display');
const wordInput = document.getElementById('word-input');
const timeDisplay = document.getElementById('time');
const startBtn = document.getElementById('start-btn');
const resultContainer = document.getElementById('result-container');
const finalScore = document.getElementById('final-score');
const userGreeting = document.getElementById('user-greeting');
const authBtn = document.getElementById('auth-action-btn');

window.addEventListener('DOMContentLoaded', () => {
    const user = localStorage.getItem('typing_user');
    if (user) {
        userGreeting.textContent = `Истифодабаранда: ${user}`;
        authBtn.textContent = 'Баромадан';
    }
    generateWords();
});

function handleAuth() {
    const user = localStorage.getItem('typing_user');
    if (user) {
        localStorage.removeItem('typing_user');
        userGreeting.textContent = 'Хуш омадед!';
        authBtn.textContent = 'Сабти ном / Ворид шудан';
    } else {
        const name = prompt('Номи худро ворид кунед:');
        if (name && name.trim() !== '') {
            localStorage.setItem('typing_user', name.trim());
            userGreeting.textContent = `Истифодабаранда: ${name.trim()}`;
            authBtn.textContent = 'Баромадан';
        }
    }
}

function generateWords() {
    words = [];
    const base = wordsData[currentLang];
    for (let i = 0; i < 500; i++) {
        words.push(base[Math.floor(Math.random() * base.length)]);
    }
    currentWordIndex = 0;
    renderWords();
}

function renderWords() {
    wordDisplay.innerHTML = '';
    words.forEach((w, i) => {
        const span = document.createElement('span');
        span.textContent = w + " ";
        if (i === currentWordIndex) {
            span.classList.add('current');
            // Авто-скролл ба калимаи фаъол
            span.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        wordDisplay.appendChild(span);
    });
}

document.getElementById('lang-select').addEventListener('change', (e) => {
    currentLang = e.target.value;
    generateWords();
});

function setMode(mode) {
    alert("Режим фаъол шуд: " + mode);
}

function toggleTime() {
    if (timeLimit === 60) timeLimit = 30;
    else if (timeLimit === 30) timeLimit = 15;
    else timeLimit = 60;
    
    timeLeft = timeLimit;
    timeDisplay.textContent = timeLimit;
    document.getElementById('time-toggle').textContent = timeLimit + "с";
}

function restartGame() {
    clearInterval(timerInterval);
    timerInterval = null;
    isPlaying = false;
    currentWordIndex = 0;
    correctCount = 0;
    incorrectCount = 0;
    timeLeft = timeLimit;
    timeDisplay.textContent = timeLeft;
    
    wordInput.value = '';
    wordInput.disabled = true;
    startBtn.style.display = 'inline-block';
    if(resultContainer) resultContainer.style.display = 'none';
    
    generateWords();
}

function openSettings() {
    alert("Танзимоти сайти тезнависӣ.");
}

function startGame() {
    const user = localStorage.getItem('typing_user');
    if (!user) {
        alert("Лутфан аввал сабти ном кунед ё номи худро ворид созед!");
        handleAuth();
        return;
    }

    isPlaying = true;
    currentWordIndex = 0;
    correctCount = 0;
    incorrectCount = 0;
    timeLeft = timeLimit;
    timeDisplay.textContent = timeLeft;
    
    wordInput.value = '';
    wordInput.disabled = false;
    wordInput.focus();
    startBtn.style.display = 'none';
    if(resultContainer) resultContainer.style.display = 'none';
    
    generateWords();

    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        timeLeft--;
        timeDisplay.textContent = timeLeft;
        
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            endGame();
        }
    }, 1000);
}

function startDuel() {
    alert("Режими дуэл фаъол шуд! Бозигари якум бозӣ мекунад.");
    startGame();
}

// Санҷиши калимаҳо ҳангоми пахш кардани Space
wordInput.addEventListener('input', (e) => {
    if (!isPlaying) return;

    // Вақте ки корбар Space (фосила) мезанад
    if (e.target.value.endsWith(' ')) {
        const typed = e.target.value.trim();
        const spans = wordDisplay.children;
        
        if (spans[currentWordIndex]) {
            if (typed === words[currentWordIndex]) {
                spans[currentWordIndex].classList.add('correct');
                correctCount++;
            } else {
                spans[currentWordIndex].classList.add('incorrect'); // Ранги сурх ва پس-زمینه
                incorrectCount++;
            }
        }

        currentWordIndex++;
        e.target.value = ''; // Тоза кардани input барои калимаи навбатӣ
        
        if (currentWordIndex >= words.length) {
            clearInterval(timerInterval);
            endGame();
            return;
        }
        
        renderWords(); // Навсозии экран ва скролл ба калимаи нав
    }
});

function endGame() {
    isPlaying = false;
    wordInput.disabled = true;
    startBtn.style.display = 'inline-block';
    
    resultContainer.style.display = 'block';
    finalScore.textContent = `Дуруст: ${correctCount} калима | Хато: ${incorrectCount} | Суръат: ${correctCount} WPM`;
}
