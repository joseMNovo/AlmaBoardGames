class SimonSaysGame {
    constructor() {
        this.sequence = [];
        this.playerSequence = [];
        this.score = 0;
        this.isPlaying = false;
        this.isShowingSequence = false;
        this.currentIndex = 0;
        this.isAudioEnabled = true;
        
        // Frecuencias para los sonidos (en Hz)
        this.sounds = {
            red: 523.25,    // C5
            blue: 659.25,   // E5
            green: 783.99,  // G5
            yellow: 987.77  // B5
        };
        
        // Elementos del DOM
        this.scoreElement = document.getElementById('score');
        this.startBtn = document.getElementById('start-btn');
        this.restartBtn = document.getElementById('restart-btn');
        this.statusMessage = document.getElementById('status-message');
        this.resultModal = document.getElementById('game-result-modal');
        this.resultTitle = document.getElementById('result-title');
        this.resultStats = document.getElementById('result-stats');
        this.playAgainBtn = document.getElementById('play-again-btn');
        this.audioToggle = document.getElementById('audio-toggle');
        this.countdownModal = document.getElementById('countdown-modal');
        this.countdownNumber = document.getElementById('countdown-number');
        this.buttons = {
            red: document.getElementById('red'),
            blue: document.getElementById('blue'),
            green: document.getElementById('green'),
            yellow: document.getElementById('yellow')
        };
        
        this.initializeGame();
        this.setupEventListeners();
    }
    
    initializeGame() {
        this.updateScore();
        this.updateStatus('Presiona "Comenzar" para jugar');
        this.enableButtons(false);
    }
    
    setupEventListeners() {
        this.startBtn.addEventListener('click', () => this.startGame());
        this.restartBtn.addEventListener('click', () => this.restartGame());
        this.playAgainBtn.addEventListener('click', () => this.playAgain());
        this.audioToggle.addEventListener('click', () => this.toggleAudio());
        
        // Event listeners para los botones de Simon
        Object.keys(this.buttons).forEach(color => {
            this.buttons[color].addEventListener('click', () => this.handleButtonClick(color));
        });
    }
    
    startGame() {
        this.sequence = [];
        this.score = 0;
        this.isPlaying = true;
        this.startBtn.disabled = true;
        this.startBtn.textContent = 'Jugando...';
        
        // Mostrar contador antes de comenzar
        this.showCountdown();
    }
    
    addToSequence() {
        const colors = ['red', 'blue', 'green', 'yellow'];
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        this.sequence.push(randomColor);
    }
    
    async showSequence() {
        this.isShowingSequence = true;
        this.updateStatus('Observa la secuencia...');
        this.enableButtons(false);
        
        for (let i = 0; i < this.sequence.length; i++) {
            await this.highlightButton(this.sequence[i]);
            await this.delay(500); // Pausa entre botones
        }
        
        this.isShowingSequence = false;
        this.playerSequence = [];
        this.currentIndex = 0;
        this.enableButtons(true);
        this.updateStatus('¡Tu turno! Repite la secuencia');
    }
    
    async highlightButton(color) {
        const button = this.buttons[color];
        
        // Activar el botón
        button.classList.add('active');
        // Asegurarse que el sonido siempre suene si está activado
        if (this.isAudioEnabled) {
            this.playSound(color);
        }
        
        // Esperar 300ms
        await this.delay(300);
        
        // Desactivar el botón
        button.classList.remove('active');
    }
    
    handleButtonClick(color) {
        if (!this.isPlaying || this.isShowingSequence) return;
        
        // Verificar si el jugador hizo clic en el botón correcto
        if (color === this.sequence[this.currentIndex]) {
            this.playerSequence.push(color);
            this.currentIndex++;
            
            // Resaltar el botón clickeado
            // Asegurarse que el sonido siempre suene si está activado
            if (this.isAudioEnabled) {
                this.playSound(color);
            }
            this.highlightButton(color);
            
            // Verificar si completó la secuencia
            if (this.currentIndex === this.sequence.length) {
                this.score++;
                this.updateScore();
                
                // Verificar si alcanzó un nivel especial (por ejemplo, nivel 10)
                if (this.score >= 10) {
                    this.isPlaying = false;
                    this.enableButtons(false);
                    this.startBtn.disabled = false;
                    this.startBtn.textContent = 'Comenzar';
                    this.showResultModal(true);
                } else {
                    this.updateStatus('¡Correcto! Siguiente nivel...');
                    
                    // Esperar un momento y continuar
                    setTimeout(() => {
                        this.addToSequence();
                        this.showSequence();
                    }, 1000);
                }
            }
        } else {
            // Error - juego terminado
            this.gameOver();
        }
    }
    
    gameOver() {
        this.isPlaying = false;
        this.enableButtons(false);
        this.startBtn.disabled = false;
        this.startBtn.textContent = 'Comenzar';
        
        // Mostrar modal de resultado
        this.showResultModal(false);
    }
    
    playSound(frequency) {
        // El sonido solo depende de isAudioEnabled, pero la lógica de asegurarse de sonar ya está en highlightButton y handleButtonClick
        if (!this.isAudioEnabled) return;
        
        // Crear un oscilador de audio para generar el sonido
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.value = this.sounds[frequency];
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.3);
    }
    
    enableButtons(enabled) {
        Object.values(this.buttons).forEach(button => {
            button.disabled = !enabled;
        });
    }
    
    updateScore() {
        this.scoreElement.textContent = this.score;
    }
    
    updateStatus(message) {
        this.statusMessage.textContent = message;
    }
    
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    
    showResultModal(isVictory) {
        if (isVictory) {
            this.resultTitle.textContent = '¡Felicitaciones!';
            this.resultStats.textContent = `¡Completaste el nivel ${this.score}!`;
        } else {
            this.resultTitle.textContent = 'Juego Terminado';
            this.resultStats.textContent = `Tu puntaje fue ${this.score}`;
        }
        this.resultModal.classList.add('show');
    }
    
    hideResultModal() {
        this.resultModal.classList.remove('show');
    }
    
    restartGame() {
        this.resetGame();
        this.startGame();
    }
    
    playAgain() {
        this.hideResultModal();
        this.resetGame();
        this.startGame();
    }
    
    resetGame() {
        this.sequence = [];
        this.playerSequence = [];
        this.score = 0;
        this.currentIndex = 0;
        this.updateScore();
        this.updateStatus('Presiona "Comenzar" para jugar');
        this.hideResultModal();
    }
    
    toggleAudio() {
        this.isAudioEnabled = !this.isAudioEnabled;
        this.updateAudioIcon();
    }
    
    updateAudioIcon() {
        if (this.isAudioEnabled) {
            this.audioToggle.textContent = '🔊';
            this.audioToggle.classList.remove('muted');
            this.audioToggle.title = 'Desactivar sonido';
        } else {
            this.audioToggle.textContent = '🔇';
            this.audioToggle.classList.add('muted');
            this.audioToggle.title = 'Activar sonido';
        }
    }
    
    async showCountdown() {
        this.countdownModal.classList.add('show');
        
        // Contador de 3 a 1
        for (let i = 3; i >= 1; i--) {
            this.countdownNumber.textContent = i;
            await this.delay(1000);
        }
        
        // Ocultar modal y comenzar juego
        this.countdownModal.classList.remove('show');
        this.addToSequence();
        this.showSequence();
    }
}

// Inicializar el juego cuando se carga la página
document.addEventListener('DOMContentLoaded', () => {
    new SimonSaysGame();
});
