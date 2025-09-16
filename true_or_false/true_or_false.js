(function () {
  // Estado
  let questions = [];
  let currentIndex = 0;
  let correct = 0;
  let answered = 0;
  let timerId = null;
  let timeLeft = 20;
  let wrongIds = new Set();
  let wrongById = new Map();

  // DOM
  const timeLeftEl = document.getElementById('time-left');
  const correctEl = document.getElementById('correct-count');
  const answeredEl = document.getElementById('answered-count');
  const questionEl = document.getElementById('question-text');
  const feedbackEl = document.getElementById('feedback');
  const btnTrue = document.getElementById('btn-true');
  const btnFalse = document.getElementById('btn-false');
  const resetBtn = document.getElementById('reset-btn');

  const resultsModal = document.getElementById('results-modal');
  const resultStats = document.getElementById('result-stats');
  const wrongList = document.getElementById('wrong-list');
  const playAgainBtn = document.getElementById('play-again-btn');

  function shuffle(arr) { return arr.sort(() => Math.random() - 0.5); }

  async function loadQuestions() {
    try {
      const res = await fetch('../statics/json/verdadero_y_falso.json');
      if (!res.ok) throw new Error('Fetch failed');
      const data = await res.json();
      return data;
    } catch (e) {
      // Hardcodeo 20 items si falla el fetch
      return [
        {
          "id": 1,
          "frase": "Demencia senil es un diagnóstico médico actual.",
          "respuesta": false,
          "explicacion": "Ese término ya no se usa; se habla de Alzheimer u otros tipos de demencia."
        },
        {
          "id": 2,
          "frase": "El Alzheimer es una forma de demencia.",
          "respuesta": true,
          "explicacion": "El Alzheimer es el tipo de demencia más frecuente, aunque no el único."
        },
        {
          "id": 3,
          "frase": "Las demencias solo afectan a personas muy ancianas.",
          "respuesta": false,
          "explicacion": "También pueden aparecer antes de los 65 años (inicio temprano)."
        },
        {
          "id": 4,
          "frase": "Tener olvidos comunes significa que alguien tiene Alzheimer.",
          "respuesta": false,
          "explicacion": "Los olvidos cotidianos no siempre son patológicos ni significan demencia."
        },
        {
          "id": 5,
          "frase": "El Alzheimer es parte normal del envejecimiento.",
          "respuesta": false,
          "explicacion": "El envejecimiento normal trae cambios de memoria, pero el Alzheimer es una enfermedad."
        },
        {
          "id": 6,
          "frase": "La demencia afecta solo a la memoria.",
          "respuesta": false,
          "explicacion": "También impacta en lenguaje, conducta, emociones y autonomía."
        },
        {
          "id": 7,
          "frase": "El Alzheimer no se puede prevenir de ninguna manera.",
          "respuesta": false,
          "explicacion": "No existe prevención absoluta, pero sí factores protectores como hábitos saludables."
        },
        {
          "id": 8,
          "frase": "No hay nada que la familia pueda hacer frente a un diagnóstico de Alzheimer.",
          "respuesta": false,
          "explicacion": "La familia y el entorno cumplen un rol clave en la calidad de vida."
        },
        {
          "id": 9,
          "frase": "El Alzheimer solo se diagnostica cuando la persona ya perdió toda autonomía.",
          "respuesta": false,
          "explicacion": "Puede diagnosticarse en etapas iniciales y planificar cuidados."
        },
        {
          "id": 10,
          "frase": "Las personas con demencia siempre se olvidan de todo de un día para el otro.",
          "respuesta": false,
          "explicacion": "El Alzheimer es progresivo; no implica un olvido repentino absoluto."
        },
        {
          "id": 11,
          "frase": "Un diagnóstico temprano de Alzheimer permite planificar mejor los cuidados.",
          "respuesta": true,
          "explicacion": "Detectarlo a tiempo ayuda a preparar tratamientos y acompañamiento."
        },
        {
          "id": 12,
          "frase": "Las demencias afectan también a las familias y cuidadores.",
          "respuesta": true,
          "explicacion": "El impacto emocional y práctico alcanza a todo el entorno."
        },
        {
          "id": 13,
          "frase": "El Alzheimer no tiene cura, pero existen tratamientos que mejoran la calidad de vida.",
          "respuesta": true,
          "explicacion": "Los tratamientos pueden aliviar síntomas y mejorar la autonomía."
        },
        {
          "id": 14,
          "frase": "Todas las personas con Alzheimer terminan igual.",
          "respuesta": false,
          "explicacion": "La evolución y los síntomas son diferentes en cada persona."
        },
        {
          "id": 15,
          "frase": "La estimulación cognitiva y social puede ayudar a enlentecer el avance de la demencia.",
          "respuesta": true,
          "explicacion": "La actividad mental y social es un factor protector."
        },
        {
          "id": 16,
          "frase": "Las personas con demencia no entienden nada de lo que pasa a su alrededor.",
          "respuesta": false,
          "explicacion": "Conservan capacidades emocionales y de conexión significativa."
        },
        {
          "id": 17,
          "frase": "El Alzheimer solo afecta a la memoria, no a la conducta o emociones.",
          "respuesta": false,
          "explicacion": "También cambia la conducta, el ánimo y las emociones."
        },
        {
          "id": 18,
          "frase": "Hablar abiertamente de la demencia ayuda a reducir prejuicios y estigmas.",
          "respuesta": true,
          "explicacion": "Visibilizar el tema genera comprensión y menos discriminación."
        },
        {
          "id": 19,
          "frase": "Solo los médicos neurólogos pueden detectar señales tempranas de demencia.",
          "respuesta": false,
          "explicacion": "Otros profesionales de salud como geriatras, psiquiatras y psicólogos también pueden detectar signos iniciales."
        },
        {
          "id": 20,
          "frase": "Mantener una vida social activa puede proteger la salud cerebral.",
          "respuesta": true,
          "explicacion": "La interacción social es un factor protector reconocido."
        },
      ];
    }
  }

  function startTimer() {
    timeLeft = 60;
    timeLeftEl.textContent = String(timeLeft);
    timerId = setInterval(() => {
      timeLeft -= 1;
      timeLeftEl.textContent = String(timeLeft);
      if (timeLeft <= 0) {
        clearInterval(timerId);
        endGame();
      }
    }, 1000);
  }

  function renderQuestion() {
    if (currentIndex >= questions.length) {
      // no más preguntas, finalizar si aún hay tiempo
      endGame();
      return;
    }
    const q = questions[currentIndex];
    questionEl.textContent = q.frase;
    feedbackEl.textContent = '';
    feedbackEl.className = 'feedback';
    btnTrue.disabled = false;
    btnFalse.disabled = false;
  }

  function onAnswer(userAnswer) {
    if (currentIndex >= questions.length) return;
    const q = questions[currentIndex];
    const isCorrect = (userAnswer === q.respuesta);

    // marcar feedback breve
    feedbackEl.textContent = isCorrect ? '¡Correcto!' : 'Incorrecto';
    feedbackEl.classList.toggle('ok', isCorrect);
    feedbackEl.classList.toggle('err', !isCorrect);

    if (!isCorrect) {
      wrongIds.add(q.id);
      wrongById.set(q.id, q);
    } else {
      correct += 1;
      correctEl.textContent = String(correct);
    }
    answered += 1;
    answeredEl.textContent = String(answered);

    // deshabilitar para evitar doble click
    btnTrue.disabled = true;
    btnFalse.disabled = true;

    // siguiente
    currentIndex += 1;
    setTimeout(() => renderQuestion(), 350);
  }

  function buildWrongList() {
    const ids = Array.from(wrongIds.values());
    if (ids.length === 0) {
      wrongList.innerHTML = '<div class="wrong-item"><div class="phrase">¡No hubo errores!</div></div>';
      return;
    }
    // ordenar por id asc
    ids.sort((a, b) => a - b);
    wrongList.innerHTML = ids.map(id => {
      const item = wrongById.get(id);
      if (!item) return '';
      return `
        <div class="wrong-item">
          <div class="phrase">${item.frase} (${item.respuesta ? "Verdadero" : "Falso"})</div>
          <div class="explanation">${item.explicacion}</div>
        </div>
      `;
    }).join('');
  }

  function endGame() {
    // detener timer si sigue corriendo
    if (timerId) { clearInterval(timerId); timerId = null; }
    // deshabilitar
    btnTrue.disabled = true;
    btnFalse.disabled = true;
    // armar modal
    resultStats.textContent = `Correctas: ${correct} · Respondidas: ${answered}`;
    buildWrongList();
    resultsModal.classList.add('show');
  }

  function resetGame() {
    if (timerId) { clearInterval(timerId); timerId = null; }
    questions = shuffle([...questions]); // mantener mismas preguntas, reordenadas
    currentIndex = 0;
    correct = 0; answered = 0;
    wrongIds.clear(); wrongById.clear();
    correctEl.textContent = '0';
    answeredEl.textContent = '0';
    resultsModal.classList.remove('show');
    startTimer();
    renderQuestion();
  }

  async function init() {
    const data = await loadQuestions();
    questions = shuffle(data);
    currentIndex = 0;
    correct = 0; answered = 0;
    wrongIds.clear(); wrongById.clear();
    correctEl.textContent = '0';
    answeredEl.textContent = '0';
    startTimer();
    renderQuestion();
  }

  // Eventos
  btnTrue.addEventListener('click', () => onAnswer(true));
  btnFalse.addEventListener('click', () => onAnswer(false));
  resetBtn.addEventListener('click', () => resetGame());
  playAgainBtn.addEventListener('click', () => resetGame());

  // Init
  document.addEventListener('DOMContentLoaded', init, { once: true });
})();


