(() => {
    const questionEl = document.getElementById("question");
    const answersEl  = document.getElementById("answers");
    const feedbackEl = document.getElementById("feedback");
    const scoreEl    = document.getElementById("score");
    const counterEl  = document.getElementById("problem-counter");
    const nextBtn    = document.getElementById("next-btn");
    const resetBtn   = document.getElementById("reset-btn");
  
    let score = 0;
    let problem = 0;
    let currentAnswer = null;
    let locked = false;
  
    function rand(min, max){
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }
  
    function newProblem(){
      problem += 1;
      feedbackEl.textContent = "";
      feedbackEl.className = "feedback";
      locked = false;
  
      // números pequeños 1–20 y +/-
      let a = rand(1, 20);
      let b = rand(1, 20);
      const op = Math.random() < 0.5 ? "+" : "-";
  
      // evitar resultados negativos en restas
      if (op === "-" && b > a) [a, b] = [b, a];
  
      currentAnswer = op === "+" ? a + b : a - b;
  
      questionEl.textContent = `${a} ${op} ${b} = ?`;
      counterEl.textContent = `Problema: ${problem}`;
  
      // crear 3 opciones (1 correcta + 2 distractores)
      const opts = new Set([currentAnswer]);
      while (opts.size < 3){
        const noise = rand(-4, 4) || 1;
        opts.add(currentAnswer + noise);
      }
      const options = Array.from(opts);
      options.sort(() => Math.random() - 0.5);
  
      // render botones
      answersEl.innerHTML = "";
      options.forEach(val => {
        const btn = document.createElement("button");
        btn.className = "btn answer-btn";
        btn.textContent = String(val);
        btn.setAttribute("aria-label", `Respuesta ${val}`);
        btn.addEventListener("click", () => handleAnswer(btn, val));
        answersEl.appendChild(btn);
      });
    }
  
    function handleAnswer(button, value){
      if (locked) return;
      locked = true;
  
      const buttons = [...answersEl.querySelectorAll(".answer-btn")];
      buttons.forEach(b => b.disabled = true);
  
      if (value === currentAnswer){
        score += 1;
        scoreEl.textContent = `Puntaje: ${score}`;
        button.classList.add("correct");
        feedbackEl.textContent = "¡Correcto!";
        feedbackEl.classList.add("ok");
      } else {
        button.classList.add("incorrect");
        // marcar la correcta
        const correctBtn = buttons.find(b => Number(b.textContent) === currentAnswer);
        if (correctBtn) correctBtn.classList.add("correct");
        feedbackEl.textContent = "Incorrecto";
        feedbackEl.classList.add("err");
      }
    }
  
    function resetGame(){
      score = 0;
      problem = 0;
      scoreEl.textContent = "Puntaje: 0";
      newProblem();
    }
  
    nextBtn.addEventListener("click", () => newProblem());
    resetBtn.addEventListener("click", () => resetGame());
  
    // iniciar
    resetGame();
  })();
  