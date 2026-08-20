const wordsData = {
    tg: ["китоб", "мактаб", "барнома", "хона", "мошин", "дунё", "вақт", "кор", "дарс", "хонанда", "дониш", "компютер", "забон", "тез", "навиштан", "суръат", "ҷаҳон", "олам", "ҷвон", "дӯст"],
    ru: ["лицо", "ребенок", "самый", "казаться", "любить", "почему", "вода", "бы", "жена", "страна", "дверь", "ничто", "очень", "свое", "даже", "время", "человек", "дело", "жизнь", "день", "пока", "другой", "когда", "через", "видеть"],
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
let wrongCharsCount = 0;

const wordDisplay = document.getElementById('word-display');
const wordInput = document.getElementById('word-input');
const timeDisplay = document.getElementById('time');
const startBtn = document.getElementById('start-btn');
const resultContainer = document.getElementById('result-container');
const liveWpm = document.getElementById('live-wpm');

window.addEventListener('DOMContentLoaded', () => {
    generateWords();
});

function switchTab(tab) {
    const testSection = document.getElementById('test-section');
    const aboutSection = document.getElementById('about-section');
    const controlsBar = document.getElementById('controls-bar');
    const buttons = document.querySelectorAll('.nav-btn');
    
    buttons.forEach(btn => btn.classList.remove('active'));

    if (tab === 'test') {
        testSection.style.display = 'block';
        aboutSection.style.display = 'none';
        controlsBar.style.display = 'flex';
        event.target.classList.add('active');
    } else if (tab === 'about') {
        testSection.style.display = 'none';
        aboutSection.style.display = 'block';
        controlsBar.style.display = 'none';
        event.target.classList.add('active');
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
        span.textContent = w;
        if (i === currentWordIndex) {
            span.classList.add('current');
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
    alert("Реҷим фаъол шуд: " + mode);
}

function restartGame() {
    clearInterval(timerInterval);
    timerInterval = null;
    isPlaying = false;
    currentWordIndex = 0;
    correctCount = 0;
    incorrectCount = 0;
    wrongCharsCount = 0;
    timeLeft = timeLimit;
    timeDisplay.textContent = timeLeft;
    liveWpm.textContent = '0';
    
    wordInput.value = '';
    wordInput.disabled = true;
    startBtn.style.display = 'inline-block';
    resultContainer.style.display = 'none';
    
    generateWords();
}

function openSettings() {
    alert("Танзимоти сомонаи FastOlimpy.");
}

function startGame() {
    isPlaying = true;
    currentWordIndex = 0;
    correctCount = 0;
    incorrectCount = 0;
    wrongCharsCount = 0;
    timeLeft = timeLimit;
    timeDisplay.textContent = timeLeft;
    liveWpm.textContent = '0';
    
    wordInput.value = '';
    wordInput.disabled = false;
    wordInput.focus();
    startBtn.style.display = 'none';
    resultContainer.style.display = 'none';
    
    generateWords();

    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        timeLeft--;
        timeDisplay.textContent = timeLeft;
        
        // Ҳисобкунии суръати мустақим (WPM) дар вақти бозӣ
        const elapsedMinutes = (timeLimit - timeLeft) / 60;
        if (elapsedMinutes > 0) {
            const currentWpm = Math.round(correctCount / elapsedMinutes);
            liveWpm.textContent = currentWpm;
        }

        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            endGame();
        }
    }, 1000);
}

function startDuel() {
    alert("Режими дуэл бо дӯстон оғоз шуд!");
    startGame();
}

function handleAuth() {
    const userDisplay = document.getElementById('user-display');
    const authBtn = document.getElementById('auth-btn');
    if (authBtn.textContent === 'Баромадан') {
        userDisplay.textContent = 'Меҳмон';
        authBtn.textContent = 'Ворид шудан';
        authBtn.style.background = '#27ae60';
    } else {
        const name = prompt('Номи худро ворид кунед:', 'Шералиев Абдураҳим');
        if (name) {
            userDisplay.textContent = name;
            authBtn.textContent = 'Баромадан';
            authBtn.style.background = '#e74c3c';
        }
    }
}

wordInput.addEventListener('input', (e) => {
    if (!isPlaying) return;

    if (e.target.value.endsWith(' ')) {
        const typed = e.target.value.trim();
        const spans = wordDisplay.children;
        
        if (spans[currentWordIndex]) {
            if (typed === words[currentWordIndex]) {
                spans[currentWordIndex].classList.add('correct');
                correctCount++;
            } else {
                spans[currentWordIndex].classList.add('incorrect');
                incorrectCount++;
                wrongCharsCount += Math.abs(typed.length - words[currentWordIndex].length);
            }
        }

        currentWordIndex++;
        e.target.value = '';
        
        if (currentWordIndex >= words.length) {
            clearInterval(timerInterval);
            endGame();
            return;
        }
        
        renderWords();
    }
});

function endGame() {
    isPlaying = false;
    wordInput.disabled = true;
    startBtn.style.display = 'inline-block';
    
    const wpm = correctCount;
    const totalWordsAttempted = correctCount + incorrectCount;
    const accuracy = totalWordsAttempted > 0 ? Math.round((correctCount / totalWordsAttempted) * 100) : 0;

    document.getElementById('res-wpm').textContent = wpm + " сл/мин";
    document.getElementById('res-accuracy').textContent = accuracy + "%";
    document.getElementById('res-correct').textContent = correctCount;
    document.getElementById('res-incorrect').textContent = incorrectCount;
    document.getElementById('res-wrong-chars').textContent = wrongCharsCount;
    document.getElementById('res-time').textContent = timeLimit + " сония";

    liveWpm.textContent = wpm;
    resultContainer.style.display = 'block';
}
