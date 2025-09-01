(() => {
    // DOM
    const okLabel = document.getElementById('ok-label');
    const leftLabel = document.getElementById('left-label');
    /* const setTitle = document.getElementById('set-title'); */
    const poolEl = document.getElementById('pool');
    const feedback = document.getElementById('feedback');

    // Contenedor para los botones de sets (segmented control)
    const segmentedContainer = document.querySelector('.segmented');
    // Botones de categoría y reset
    const btnA = document.getElementById('btn-cat-a');
    const btnB = document.getElementById('btn-cat-b');
    const resetBtn = document.getElementById('reset-btn');

    // Datos: agregamos más sets
    const SETS = [
        {
            title: "Emociones vs Objetos",
            A: { name: "Emociones", button_title: "Emoción", words: ["ALEGRIA", "AMOR", "PAZ", "CALMA", "RISA"] },
            B: { name: "Objetos", button_title: "Objeto", words: ["MESA", "SILLA", "LIBRO", "LLAVE", "VASO"] }
        },
        {
            title: "Frutas vs Animales",
            A: { name: "Frutas", button_title: "Fruta", words: ["PERA", "UVA", "MANZANA", "KIWI", "CEREZA"] },
            B: { name: "Animales", button_title: "Animal", words: ["PERRO", "GATO", "AVE", "PEZ", "CABALLO"] }
        },
        {
            title: "Colores vs Números",
            A: { name: "Colores", button_title: "Color", words: ["ROJO", "AZUL", "VERDE", "AMARILLO", "NEGRO"] },
            B: { name: "Números", button_title: "Número", words: ["UNO", "DOS", "TRES", "CUATRO", "CINCO"] }
        },
        {
            title: "Profesiones vs Lugares",
            A: { name: "Profesiones", button_title: "Profesión", words: ["DOCTOR", "MAESTRO", "PANADERO", "JUEZ", "MUSICO"] },
            B: { name: "Lugares", button_title: "Lugar", words: ["IGLESIA", "ESCUELA", "HOSPITAL", "MERCADO", "PLAZA"] }
        },
        {
            title: "Medios de transporte vs Animales",
            A: { name: "Transportes", button_title: "Transporte", words: ["COCHE", "BICICLETA", "TREN", "AVION", "BARCO"] },
            B: { name: "Animales", button_title: "Animal", words: ["GATO", "PERRO", "CABALLO", "ELEFANTE", "LEON"] }
        },
        {
            title: "Instrumentos vs Comidas",
            A: { name: "Instrumentos", button_title: "Instrumento", words: ["GUITARRA", "PIANO", "VIOLIN", "TAMBOR", "FLAUTA"] },
            B: { name: "Comidas", button_title: "Comida", words: ["PAN", "QUESO", "ARROZ", "POLLO", "SOPA"] }
        },
        {
            title: "Países vs Ciudades",
            A: { name: "Países", button_title: "País", words: ["ARGENTINA", "CHILE", "URUGUAY", "BRASIL", "PERU"] },
            B: { name: "Ciudades", button_title: "Ciudad", words: ["ROSARIO", "LIMA", "MADRID", "PARIS", "ROMA"] }
        },
        {
            title: "Partes del cuerpo vs Objetos",
            A: { name: "Partes del cuerpo", button_title: "Parte", words: ["MANO", "PIE", "CABEZA", "OJO", "BOCA"] },
            B: { name: "Objetos", button_title: "Objeto", words: ["CUADERNO", "SILLA", "BOTELLA", "VASO", "LAPICERA"] }
        },
        {
            title: "Estaciones vs Días",
            A: { name: "Estaciones", button_title: "Estación", words: ["VERANO", "OTOÑO", "INVIERNO", "PRIMAVERA"] },
            B: { name: "Días", button_title: "Día", words: ["LUNES", "MARTES", "MIERCOLES", "JUEVES", "VIERNES"] }
        },
        {
            title: "Ropa vs Animales",
            A: { name: "Ropas", button_title: "Prenda", words: ["CAMISA", "PANTALON", "ZAPATO", "VESTIDO", "SOMBRERO"] },
            B: { name: "Animales", button_title: "Animal", words: ["OSO", "TIGRE", "ZORRO", "BURRO", "LOBO"] }
        },
        {
            title: "Bebidas vs Objetos",
            A: { name: "Bebidas", button_title: "Bebida", words: ["AGUA", "JUGO", "VINO", "LECHE", "CAFÉ"] },
            B: { name: "Objetos", button_title: "Objeto", words: ["MESA", "CUCHARA", "SILLA", "VENTANA", "PUERTA"] }
        },
        {
            title: "Flores vs Frutas",
            A: { name: "Flores", button_title: "Flor", words: ["ROSA", "MARGARITA", "LIRIO", "TULIPAN", "JAZMIN"] },
            B: { name: "Frutas", button_title: "Fruta", words: ["SANDIA", "MELON", "BANANA", "CEREZA", "FRUTILLA"] }
        },
        // Nuevos sets agregados
        {
            title: "Herramientas vs Deportes",
            A: { name: "Herramientas", button_title: "Herramienta", words: ["MARTILLO", "DESTORNILLADOR", "SIERRA", "ALICATE", "LLAVE"] },
            B: { name: "Deportes", button_title: "Deporte", words: ["FUTBOL", "BASQUET", "TENIS", "NATACION", "CICLISMO"] }
        },
        {
            title: "Vehículos vs Electrodomésticos",
            A: { name: "Vehículos", button_title: "Vehículo", words: ["AUTO", "CAMION", "MOTO", "BICICLETA", "BARCO"] },
            B: { name: "Electrodomésticos", button_title: "Electrodoméstico", words: ["HELADERA", "LAVARROPAS", "MICROONDAS", "LICUADORA", "PLANCHA"] }
        },
        {
            title: "Animales Marinos vs Insectos",
            A: { name: "Animales Marinos", button_title: "Marino", words: ["DELFIN", "BALLENA", "TIBURON", "PULPO", "CANGREJO"] },
            B: { name: "Insectos", button_title: "Insecto", words: ["ABEJA", "HORMIGA", "MOSCA", "ESCARABAJO", "GRILLO"] }
        },
        {
            title: "Verduras vs Postres",
            A: { name: "Verduras", button_title: "Verdura", words: ["LECHUGA", "TOMATE", "ZANAHORIA", "PAPA", "CEBOLLA"] },
            B: { name: "Postres", button_title: "Postre", words: ["HELADO", "TARTA", "FLAN", "BUDIN", "BROWNIE"] }
        }
    ];

    // Estado
    let currentSetIndex = 0;
    let items = []; // [{text, cat:'A'|'B', done:boolean}]
    let remaining = 0;
    let correct = 0;
    let selectedChip = null;

    // Para paginar los sets
    const SETS_PER_PAGE = 4;
    let currentSetPage = 0;

    // Utils
    const shuffle = arr => arr.sort(() => Math.random() - 0.5);
    const clearFeedback = () => { feedback.textContent = ""; feedback.className = "feedback"; };

    // Botón "Más categorías"
    let moreCategoriesBtn = null;
    function ensureMoreCategoriesBtn() {
        if (!moreCategoriesBtn) {
            // Insertar el botón en la zona de botones inferiores
            const bottomButtons = document.querySelector('.bottom-buttons');
            moreCategoriesBtn = document.createElement('button');
            moreCategoriesBtn.id = 'more-categories-btn';
            moreCategoriesBtn.className = 'reset-btn';
            moreCategoriesBtn.textContent = 'Más categorías';
            moreCategoriesBtn.style.marginLeft = '0px';
            moreCategoriesBtn.addEventListener('click', () => {
                nextSetPage();
            });
            bottomButtons.appendChild(moreCategoriesBtn);
        }
    }

    // Nueva función para subrayar las palabras de categoría en el título
    function underlineCategoriesInTitle(title) {
        // Busca el "vs" (puede haber espacios antes/después)
        const vsRegex = /\s*vs\s*/i;
        const parts = title.split(vsRegex);
        if (parts.length === 2) {
            // Subraya cada parte, deja "vs" sin subrayar
            return `<u>${parts[0].trim()}</u> vs <u>${parts[1].trim()}</u>`;
        } else {
            // Si no hay "vs", subraya todo
            return `<u>${title}</u>`;
        }
    }

    function renderSegmentedControl() {
        segmentedContainer.innerHTML = "";
        // Calcular el rango de sets a mostrar
        const start = currentSetPage * SETS_PER_PAGE;
        const end = Math.min(start + SETS_PER_PAGE, SETS.length);
        for (let idx = start; idx < end; idx++) {
            const set = SETS[idx];
            const btn = document.createElement('button');
            btn.className = 'segment' + (idx === currentSetIndex ? ' active' : '');
            btn.id = `set-${idx}`;
            btn.setAttribute('role', 'tab');
            btn.setAttribute('aria-selected', idx === currentSetIndex ? 'true' : 'false');
            // Usar innerHTML para subrayar las categorías
            btn.innerHTML = underlineCategoriesInTitle(set.title);
            btn.addEventListener('click', () => loadSet(idx));
            segmentedContainer.appendChild(btn);
        }
        // Mostrar u ocultar el botón "Más categorías"
        ensureMoreCategoriesBtn();
        if (SETS.length > SETS_PER_PAGE) {
            moreCategoriesBtn.style.display = 'inline-block';
        } else {
            moreCategoriesBtn.style.display = 'none';
        }
        // Si estamos en la última página, cambiar el texto a "Volver al inicio"
        const totalPages = Math.ceil(SETS.length / SETS_PER_PAGE);
        if (currentSetPage < totalPages - 1) {
            moreCategoriesBtn.textContent = 'Más categorías';
        } else {
            moreCategoriesBtn.textContent = 'Volver al inicio';
        }
    }

    function nextSetPage() {
        const totalPages = Math.ceil(SETS.length / SETS_PER_PAGE);
        currentSetPage = (currentSetPage + 1) % totalPages;
        // Si el set actual no está en la nueva página, seleccionar el primero de la nueva página
        const start = currentSetPage * SETS_PER_PAGE;
        const end = Math.min(start + SETS_PER_PAGE, SETS.length);
        if (currentSetIndex < start || currentSetIndex >= end) {
            loadSet(start);
        } else {
            renderSegmentedControl();
        }
    }

    function updateSegmentedActive(index) {
        // Actualiza la clase y aria-selected de los botones
        const segments = segmentedContainer.querySelectorAll('.segment');
        segments.forEach((btn, idx) => {
            // idx aquí es relativo a la página, así que calculamos el índice real
            const realIdx = currentSetPage * SETS_PER_PAGE + idx;
            btn.classList.toggle('active', realIdx === index);
            btn.setAttribute('aria-selected', realIdx === index ? 'true' : 'false');
        });
    }

    function loadSet(index) {
        currentSetIndex = index;
        // Cambiar de página si el set no está en la página actual
        const start = currentSetPage * SETS_PER_PAGE;
        const end = Math.min(start + SETS_PER_PAGE, SETS.length);
        if (index < start || index >= end) {
            currentSetPage = Math.floor(index / SETS_PER_PAGE);
            renderSegmentedControl();
        }
        const set = SETS[currentSetIndex];

        // actualizar UI del set
        // Subrayar las categorías en el título
        /* setTitle.innerHTML = underlineCategoriesInTitle(set.title); */
        btnA.textContent = `${set.A.button_title}`;
        btnB.textContent = `${set.B.button_title}`;

        // segmented active
        updateSegmentedActive(index);

        // construir items
        items = shuffle([
            ...set.A.words.map(w => ({ text: w, cat: 'A', done: false })),
            ...set.B.words.map(w => ({ text: w, cat: 'B', done: false }))
        ]);

        remaining = items.length;
        correct = 0;
        updateStats();
        clearFeedback();

        // render chips
        poolEl.innerHTML = "";
        selectedChip = null;

        items.forEach((it, idx) => {
            const chip = document.createElement('button');
            chip.className = 'chip';
            chip.textContent = it.text;
            chip.setAttribute('data-index', idx);
            chip.setAttribute('aria-label', `Palabra ${it.text}`);
            chip.addEventListener('click', () => onSelectChip(chip));
            poolEl.appendChild(chip);
        });

        // Asegurarse de que el control segmentado esté bien
        renderSegmentedControl();
    }

    function updateStats() {
        okLabel.textContent = String(correct);
        leftLabel.textContent = String(remaining);
    }

    function onSelectChip(chip) {
        if (chip.classList.contains('lock')) return; // ya clasificada

        // deseleccionar anterior
        const prev = poolEl.querySelector('.chip.selected');
        if (prev && prev !== chip) prev.classList.remove('selected');

        chip.classList.toggle('selected');
        selectedChip = chip.classList.contains('selected') ? chip : null;
        clearFeedback();
    }

    function classify(targetCat) {
        if (!selectedChip) return;

        const idx = Number(selectedChip.getAttribute('data-index'));
        const item = items[idx];
        if (!item || item.done) return;

        if (item.cat === targetCat) {
            // correcto -> pintar con color según botón
            selectedChip.classList.remove('selected');
            selectedChip.classList.add('lock', targetCat === 'A' ? 'catA' : 'catB');
            selectedChip.setAttribute('aria-label', `Palabra ${item.text} (clasificada en ${targetCat})`);
            item.done = true;

            correct += 1;
            remaining -= 1;
            updateStats();

            feedback.textContent = "¡Correcto!";
            feedback.classList.remove('err');
            feedback.classList.add('ok');

            selectedChip = null;

            if (remaining <= 0) {
                feedback.textContent = "¡Bien hecho!";
            }
        } else {
            // incorrecto -> no pintar ni cambiar estado
            feedback.textContent = "Incorrecto, intenta de nuevo";
            feedback.classList.remove('ok');
            feedback.classList.add('err');

            // breve flash rojo en el chip seleccionado
            selectedChip.classList.add('wrong');
            setTimeout(() => selectedChip.classList.remove('wrong'), 350);
        }
    }

    // Eventos
    btnA.addEventListener('click', () => classify('A'));
    btnB.addEventListener('click', () => classify('B'));
    resetBtn.addEventListener('click', () => loadSet(currentSetIndex));

    // Render segmented control y eventos
    renderSegmentedControl();

    // Init
    loadSet(0);
})();
