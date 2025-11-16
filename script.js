// ==============================================
// Genera tamaño de casilla iniciales del bingo
// ==============================================
function getInitialLengthBingo() {
	let initial_length = prompt("¿Cuántos números tendrá el bingo? (75 o 90)");
	if (initial_length != 75 && initial_length != 90) {
		alert("Número inválido. Se usará 75 por defecto.");
		initial_length = 75;
	}
	return initial_length;
}

// ==============================================
// Genera la matriz de bingo
// ==============================================
function createBingoMatrix(numbers_square) {
	const body = document.getElementById("bingoBody");
	const plays_title = document.getElementById("plays");
	plays_title.textContent = `JUGADAS: 0/${numbers_square}`;
	body.innerHTML = "";
	// si la cantidad de cuadros es 75 (15 filas)
	if (numbers_square == 75) {
		row_count = 15;
	}
	// si la cantidad de cuadros es 90 (18 filas)
	if (numbers_square == 90) {
		row_count = 18;
	}
	for (let row = 0; row < row_count; row++) {
		const tr = document.createElement("tr");
		for (let col = 0; col < 5; col++) {
			// 5 columnas
			const td = document.createElement("td");
			let num = col * row_count + row + 1;
			if (num <= numbers_square) {
				// rellena hasta 75 o 90
				td.textContent = num;
				td.id = "cell-" + num;
			} else {
				td.textContent = "";
			}
			tr.appendChild(td);
		}
		body.appendChild(tr);
	}
}

// ==============================================
// Guardar estado del bingo
// ==============================================
function saveState() {
	localStorage.setItem(
		"bingoState",
		JSON.stringify({
			plays,
			numbers,
			drawn,
		})
	);
}

// ==============================================
// Cargar estado del bingo
// ==============================================
function loadState() {
	let state = localStorage.getItem("bingoState");
	if (state) {
		state = JSON.parse(state);
		plays = state.plays;
		numbers = state.numbers;
		drawn = state.drawn;
		// restaura el texto de jugadas
		document.getElementById(
			"plays"
		).textContent = `JUGADAS: ${plays}/${numbers_square}`;
		if (drawn.length > 0) {
			const last = drawn[drawn.length - 1];
			document.getElementById("number").textContent = last;
			document.getElementById("letter").textContent = getLetter(last);
		}
		drawn.forEach((num) => {
			// restaura las celdas marcadas
			let cell = document.getElementById("cell-" + num);
			if (cell) cell.classList.add("marked");
		});
	}
}

// ==============================================
// Obtener letra según el número
// ==============================================
function getLetter(num) {
	if (numbers_square == 75) {
		if (num >= 1 && num <= 15) return "B";
		if (num >= 16 && num <= 30) return "I";
		if (num >= 31 && num <= 45) return "N";
		if (num >= 46 && num <= 60) return "G";
		if (num >= 61 && num <= 75) return "O";
	} 
	if (numbers_square == 90) {
		if (num >= 1 && num <= 18) return "B";
		if (num >= 19 && num <= 36) return "I";
		if (num >= 37 && num <= 54) return "N";
		if (num >= 55 && num <= 72) return "G";
		if (num >= 73 && num <= 90) return "O";
	}
	return "?";
}

// ==============================================
// Funcion jugar bingo
// ==============================================
function playBingo() {
	if (drawn.length >= numbers_square) {
		// si ya no hay más números disponibles
		alert("¡Se han sacado todos los números!, por favor reinicia el juego.");
		// deshabilitar el botón Play
		document.getElementById("playBtn").disabled = true;
		return;
	}
	// selecciona un número aleatorio de los disponibles
	let idx = Math.floor(Math.random() * numbers.length);
	// extrae el número aleatorio del array
	let num = numbers.splice(idx, 1)[0];
	drawn.push(num);
	plays++;
	// actualizar UI
	document.getElementById(
		"plays"
	).textContent = `JUGADAS: ${plays}/${numbers_square}`;
	document.getElementById("number").textContent = num;
	// define letra según número
	const letter = getLetter(num);
	document.getElementById("letter").textContent = letter;
	// marca el número en la matriz
	let cell = document.getElementById("cell-" + num);
	if (cell) cell.classList.add("marked");
	// guarda el estado después de cada jugada
	saveState();
	// voz en español
	const msg = new SpeechSynthesisUtterance(`${letter} ${num}`);
	msg.lang = "es-ES";
	window.speechSynthesis.speak(msg);
}

// ==============================================
// Funcion resetear bingo
// ==============================================
function resetBingo() {
	// if (plays > 0 || drawn.length > 0) {
	const confirmReset = confirm(
		"¡Atención! Si comienzas un nuevo juego, perderás el progreso actual. ¿Quieres continuar?"
	);
	// Si el usuario cancela, no se resetea
	if (!confirmReset) return;
	numbers_square = getInitialLengthBingo();
	createBingoMatrix(numbers_square);
	numbers = Array.from({ length: numbers_square }, (_, i) => i + 1);
	plays = 0;
	drawn = [];
	document.getElementById("plays").textContent = `JUGADAS: 0/${numbers_square}`;
	document.getElementById("number").textContent = "?";
	document.getElementById("letter").textContent = "?";
	// limpiar todos los números de la matriz
	for (let i = 1; i <= numbers_square; i++) {
		let cell = document.getElementById("cell-" + i);
		if (cell) cell.classList.remove("marked");
	}
	// habilitar nuevamente el botón play
	document.getElementById("playBtn").disabled = false;
	// borrar lo guardado en el localStorage
	localStorage.removeItem("bingoState");
}

// ==============================================
// Inicialización del bingo
// ==============================================
let numbers_square = getInitialLengthBingo();
let numbers = Array.from({ length: numbers_square }, (_, i) => i + 1);
let plays = 0;
let drawn = [];
createBingoMatrix(numbers_square);
loadState();