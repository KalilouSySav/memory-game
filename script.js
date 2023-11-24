import apiKey from './secrets.js';

let theme = prompt('Pick a theme. Example : Nature, Animals, Landscape, Space, Architecture');
let keyword = theme;
let levels = {
    'easy': [],
    'normal': [],
    'hard': []
};
let score = 100;
let level = 'easy';
let cards = [];

async function fetchImages() {
    let response = await fetch(`https://api.unsplash.com/search/photos?query=${keyword}&count=15&client_id=${apiKey}`);
    let data = await response.json();
    let imageURLs = data.results.map(image => image.urls.regular);
    levels = {
        'easy': [...imageURLs.slice(0, 5), ...imageURLs.slice(0, 5)],
        'normal': [...imageURLs.slice(0, 10), ...imageURLs.slice(0, 10)],
        'hard': [...imageURLs, ...imageURLs, ...imageURLs]
    };
    cards = levels[level];
    createBoard();
}



function shuffle(array) {
    array.sort(() => Math.random() - 0.5);
}

function createBoard() {
    let board = document.getElementById('game-board');
    shuffle(cards);
    for (let i = 0; i < cards.length; i++) {
        let card = document.createElement('div');
        card.classList.add('card');
        card.dataset.value = cards[i];
        let img = document.createElement('img');
        img.src = cards[i];
        img.style.display = 'none';
        img.style.width = '100%';  // Set the width
        img.style.height = '100%';  // Set the height
        img.style.objectFit = 'cover';  // Set the object-fit
        card.appendChild(img);
        card.addEventListener('click', flipCard);
        board.appendChild(card);
    }
}

function flipCard() {
    // Flip card and check for match
    let flippedCards = document.querySelectorAll('.flipped');
    if (flippedCards.length === 2) {
        return;
    }
    this.classList.add('flipped');
    this.children[0].style.display = 'block';
    flippedCards = document.querySelectorAll('.flipped');
    if (flippedCards.length === 2) {
        checkMatch();
    }
}

function checkMatch() {
    let flippedCards = document.querySelectorAll('.flipped');
    if (flippedCards[0].dataset.value === flippedCards[1].dataset.value) {
        // Match
        flippedCards.forEach(card => {
            card.classList.remove('flipped');
            card.classList.add('matched');
        });
        if (document.querySelectorAll('.matched').length === cards.length) {
            // Level up
            if (level === 'easy') {
                level = 'normal';
                document.getElementById('level').textContent = `Level: 2`;
                alert('Congratulations, you leveled up!');
            } else if (level === 'normal') {
                level = 'hard';
                document.getElementById('level').textContent = `Level: 3`;
                alert('Congratulations, you leveled up!');
            } else {
                // Game over: player won
                alert('Congratulations, you won the game!');
                return;
            }
            cards = levels[level];
            restartGame();
        }
    } else {
        // No match
        setTimeout(() => {
            flippedCards.forEach(card => {
                card.classList.remove('flipped');
                card.children[0].style.display = 'none';
            });
            score -= 10;  // Decrease score
            document.getElementById('score').textContent = `Score: ${score}`;  // Update score display
            if (score <= 0) {
                // Game over: player lost
                alert('Game over, you lost. Better luck next time!');
                restartGame();
            }
        }, 1000);
    }
}

function restartGame() {
    let themeChange = confirm('Do you wish to change theme?');
    score = 100;
    document.getElementById('score').textContent = `Score: ${score}`;
    let board = document.getElementById('game-board');
    board.textContent = '';
    shuffle(cards);
    if (themeChange) {
        theme = prompt('Pick a theme. Example : Nature, Animals, Landscape, Space, Architecture');
        keyword = theme;
        fetchImages();
    }
    else { 
    createBoard();
    }
}

document.getElementById('restart').addEventListener('click', restartGame);
fetchImages();
