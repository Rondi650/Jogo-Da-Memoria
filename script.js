const gameSymbols = [
    '☎️', '🎧', '📞', '💬', 
    '📋', '⏰', '🎯', '👥'
];

let gameBoard = [];
let flippedCards = [];
let matchedPairs = 0;
let attempts = 0;
let gameTime = 0;
let timer;
let isProcessing = false;

function shuffle(array) {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
}

function initGame() {
    // Criar pares de símbolos e embaralhar
    const pairs = [...gameSymbols, ...gameSymbols];
    gameBoard = shuffle(pairs);
    
    // Reset das variáveis
    flippedCards = [];
    matchedPairs = 0;
    attempts = 0;
    gameTime = 0;
    isProcessing = false;
    
    // Parar timer anterior se existir
    if (timer) clearInterval(timer);
    
    // Criar o tabuleiro visual
    createBoard();
    updateStats();
    startTimer();
    
    document.getElementById('message').textContent = 'Encontre os pares relacionados ao call center!';
    document.getElementById('message').classList.remove('victory');
}

function createBoard() {
    const boardElement = document.getElementById('gameBoard');
    boardElement.innerHTML = '';

    gameBoard.forEach((symbol, index) => {
        const card = document.createElement('div');
        card.className = 'card';
        card.dataset.index = index;
        card.innerHTML = `
            <div class="card-back">?</div>
            <div class="card-content">${symbol}</div>
        `;
        card.addEventListener('click', () => flipCard(index));
        boardElement.appendChild(card);
    });
}

function flipCard(index) {
    if (isProcessing || flippedCards.length >= 2) return;
    
    const card = document.querySelector(`[data-index="${index}"]`);
    if (card.classList.contains('flipped') || card.classList.contains('matched')) return;

    card.classList.add('flipped');
    flippedCards.push(index);

    if (flippedCards.length === 2) {
        isProcessing = true;
        attempts++;
        updateStats();
        
        setTimeout(() => {
            checkMatch();
        }, 1000);
    }
}

function checkMatch() {
    const [first, second] = flippedCards;
    const firstCard = document.querySelector(`[data-index="${first}"]`);
    const secondCard = document.querySelector(`[data-index="${second}"]`);

    if (gameBoard[first] === gameBoard[second]) {
        // Par encontrado!
        firstCard.classList.add('matched');
        secondCard.classList.add('matched');
        matchedPairs++;
        
        document.getElementById('message').textContent = 'Par encontrado! Parabéns! 🎉';
        
        if (matchedPairs === 8) {
            // Jogo completo!
            clearInterval(timer);
            document.getElementById('message').textContent = `🎉 Parabéns! Você completou o jogo em ${attempts} tentativas e ${formatTime(gameTime)}!`;
            document.getElementById('message').classList.add('victory');
        }
    } else {
        // Não é par, virar as cartas de volta
        firstCard.classList.remove('flipped');
        secondCard.classList.remove('flipped');
        document.getElementById('message').textContent = 'Não foi dessa vez! Tente novamente! 🤔';
    }

    flippedCards = [];
    isProcessing = false;
    updateStats();
}

function updateStats() {
    document.getElementById('time').textContent = formatTime(gameTime);
    document.getElementById('attempts').textContent = attempts;
    document.getElementById('matches').textContent = `${matchedPairs}/8`;
}

function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

function startTimer() {
    timer = setInterval(() => {
        gameTime++;
        updateStats();
    }, 1000);
}

function restartGame() {
    initGame();
}

// Inicializar o jogo
window.onload = initGame;