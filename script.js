const words = [
    "барномасозӣ", "компютер", "технология", "суръат", "ҷаҳон", 
    "дониш", "навоварӣ", "пайваст", "вебсайт", "хона", 
    "донишгоҳ", "китоб", "талаба", "омӯзгор", "математика", 
    "интернет", "телефон", "шабака", "дастур", "мошина"
];

let timeLeft = 60;
let timerInterval = null;
let isPlaying = false;
let correctWordsCount = 0;
let currentWordIndex = 0;

const wordDisplay = document.getElementById('word-display');
const wordInput = document.getElementById('word-input');
const timeDisplay = document.getElementById('time');
const startBtn = document.getElementById('start-btn');
const resultContainer = document.getElementById('result-container');
const finalScore = document.getElementById('final-score');

startBtn.addEventListener('click', startGame);

function startGame() {
    isPlaying = true;
    timeLeft = 60;
    correctWordsCount = 0;
    currentWordIndex = 0;
    
    wordInput.value = '';
    wordInput.disabled = false;
    wordInput.focus();
    resultContainer.style.display = 'none';
    startBtn.style.display = 'none';
    
    renderWords();
    
    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        timeLeft--;
        timeDisplay.textContent = timeLeft;
        
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            stopGame();
        }
    }, 1000);
}

// Намоиш додани қатори калимаҳо мисли 10FastFingers
function renderWords() {
    wordDisplay.innerHTML = '';
    for (let i = 0; i < words.length; i++) {
        const span = document.createElement('span');
        span.textContent = words[i] + ' ';
        if (i === currentWordIndex) {
            span.style.backgroundColor = '#f1c40f'; // Калимаи фаъол зард мешавад
            span.style.padding = '2px 4px';
            span.style.borderRadius = '4px';
        }
        wordDisplay.appendChild(span);
    }
}

wordInput.addEventListener('input', () => {
    if (!isPlaying) return;

    let typedValue = wordInput.value.trim();
    
    // Агар корбар Space-ро пахш кунад (калима тамом шуд)
    if (wordInput.value.endsWith(' ')) {
        if (typedValue === words[currentWordIndex]) {
            correctWordsCount++;
        }
        currentWordIndex++;
        wordInput.value = '';
        
        if (currentWordIndex >= words.length) {
            stopGame();
            return;
        }
        renderWords();
    }
});

function stopGame() {
    isPlaying = false;
    wordInput.disabled = true;
    startBtn.style.display = 'inline-block';
    startBtn.textContent = "Аз нав бозӣ кардан";
    
    // Нишон додани натиҷа дар охир
    resultContainer.style.display = 'block';
    finalScore.textContent = `Шумо ${correctWordsCount} калимаро дуруст навиштед! (${correctWordsCount} калима дар 1 дақиқа)`;
}