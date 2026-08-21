const wordsData = {
    tg: ["китоб", "мактаб", "барнома", "хона", "мошин", "дунё", "вақт", "кор", "дарс", "хонанда", "дониш", "компютер", "забон", "тез", "навиштан", "суръат", "ҷаҳон", "олам", "ҷвон", "дӯст", "шаҳр", "баҳор", "тобистон", "дарё", "кӯҳ", "ватан"],
    ru: ["лицо", "ребенок", "самый", "казаться", "любить", "почему", "вода", "бы", "жена", "страна", "дверь", "ничто", "очень", "свое", "даже", "время", "человек", "дело", "жизнь", "день", "пока", "другой", "когда", "через", "видеть", "главный", "нога", "рука", "конец"],
    en: ["time", "person", "year", "way", "day", "thing", "man", "world", "life", "hand", "part", "child", "eye", "woman", "place", "work", "week", "case", "point", "government", "company", "number", "group", "problem"]
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
    const ratingSection = document.getElementById('rating-section');
    const aboutSection = document.getElementById('about-section');
    const controlsBar = document.getElementById('controls-bar');
    const buttons = document.querySelectorAll('.nav-btn');
    
    buttons.forEach(btn => btn.classList.remove('active'));

    testSection.style.display = 'none';
    ratingSection.style.display = 'none';
    aboutSection.style.display = 'none';
    controlsBar.style.display = 'none';

    if (tab === 'test') {
        testSection.style.display = 'block';
        controlsBar.style.display = 'flex';
        event.target.classList.add('active');
    } else if (tab === 'rating') {
        ratingSection.style.display = 'block';
        event.target.classList.add('active');
    } else if (tab === 'about') {
        aboutSection.style.display = 'block';
        event.target.classList.add('active');
    }
}

function generateWords() {
    words = [];
    const base = wordsData[currentLang];
    for (let i = 0; i < 300; i++) {
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
        }
        wordDisplay.appendChild(span);
    });
    
    const currentSpan = wordDisplay.querySelector('.current');
    if (currentSpan) {
        wordDisplay.scrollTop = currentSpan.offsetTop - wordDisplay.offsetTop - 10;
    }
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

    const typedValue = e.target.value;
    const spans = wordDisplay.children;
    const currentWord = words[currentWordIndex];

    if (typedValue.endsWith(' ')) {
        const typedTrimmed = typedValue.trim();
        
        if (spans[currentWordIndex]) {
            spans[currentWordIndex].classList.remove('current');
            if (typedTrimmed === currentWord) {
                spans[currentWordIndex].classList.add('correct');
                correctCount++;
            } else {
                spans[currentWordIndex].classList.add('incorrect');
                incorrectCount++;
                wrongCharsCount += Math.abs(typedTrimmed.length - currentWord.length);
            }
        }

        currentWordIndex++;
        e.target.value = '';
        
        if (currentWordIndex >= words.length) {
            clearInterval(timerInterval);
            endGame();
            return;
        }
        
        if (spans[currentWordIndex]) {
            spans[currentWordIndex].classList.add('current');
        }
        renderWords();
    } else {
        if (spans[currentWordIndex]) {
            if (currentWord.startsWith(typedValue.trim())) {
                spans[currentWordIndex].style.color = "#2c3e50";
            } else {
                spans[currentWordIndex].style.color = "#e74c3c";
            }
        }
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
