const wordsData = {
    tg: ["китоб", "мактаб", "барнома", "хона", "мошин", "дунё", "вақт", "кор", "дарс", "хонанда", "дониш", "компютер", "забон", "тез", "навиштан"],
    ru: ["лицо", "ребенок", "самый", "казаться", "любить", "почему", "вода", "бы", "жена", "страна", "дверь", "ничто", "очень", "свое", "даже"],
    en: ["time", "person", "year", "way", "day", "thing", "man", "world", "life", "hand", "part", "child", "eye", "woman", "place"]
};

let words = [], currentWordIndex = 0, currentLang = 'ru';
const wordDisplay = document.getElementById('word-display'), wordInput = document.getElementById('word-input'), timeDisplay = document.getElementById('time');

function generateWords() {
    words = [];
    for(let i = 0; i < 500; i++) words.push(wordsData[currentLang][Math.floor(Math.random() * wordsData[currentLang].length)]);
    renderWords();
}

function renderWords() {
    wordDisplay.innerHTML = '';
    words.forEach((w, i) => {
        const span = document.createElement('span');
        span.textContent = w + " ";
        if(i === currentWordIndex) {
            span.classList.add('current');
            span.scrollIntoView({behavior: 'smooth', block: 'center'});
        }
        wordDisplay.appendChild(span);
    });
}

document.getElementById('lang-select').addEventListener('change', (e) => { currentLang = e.target.value; generateWords(); });
document.getElementById('start-btn').addEventListener('click', () => {
    currentWordIndex = 0; wordInput.disabled = false; wordInput.focus(); generateWords();
    let timeLeft = 60;
    const timer = setInterval(() => {
        timeDisplay.textContent = --timeLeft;
        if(timeLeft <= 0) { clearInterval(timer); wordInput.disabled = true; alert("Вақт тамом!"); }
    }, 1000);
});

wordInput.addEventListener('input', (e) => {
    if(e.target.value.endsWith(' ')) {
        const typed = e.target.value.trim();
        wordDisplay.children[currentWordIndex].classList.add(typed === words[currentWordIndex] ? 'correct' : 'incorrect');
        currentWordIndex++;
        e.target.value = '';
        renderWords();
    }
});

generateWords();
