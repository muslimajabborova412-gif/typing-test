// ... (Луғати калимаҳо ҳамон хел мемонад) ...

let currentWordIndex = 0;
let totalWords = 500; // Мо 500 калимаро таъин мекунем

// Функцияи сохтани 500 калима
function generateRandomWords() {
    const baseList = wordsData[currentLang];
    words = [];
    for (let i = 0; i < totalWords; i++) {
        const randomIndex = Math.floor(Math.random() * baseList.length);
        words.push(baseList[randomIndex]);
    }
}

// Дар `renderWords` мо ҳамаи 500 калимаро мепартоем, аммо CSS баландиро идора мекунад
function renderWords() {
    wordDisplay.innerHTML = '';
    words.forEach((word, index) => {
        const span = document.createElement('span');
        span.textContent = word + " ";
        if (index === currentWordIndex) {
            span.classList.add('current');
            // Ин қисм калимаи фаъолро ҳамеша дар маркази экран нигоҳ медорад (авто-скролл)
            span.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        wordDisplay.appendChild(span);
    });
}

// ... (Дигар қисмҳои функсияҳо мисли пешина) ...
