class HangmanGame {
    constructor() {
        this.words = [
            "FAMILIA",
            "MEMORIA",
            "AMISTAD",
            "AMOR",
            "ALEGRIA",
            "CUIDADO",
            "PALABRA",
            "MIRADA",
            "ATENCION",
            "REFLEJO",
            "CALMA",
            "ABRAZO",
            "RISA",
            "DIALOGO",
            "PRESENCIA",
            "ESPERANZA",
            "CARIÑO",
            "AFECTO",
            "PAZ",
            "UNION",
            "APOYO",
            "RESPETO",
            "CONFIANZA",
            "TIEMPO",
            "VIDA",
            "FUERZA",
            "VALOR",
            "LUZ",
            "SUEÑO",
            "RECUERDO",
            "ENCUENTRO",
            "PALPITO",
            "CAMINO",
            "DESTINO",
            "HORIZONTE",
            "VINCULO",
            "CALIDEZ",
            "COMPANIA",
            "VOLUNTAD",
            "FORTALEZA",
            "BONDAD",
            "AMABILIDAD",
            "TOLERANCIA",
            "PACENCIA",
            "SOLIDARIDAD",
            "COMPARTIR",
            "SONRISA",
            "ILUSION",
            "ARMONIA",
            "CONSUELO",
            "SERENIDAD",
            "SINCERIDAD",
            "GRATITUD",
            "COMPASION",
            "ALEDAÑO",
            "PROTECCION",
            "SERENIDAD",
            "ENERGIA",
            "LATIDO"
        ]

        this.currentWord = "";
        this.guessedLetters = new Set();
        this.wrongGuesses = 0;
        this.maxWrongGuesses = 10;
        this.gameWon = false;
        this.gameLost = false;

        // Elementos del DOM
        this.wordBlanksElement = document.getElementById('word-blanks');
        this.hangmanDrawingElement = document.getElementById('hangman-drawing');
        this.attemptsLeftElement = document.getElementById('attempts-left');
        this.usedLettersElement = document.getElementById('used-letters');
        this.statusMessageElement = document.getElementById('status-message');
        this.alphabetGridElement = document.getElementById('alphabet-grid');
        this.newGameBtn = document.getElementById('new-game-btn');
        this.resultModal = document.getElementById('game-result-modal');
        this.resultTitle = document.getElementById('result-title');
        this.resultStats = document.getElementById('result-stats');
        this.playAgainBtn = document.getElementById('play-again-btn');

        this.initializeGame();
        this.setupEventListeners();
    }

    initializeGame() {
        this.currentWord = this.words[Math.floor(Math.random() * this.words.length)];
        this.guessedLetters.clear();
        this.wrongGuesses = 0;
        this.gameWon = false;
        this.gameLost = false;

        this.renderWordBlanks();
        //this.renderHangman();
        this.renderAlphabet();
        this.updateStats();
        this.updateStatus('¡Adivina la palabra!');

        // Habilitar todos los botones
        this.enableAlphabetButtons(true);
    }

    setupEventListeners() {
        this.newGameBtn.addEventListener('click', () => this.newGame());
        this.playAgainBtn.addEventListener('click', () => this.playAgain());
    }

    renderWordBlanks() {
        this.wordBlanksElement.innerHTML = '';

        for (let letter of this.currentWord) {
            const blankElement = document.createElement('div');
            blankElement.className = 'letter-blank';

            if (this.guessedLetters.has(letter)) {
                blankElement.textContent = letter;
                blankElement.classList.add('letter-revealed');
            } else {
                blankElement.textContent = '';
            }

            this.wordBlanksElement.appendChild(blankElement);
        }
    }

    renderAlphabet() {
        this.alphabetGridElement.innerHTML = '';

        const alphabet = 'ABCDEFGHIJKLMNÑOPQRSTUVWXYZ'.split('');

        alphabet.forEach(letter => {
            const button = document.createElement('button');
            button.className = 'letter-btn';
            button.textContent = letter;
            button.dataset.letter = letter;

            if (this.guessedLetters.has(letter)) {
                button.disabled = true;
                if (this.currentWord.includes(letter)) {
                    button.classList.add('correct');
                } else {
                    button.classList.add('incorrect');
                }
            }

            button.addEventListener('click', () => this.guessLetter(letter));
            this.alphabetGridElement.appendChild(button);
        });
    }

    guessLetter(letter) {
        if (this.gameWon || this.gameLost || this.guessedLetters.has(letter)) {
            return;
        }

        this.guessedLetters.add(letter);

        if (this.currentWord.includes(letter)) {
            // Letra correcta
            this.updateStatus(`¡Correcto! La letra "${letter}" está en la palabra.`);
            this.renderWordBlanks();

            // Verificar si ganó
            if (this.checkWin()) {
                this.gameWon = true;
                this.endGame(true);
                return;
            }
        } else {
            // Letra incorrecta
            this.wrongGuesses++;
            this.updateStatus(`Incorrecto. La letra "${letter}" no está en la palabra.`);
            //this.renderHangman();

            // Verificar si perdió
            if (this.wrongGuesses >= this.maxWrongGuesses) {
                this.gameLost = true;
                this.endGame(false);
                return;
            }
        }

        this.renderAlphabet();
        this.updateStats();
    }

    checkWin() {
        for (let letter of this.currentWord) {
            if (!this.guessedLetters.has(letter)) {
                return false;
            }
        }
        return true;
    }

    endGame(won) {
        this.enableAlphabetButtons(false);

        if (won) {
            this.resultTitle.textContent = '¡Ganaste!';
            this.resultStats.textContent = `¡Felicitaciones! Adivinaste la palabra "${this.currentWord}" con ${this.guessedLetters.size} letras usadas.`;
        } else {
            this.resultTitle.textContent = 'Perdiste';
            this.resultStats.textContent = `La palabra era "${this.currentWord}". Mejor suerte la próxima vez.`;
        }

        this.resultModal.classList.add('show');
    }

    updateStats() {
        this.attemptsLeftElement.textContent = this.maxWrongGuesses - this.wrongGuesses;
        this.usedLettersElement.textContent = this.guessedLetters.size;
    }

    updateStatus(message) {
        this.statusMessageElement.textContent = message;
    }

    enableAlphabetButtons(enabled) {
        const buttons = this.alphabetGridElement.querySelectorAll('.letter-btn');
        buttons.forEach(button => {
            if (!this.guessedLetters.has(button.dataset.letter)) {
                button.disabled = !enabled;
            }
        });
    }

    newGame() {
        this.resultModal.classList.remove('show');
        this.initializeGame();
    }

    playAgain() {
        this.resultModal.classList.remove('show');
        this.initializeGame();
    }
}

// Inicializar el juego cuando se carga la página
document.addEventListener('DOMContentLoaded', () => {
    new HangmanGame();
});
