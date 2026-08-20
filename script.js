const words = [
    "лицо", "ребенок", "самый", "казаться", "любить", "почему", "у", "вода", "бы", "жена",
    "страна", "дверь", "ничто", "очень", "свое", "даже", "почему", "год", "значить", "при",
    "время", "человек", "дело", "жизнь", "день", "рука", "работа", "слово", "лицо", "место"
];

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

startBtn.addEventListener('click', startGame);

function startGame() {
    isPlaying = true;
    timeLeft = 60;
    currentWordIndex = 0;
    correctWordsCount = 0;
    incorrectWordsCount = 0;
    
    wordInput.value = '';
    wordInput.disabled = false;
    wordInput.focus();
    if(resultContainer) resultContainer.style.display = 'none';
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

function renderWords() {
    wordDisplay.innerHTML = '';
    words.forEach((word, index) => {
        const span = document.createElement('span');
        span.textContent = word;
        if (index === currentWordIndex) {
            span.classList.add('current');
        }
        wordDisplay.appendChild(span);
    });
}

wordInput.addEventListener('input', () => {
    if (!isPlaying) return;

    const typedValue = wordInput.value;
    const currentWord = words[currentWordIndex];

    // Агар корбар Space пахш кунад (калима тамом шуд)
    if (typedValue.endsWith(' ')) {
        const cleanTyped = typedValue.trim();
        
        const wordSpans = wordDisplay.children;
        if (cleanTyped === currentWord) {
            wordSpans[currentWordIndex].classList.add('correct');
            correctWordsCount++;
        } else {
            wordSpans[currentWordIndex].classList.add('incorrect');
            incorrectWordsCount++;
        }

        currentWordIndex++;
        wordInput.value = '';

        if (currentWordIndex >= words.length) {
            stopGame();
            return;
        }

        // Кӯчонидани ҳолати "current" ба калимаи навбатӣ
        for (let i = 0; i < wordSpans.length; i++) {
            wordSpans[i].classList.remove('current');
        }
        if (wordSpans[currentWordIndex]) {
            wordSpans[currentWordIndex].classList.add('current');
        }
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
