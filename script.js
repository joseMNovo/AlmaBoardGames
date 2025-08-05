let currentSize = 4;
let cards = [];
let flippedCards = [];
let matchedPairs = 0;
let attempts = 0;
let canFlip = true;

function initGame(size = 4) {
    currentSize = size;
    const totalCards = size * size;
    const totalPairs = Math.floor(totalCards / 2);
    
    // Update UI
    document.getElementById('total-pairs').textContent = totalPairs;
    document.getElementById('pairs-found').textContent = '0';
    document.getElementById('attempts').textContent = '0';
    
    // Reset game state
    matchedPairs = 0;
    attempts = 0;
    flippedCards = [];
    canFlip = true;
    
    // Generate card numbers
    const numbers = [];
    for (let i = 1; i <= totalPairs; i++) {
        numbers.push(i, i);
    }
    
    // Shuffle cards
    cards = shuffleArray(numbers);
    
    // Update board class
    const board = document.getElementById('game-board');
    board.className = `game-board size-${size}`;
    
    // Generate HTML
    board.innerHTML = cards.map((number, index) => `
        <div class="card" data-index="${index}" onclick="flipCard(${index})">
            <div class="card-inner">
                <div class="card-front"></div>
                <div class="card-back">${number}</div>
            </div>
        </div>
    `).join('');
}

function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

function flipCard(index) {
    if (!canFlip || flippedCards.length >= 2) return;
    
    const cardElement = document.querySelector(`[data-index="${index}"]`);
    if (cardElement.classList.contains('flipped') || cardElement.classList.contains('matched')) return;
    
    cardElement.classList.add('flipped');
    flippedCards.push({ index, number: cards[index], element: cardElement });
    
    if (flippedCards.length === 2) {
        attempts++;
        document.getElementById('attempts').textContent = attempts;
        canFlip = false;
        
        setTimeout(() => {
            checkMatch();
        }, 1000);
    }
}

function checkMatch() {
    const [card1, card2] = flippedCards;
    
    if (card1.number === card2.number) {
        // Match found
        card1.element.classList.add('matched');
        card2.element.classList.add('matched');
        matchedPairs++;
        document.getElementById('pairs-found').textContent = matchedPairs;
        
        // Check for victory
        const totalPairs = Math.floor(currentSize * currentSize / 2);
        if (matchedPairs === totalPairs) {
            setTimeout(() => {
                showVictoryMessage();
            }, 500);
        }
    } else {
        // No match
        card1.element.classList.remove('flipped');
        card2.element.classList.remove('flipped');
    }
    
    flippedCards = [];
    canFlip = true;
}

function showVictoryMessage() {
    const message = document.getElementById('victory-message');
    const stats = document.getElementById('victory-stats');
    stats.textContent = `¡Completaste el juego en ${attempts} intentos!`;
    message.classList.add('show');
}

function hideVictoryMessage() {
    document.getElementById('victory-message').classList.remove('show');
}

function resetGame() {
    hideVictoryMessage();
    initGame(currentSize);
}

// Size button handlers
document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.size-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            if (e.target.dataset.size) {
                // Update active button
                document.querySelectorAll('.size-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                
                // Start new game with selected size
                initGame(parseInt(e.target.dataset.size));
            }
        });
    });

    // Initialize game
    initGame(4);
}); 