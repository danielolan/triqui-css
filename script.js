// Variables y selección de elementos
const player1Label = document.getElementById('player1');
const player2Label = document.getElementById('player2');
const startButton = document.getElementById('start');
const resetButton = document.getElementById('reset');
const board = document.querySelector('.board');

// Inicialización y eventos
startButton.addEventListener('click', startGame);
resetButton.addEventListener('click', resetGame);
let currentPlayer = 'X'; // El jugador actual, puede ser 'X' o 'O'
let gameBoard = [
    ['', '', ''],
    ['', '', ''],
    ['', '', '']
];


document.getElementById('name1').value = localStorage.getItem('name1')
document.getElementById('name2').value = localStorage.getItem('name2')



if (localStorage.getItem('gameBoard')) {
    gameBoard = JSON.parse(localStorage.getItem('gameBoard'));
    const cells = document.querySelectorAll('.cell');
    cells.forEach(cell => {
        const row = parseInt(cell.getAttribute('data-row'));
        const col = parseInt(cell.getAttribute('data-col'));
        cell.innerHTML = gameBoard[row][col];
    });
    assignCellEvents();
}


function startGame() {
    assignCellEvents()
    // Verificar que ambos jugadores hayan ingresado sus nombres
    if (!document.getElementById('name1').value || !document.getElementById('name2').value) {
        alert('Ambos jugadores deben ingresar sus nombres para iniciar el juego.');
        return;
    }else {
        localStorage.setItem('name1',document.getElementById('name1').value )
        localStorage.setItem('name2',document.getElementById('name2').value )   
    }

    // Inicializar el tablero y asignar eventos
    const cells = document.querySelectorAll('.cell');
    cells.forEach(cell => {
        cell.addEventListener('keydown', handleCellKeydown);
        cell.innerHTML = ''; // Limpiar el contenido de la celda
        cell.tabIndex = 0; // Hacer que la celda sea enfocable
    });

    // Establecer el jugador inicial
    currentPlayer = 'X';
    updateCurrentPlayerDisplay();

       // Seleccionar la celda 0,0 y aplicarle el estilo de celda seleccionada
       const initialCell = document.querySelector('.cell[data-row="0"][data-col="0"]');
       initialCell.classList.add('selected');
       initialCell.focus(); // Esto hará que la celda esté enfocada, permitiendo que el usuario comience a jugar directamente desde esta celda
   
       // Establecer el jugador inicial
       currentPlayer = 'X';
       updateCurrentPlayerDisplay();
}

function assignCellEvents() {
    const cells = document.querySelectorAll('.cell');
    cells.forEach(cell => {
        cell.addEventListener('keydown', handleCellKeydown);
        cell.tabIndex = 0; // Hacer que la celda sea enfocable
    });
}



function resetGame() {
    // Limpiar el tablero lógico
    gameBoard = [
        ['', '', ''],
        ['', '', ''],
        ['', '', '']
    ];
    localStorage.removeItem('gameBoard'); 
    // Limpiar el tablero visual y remover eventos
    const cells = document.querySelectorAll('.cell');
    cells.forEach(cell => {
        cell.removeEventListener('keydown', handleCellKeydown);
        cell.innerHTML = '';
        cell.style.backgroundColor = ''; // Remover el estilo de celda seleccionada
    });

    // Reiniciar el jugador actual
    currentPlayer = 'X';
    updateCurrentPlayerDisplay();
}
function handleCellKeydown(event) {
    const cell = event.target;
    const row = parseInt(cell.getAttribute('data-row'));
    const col = parseInt(cell.getAttribute('data-col'));

    // Si se presiona la barra espaciadora, intentar hacer una jugada
    if (event.key === ' ') {
        if (gameBoard[row][col] === '') {
            gameBoard[row][col] = currentPlayer;
            cell.innerHTML = currentPlayer;
            localStorage.setItem('gameBoard', JSON.stringify(gameBoard));
            checkForWinner();
            toggleCurrentPlayer();
        }
    }
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.key)) {
        event.preventDefault(); // Evitar el comportamiento predeterminado
        let newRow = row;
        let newCol = col;
        switch (event.key) {
            case 'ArrowUp':
                newRow = row > 0 ? row - 1 : 2;
                break;
            case 'ArrowDown':
                newRow = row < 2 ? row + 1 : 0;
                break;
            case 'ArrowLeft':
                newCol = col > 0 ? col - 1 : 2;
                break;
            case 'ArrowRight':
                newCol = col < 2 ? col + 1 : 0;
                break;
        }
        const newCell = document.querySelector(`.cell[data-row="${newRow}"][data-col="${newCol}"]`);
        newCell.focus();
    }
    
    // ... (resto del código anterior)

    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.key)) {
        // ... (resto del código anterior)

        cell.classList.remove('selected'); // Quitar el estilo de la celda anterior
        newCell.classList.add('selected'); // Aplicar el estilo a la nueva celda
        newCell.focus();
    }
    
}
function updateCurrentPlayerDisplay() {
    if (currentPlayer === 'X') {
        player1Label.style.backgroundColor = 'lightblue';
        player2Label.style.backgroundColor = '';
    } else {
        player2Label.style.backgroundColor = 'lightblue';
        player1Label.style.backgroundColor = '';
    }
}

function toggleCurrentPlayer() {
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    updateCurrentPlayerDisplay();
}

function updateCurrentPlayerDisplay() {
    if (currentPlayer === 'X') {
        player1Label.style.backgroundColor = 'lightblue';
        player2Label.style.backgroundColor = '';
    } else {
        player2Label.style.backgroundColor = 'lightblue';
        player1Label.style.backgroundColor = '';
    }
    
}
function checkForWinner() {
    const winningCombinations = [
        [[0, 0], [0, 1], [0, 2]],
        [[1, 0], [1, 1], [1, 2]],
        [[2, 0], [2, 1], [2, 2]],
        [[0, 0], [1, 0], [2, 0]],
        [[0, 1], [1, 1], [2, 1]],
        [[0, 2], [1, 2], [2, 2]],
        [[0, 0], [1, 1], [2, 2]],
        [[0, 2], [1, 1], [2, 0]]
    ];
    
    for (let combination of winningCombinations) {
        const [a, b, c] = combination;
        if (gameBoard[a[0]][a[1]] && gameBoard[a[0]][a[1]] === gameBoard[b[0]][b[1]] && gameBoard[a[0]][a[1]] === gameBoard[c[0]][c[1]]) {
            // Hay un ganador
            alert(`El jugador ${currentPlayer} ha ganado!`);
            // Aquí puedes agregar la lógica para cambiar los estilos de los labels de los jugadores
            return;
        }
    }
    
    // Verificar empate
    if (gameBoard.flat().every(cell => cell)) {
        alert('Empate!');
        // Aquí puedes agregar la lógica para cambiar los estilos de los labels de los jugadores en caso de empate
    }
    
}




