(() => {
    const riddleText  = document.getElementById('riddle-text');
    const answersEl   = document.getElementById('answers');
    const feedbackEl  = document.getElementById('feedback');
    const roundLabel  = document.getElementById('round-label');
    const scoreLabel  = document.getElementById('score-label');
    const nextBtn     = document.getElementById('next-btn');
    const resetBtn    = document.getElementById('reset-btn');
  
    // Pool de adivinanzas
    const RIDDLES = [
      { question: "Tiene hojas pero no es un árbol. ¿Qué es?", options: ["El libro","La ventana","El reloj","La mesa"], answer: "El libro" },
      { question: "Va por el agua y no se moja. ¿Qué es?", options: ["La sombra","El pez","El barco","La nube"], answer: "La sombra" },
      { question: "Tiene dientes y no muerde. ¿Qué es?", options: ["El peine","La llave","La botella","La silla"], answer: "El peine" },
      { question: "Vuelo sin alas y lloro sin ojos. ¿Qué soy?", options: ["La nube","El viento","La lluvia","El eco"], answer: "La nube" },
      { question: "Siempre está delante de ti, pero nunca lo verás. ¿Qué es?", options: ["El futuro","El espejo","La sombra","El camino"], answer: "El futuro" },
      { question: "Me rompo sin tocarme. ¿Qué soy?", options: ["El silencio","El hielo","La caja","El cristal"], answer: "El silencio" },
      { question: "Pasa por ciudades y montañas pero siempre está en un rincón. ¿Qué es?", options: ["El mapa","El río","La carretera","La brújula"], answer: "El mapa" },
      { question: "Sube y baja pero no se mueve. ¿Qué es?", options: ["Las escaleras","El sol","La temperatura","El ascensor"], answer: "Las escaleras" },
      { question: "Tiene un ojo y no puede ver. ¿Qué es?", options: ["La aguja","El huracán","La cerradura","La papa"], answer: "La aguja" },
      { question: "Corre sin tener pies. ¿Qué es?", options: ["El agua","El viento","El tiempo","La nube"], answer: "El agua" },
      { question: "Es tuyo pero otros lo usan más que tú. ¿Qué es?", options: ["Tu nombre","Tu casa","Tu coche","Tu reloj"], answer: "Tu nombre" },
      { question: "Más ligero que una pluma, pero el más fuerte no lo puede sostener mucho tiempo. ¿Qué es?", options: ["El aliento","La nieve","La luz","El papel"], answer: "El aliento" }
    ];
  
    // Estado
    let riddles = [];
    let current = 0;
    let score = 0;
    let answered = false;
  
    // Utils
    const shuffle = (arr) => arr.sort(() => Math.random() - 0.5);
  
    function renderRiddle() {
      const data = riddles[current];
      riddleText.textContent = data.question;
      roundLabel.textContent = String(current + 1);
      feedbackEl.textContent = "";
      feedbackEl.className = "feedback";
      nextBtn.disabled = true;
      nextBtn.textContent = (current === riddles.length - 1) ? "Siguiente" : "Siguiente";
      answered = false;
  
      // Opciones
      const opts = shuffle([...data.options]);
      answersEl.innerHTML = "";
      opts.forEach(opt => {
        const btn = document.createElement("button");
        btn.className = "answer-btn";
        btn.textContent = opt;
        btn.setAttribute("aria-label", `Opción ${opt}`);
        btn.addEventListener("click", () => onAnswer(btn, opt, data.answer));
        answersEl.appendChild(btn);
      });
    }
  
    function onAnswer(button, chosen, correct) {
      if (answered) return; // evitar múltiples respuestas
  
      if (chosen === correct) {
        button.classList.add("correct");
        feedbackEl.textContent = "¡Correcto!";
        feedbackEl.classList.add("ok");
        score += 1;
        scoreLabel.textContent = String(score);
        disableOtherOptions(button);
        nextBtn.disabled = false;
        answered = true;
  
        // Si es la última, cambiar CTA opcionalmente
        if (current === riddles.length - 1) {
          nextBtn.textContent = "Nuevo juego";
        }
      } else {
        button.classList.add("incorrect");
        feedbackEl.textContent = "Incorrecto, intenta de nuevo";
        feedbackEl.classList.add("err");
        // sacamos la marca roja tras un momento para permitir reintento
        setTimeout(() => button.classList.remove("incorrect"), 350);
      }
    }
  
    function disableOtherOptions(exceptBtn) {
      const all = [...answersEl.querySelectorAll(".answer-btn")];
      all.forEach(b => {
        if (b !== exceptBtn) b.disabled = true;
      });
    }
  
    function next() {
      // Si era la última y el botón dice "Nuevo juego", reiniciar
      if (current === riddles.length - 1 && answered) {
        reset();
        return;
      }
  
      if (!answered) return; // no avanzar sin responder
  
      current += 1;
      if (current >= riddles.length) {
        // Fin (fallback por seguridad)
        feedbackEl.textContent = `¡Bien hecho! Puntaje final: ${score}/${riddles.length}`;
        feedbackEl.classList.add("ok");
        nextBtn.disabled = true;
        return;
      }
      renderRiddle();
    }
  
    function reset() {
      riddles = shuffle([...RIDDLES]);
      current = 0;
      score = 0;
      scoreLabel.textContent = "0";
      renderRiddle();
    }
  
    // Eventos
    nextBtn.addEventListener("click", next);
    resetBtn.addEventListener("click", reset);
  
    // Inicio
    reset();
  })();
  