class WordSearchGame {
    constructor() {
        this.todasLasPalabras = ["ALMA", "MEMORIA", "CUERPO", "MENTE", "JUEGO","RECUERDO","CEREBRO","PENSAR","SENTIR","APRENDER","EMOCION","CUIDADO","JUGAR","SONRISA","AFECTO","PALABRA","MIRADA","ATENCION","REFLEJO","AMISTAD","CALMA","ABRAZO","RISA","DIALOGO","PRESENCIA"];
        this.palabras = this.seleccionarPalabrasAleatorias(5);
        this.tamanio = 10;
        this.grid = [];
        this.selectedCells = [];
        this.foundWords = new Set();
        this.gameStartTime = null;
        this.timerInterval = null;
        this.showMobileInstructions = true; // Para controlar el modal móvil
        
        this.gridElement = document.getElementById("grid");
        this.wordsListElement = document.getElementById("words-list");
        this.timeElement = document.getElementById("time");
        this.foundElement = document.getElementById("found");
        this.resetBtn = document.getElementById("reset-btn");
        this.victoryMessage = document.getElementById("victory-message");
        this.victoryStats = document.getElementById("victory-stats");
        
        this.initializeGame();
        this.setupEventListeners();
        this.showMobileInstructionsModal();
    }

    seleccionarPalabrasAleatorias(cantidad) {
        const palabrasDisponibles = [...this.todasLasPalabras];
        const palabrasSeleccionadas = [];
        
        for (let i = 0; i < cantidad && palabrasDisponibles.length > 0; i++) {
            const indiceAleatorio = Math.floor(Math.random() * palabrasDisponibles.length);
            palabrasSeleccionadas.push(palabrasDisponibles[indiceAleatorio]);
            palabrasDisponibles.splice(indiceAleatorio, 1);
        }
        
        return palabrasSeleccionadas;
    }

    initializeGame() {
        // Crear grilla vacía
        this.grid = Array.from({ length: this.tamanio }, () => Array(this.tamanio).fill(""));
        
        // Colocar palabras
        this.palabras.forEach(palabra => this.colocarPalabra(palabra));
        
        // Rellenar vacíos con letras random
        for (let y = 0; y < this.tamanio; y++) {
            for (let x = 0; x < this.tamanio; x++) {
                if (this.grid[y][x] === "") {
                    this.grid[y][x] = String.fromCharCode(65 + Math.floor(Math.random() * 26));
                }
            }
        }
        
        this.renderGrid();
        this.renderWordsList();
        this.startTimer();
    }

    colocarPalabra(palabra) {
        const dir = Math.random() < 0.5 ? "H" : "V"; // Horizontal o Vertical
        let x, y;

        for (let intento = 0; intento < 100; intento++) {
            if (dir === "H") {
                x = Math.floor(Math.random() * (this.tamanio - palabra.length + 1));
                y = Math.floor(Math.random() * this.tamanio);
                if (this.grid[y].slice(x, x + palabra.length).every(c => c === "")) {
                    for (let i = 0; i < palabra.length; i++) {
                        this.grid[y][x + i] = palabra[i];
                    }
                    return;
                }
            } else {
                x = Math.floor(Math.random() * this.tamanio);
                y = Math.floor(Math.random() * (this.tamanio - palabra.length + 1));
                if (this.grid.slice(y, y + palabra.length).every(row => row[x] === "")) {
                    for (let i = 0; i < palabra.length; i++) {
                        this.grid[y + i][x] = palabra[i];
                    }
                    return;
                }
            }
        }
    }

    renderGrid() {
        this.gridElement.innerHTML = "";
        this.gridElement.classList.add(`size-${this.tamanio}`);

        for (let y = 0; y < this.tamanio; y++) {
            for (let x = 0; x < this.tamanio; x++) {
                const cell = document.createElement("div");
                cell.classList.add("cell");
                cell.textContent = this.grid[y][x];
                cell.dataset.x = x;
                cell.dataset.y = y;

                cell.addEventListener("click", () => this.handleCellClick(cell, x, y));
                cell.addEventListener("mouseenter", () => this.handleCellHover(cell, x, y));

                this.gridElement.appendChild(cell);
            }
        }
    }

    renderWordsList() {
        this.wordsListElement.innerHTML = "";
        this.palabras.forEach(palabra => {
            const wordElement = document.createElement("span");
            wordElement.classList.add("word");
            wordElement.textContent = palabra;
            if (this.foundWords.has(palabra)) {
                wordElement.classList.add("found");
            }
            this.wordsListElement.appendChild(wordElement);
        });
    }

    handleCellClick(cell, x, y) {
        if (this.foundWords.size === this.palabras.length) return; // Juego terminado

        if (this.selectedCells.length === 0) {
            // Primera celda seleccionada
            this.selectedCells = [{ x, y, cell }];
            cell.classList.add("selected");
        } else if (this.selectedCells.length === 1) {
            // Segunda celda seleccionada - verificar si forma una palabra
            const firstCell = this.selectedCells[0];
            const secondCell = { x, y, cell };

            // Limpiar selección anterior
            firstCell.cell.classList.remove("selected");

            // Verificar si las celdas están en línea
            const cells = this.getCellsInLine(firstCell, secondCell);
            if (cells.length > 1) {
                // Obtener la palabra en dirección hacia adelante
                const wordForward = this.getWordFromCells(cells);
                
                // Crear una copia del array para la dirección hacia atrás
                const cellsBackward = [...cells].reverse();
                const wordBackward = this.getWordFromCells(cellsBackward);
                
                // Verificar si alguna de las palabras está en la lista
                if (this.palabras.includes(wordForward)) {
                    this.markWordAsFound(cells, wordForward);
                } else if (this.palabras.includes(wordBackward)) {
                    this.markWordAsFound(cellsBackward, wordBackward);
                }
            }

            this.selectedCells = [];
        }
    }

    handleCellHover(cell, x, y) {
        // Limpiar hover anterior
        document.querySelectorAll('.cell').forEach(c => c.classList.remove('hover'));

        if (this.selectedCells.length === 1) {
            const firstCell = this.selectedCells[0];
            const cells = this.getCellsInLine(firstCell, { x, y, cell });
            cells.forEach(c => c.cell.classList.add('hover'));
        }
    }

    getCellsInLine(firstCell, secondCell) {
        const dx = secondCell.x - firstCell.x;
        const dy = secondCell.y - firstCell.y;

        // Verificar si están en línea recta
        if (dx !== 0 && dy !== 0 && Math.abs(dx) !== Math.abs(dy)) {
            return [firstCell];
        }

        const cells = [];
        const steps = Math.max(Math.abs(dx), Math.abs(dy));

        for (let i = 0; i <= steps; i++) {
            const x = firstCell.x + Math.round((dx / steps) * i);
            const y = firstCell.y + Math.round((dy / steps) * i);
            const cellElement = document.querySelector(`[data-x="${x}"][data-y="${y}"]`);
            cells.push({ x, y, cell: cellElement });
        }

        return cells;
    }

    getWordFromCells(cells) {
        return cells.map(c => this.grid[c.y][c.x]).join('');
    }

    markWordAsFound(cells, word) {
        cells.forEach(c => {
            c.cell.classList.add("found");
            c.cell.classList.remove("selected", "hover");
        });

        this.foundWords.add(word);
        this.updateStats();
        this.renderWordsList();

        if (this.foundWords.size === this.palabras.length) {
            this.showVictoryMessage();
        }
    }

    updateStats() {
        this.foundElement.textContent = `${this.foundWords.size}/${this.palabras.length}`;
    }

    startTimer() {
        this.gameStartTime = Date.now();
        this.timerInterval = setInterval(() => {
            const elapsed = Math.floor((Date.now() - this.gameStartTime) / 1000);
            const minutes = Math.floor(elapsed / 60);
            const seconds = elapsed % 60;
            this.timeElement.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        }, 1000);
    }

    showVictoryMessage() {
        clearInterval(this.timerInterval);
        const elapsed = Math.floor((Date.now() - this.gameStartTime) / 1000);
        const minutes = Math.floor(elapsed / 60);
        const seconds = elapsed % 60;

        this.victoryStats.textContent = `Completaste el juego en ${minutes}:${seconds.toString().padStart(2, '0')}`;
        this.victoryMessage.classList.add("show");
    }

    resetGame() {
        clearInterval(this.timerInterval);
        this.selectedCells = [];
        this.foundWords.clear();
        this.victoryMessage.classList.remove("show");
        // Seleccionar nuevas palabras aleatorias
        this.palabras = this.seleccionarPalabrasAleatorias(5);
        this.initializeGame();
        // Mostrar modal móvil al reiniciar
        this.showMobileInstructionsModal();
    }

    setupEventListeners() {
        this.resetBtn.addEventListener("click", () => this.resetGame());

        // Botones de dificultad
        document.querySelectorAll('.difficulty-btn').forEach(btn => {
            btn.addEventListener("click", () => {
                document.querySelectorAll('.difficulty-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                // Aquí se podría cambiar la dificultad
            });
        });
    }

    showMobileInstructionsModal() {
        // Solo mostrar en dispositivos móviles
        if (window.innerWidth <= 768) {
            const modal = document.getElementById("mobile-instructions-modal");
            if (modal) {
                modal.classList.add("show");
                
                // Agregar event listener para cerrar el modal
                const closeBtn = modal.querySelector(".modal-close-btn");
                if (closeBtn) {
                    closeBtn.addEventListener("click", () => {
                        modal.classList.remove("show");
                    });
                }
                
                // Cerrar al hacer clic fuera del modal
                modal.addEventListener("click", (event) => {
                    if (event.target === modal) {
                        modal.classList.remove("show");
                    }
                });
            }
        }
    }
}

// Inicializar el juego cuando se carga la página
document.addEventListener('DOMContentLoaded', () => {
    window.wordSearchGame = new WordSearchGame();
});

// Función global para el botón de victoria
function resetGame() {
    window.wordSearchGame.resetGame();
}

document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('mobile-instructions-modal');
    const closeBtn = modal?.querySelector('.modal-close-btn');
  
    // Mostrar SIEMPRE al cargar (mobile, desktop y 4K)
    if (modal) modal.classList.add('open');
  
    // Cerrar al tocar "Entendido"
    closeBtn?.addEventListener('click', () => modal.classList.remove('open'));
  });
  