(() => {
    const gridEl     = document.getElementById('grid');
    const feedbackEl = document.getElementById('feedback');
    const modeLabel  = document.getElementById('mode-label');
    const levelLabel = document.getElementById('level-label');
  
    const btnNumbers = document.getElementById('mode-numbers');
    const btnLetters = document.getElementById('mode-letters');
    const newGameBtn = document.getElementById('new-game-btn');
  
    // Estado del juego
    let mode = 'numbers';   // 'numbers' | 'letters'
    let lastSelectedMode = 'numbers'; // guarda el último modo seleccionado por el usuario
    let level = 1;          // sube cuando se completa
    let length = 6;         // cantidad inicial (crece con el nivel)
    let sequence = [];      // orden correcto
    let expectedIndex = 0;  // índice a adivinar
  
    // Utiles
    const shuffle = arr => arr.sort(() => Math.random() - 0.5);
  
    function buildPoolNumbers(n){
      return Array.from({length: n}, (_, i) => i + 1);
    }
    function buildPoolLetters(n){
      // A, B, C... J (10) y luego crece: K, L, M, N, O...
      const start = 'A'.charCodeAt(0);
      return Array.from({length: n}, (_, i) => String.fromCharCode(start + i));
    }
  
    function setMode(newMode){
      mode = newMode;
      lastSelectedMode = newMode;
      btnNumbers.classList.toggle('active', mode === 'numbers');
      btnLetters.classList.toggle('active', mode === 'letters');
      modeLabel.textContent = mode === 'numbers' ? 'Números' : 'Letras';
      startRound();
    }
  
    function startRound(){
      // Definir longitud según nivel (cap en 15)
      length = Math.min(5 + (level - 1) * 2, 15);
  
      // armar pool y la secuencia ordenada
      const pool = mode === 'numbers' ? buildPoolNumbers(length) : buildPoolLetters(length);
      sequence = [...pool]; // orden correcto
  
      // Mezcla para mostrar al usuario
      const shuffled = shuffle([...pool]);
  
      // reset estado
      expectedIndex = 0;
      levelLabel.textContent = String(level);
      feedbackEl.textContent = '';
      feedbackEl.className = 'feedback';
  
      // Render fichas
      gridEl.innerHTML = '';
      shuffled.forEach(val => {
        const tile = document.createElement('button');
        tile.className = 'tile';
        tile.textContent = String(val);
        tile.setAttribute('aria-label', `Elemento ${val}`);
        tile.addEventListener('click', () => onTileClick(tile, val));
        gridEl.appendChild(tile);
      });
    }
  
    function onTileClick(tile, value){
      const expected = sequence[expectedIndex];
  
      // Normalizar tipos
      const isCorrect = String(value) === String(expected);
  
      if (isCorrect){
        tile.classList.add('correct', 'disabled');
        tile.disabled = true;
        expectedIndex += 1;
  
        if (expectedIndex >= sequence.length){
          feedbackEl.textContent = '¡Muy bien!';
          feedbackEl.classList.add('ok');
  
          // subir nivel y aumentar dificultad, manteniendo el último modo seleccionado por el usuario
          setTimeout(() => {
            level += 1;
            setMode(lastSelectedMode);
          }, 900);
        }
      } else {
        // marcar error momentáneamente
        feedbackEl.textContent = 'Error, intenta de nuevo';
        feedbackEl.classList.add('err');
        tile.classList.add('wrong');
        setTimeout(() => tile.classList.remove('wrong'), 350);
      }
    }
  
    function newGame(){
      level = 1;
      // mantener modo actual
      startRound();
    }
  
    // Listeners
    btnNumbers.addEventListener('click', () => setMode('numbers'));
    btnLetters.addEventListener('click', () => setMode('letters'));
    newGameBtn.addEventListener('click', newGame);
  
    // Init
    setMode('numbers');
  })();