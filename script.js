// script.js

// Global variables
let deck = [];
let playerHand = [];
let dealerHand = [];
let playerChips = 100;
let bet = 0;
let gameOver = false;

// Constants for card values
const values = {
    "Two": 2, "Three": 3, "Four": 4, "Five": 5, "Six": 6,
    "Seven": 7, "Eight": 8, "Nine": 9, "Ten": 10, "Jack": 10,
    "Queen": 10, "King": 10, "Ace": 11
};

// Initialize deck
function initializeDeck() {
    const suits = ["Hearts", "Diamonds", "Spades", "Clubs"];
    const ranks = ["Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten", "Jack", "Queen", "King", "Ace"];
    deck = [];
    for (const suit of suits) {
        for (const rank of ranks) {
            deck.push({ suit, rank });
        }
    }
    deck = shuffle(deck);
}

// Shuffle deck
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Deal a card
function dealCard() {
    return deck.pop();
}

// Calculate hand value
function calculateHandValue(hand) {
    let value = 0;
    let aceCount = 0;
    for (const card of hand) {
        value += values[card.rank];
        if (card.rank === "Ace") {
            aceCount++;
        }
    }
    while (value > 21 && aceCount > 0) {
        value -= 10;
        aceCount--;
    }
    return value;
}

// Update display
function updateDisplay() {
    document.getElementById('player-cards').innerHTML = playerHand.map(card => `${card.rank} of ${card.suit}`).join('<br>');
    document.getElementById('player-total').textContent = `Total: ${calculateHandValue(playerHand)}`;

    if (gameOver) {
        document.getElementById('dealer-cards').innerHTML = dealerHand.map(card => `${card.rank} of ${card.suit}`).join('<br>');
        document.getElementById('dealer-total').textContent = `Total: ${calculateHandValue(dealerHand)}`;
        document.getElementById('dealer-hidden-card').style.display = 'none'; // Hide the hidden card
    } else {
        document.getElementById('dealer-cards').innerHTML = '<div id="dealer-hidden-card"> <em>Card hidden</em> </div>' + `${dealerHand[1].rank} of ${dealerHand[1].suit}`;
        document.getElementById('dealer-total').textContent = `Total: ?`;
    }

    document.getElementById('chips-total').textContent = `Total Chips: ${playerChips}`;
}

// Handle player actions
document.getElementById('hit-button').addEventListener('click', () => {
    if (gameOver) return;
    playerHand.push(dealCard());
    if (calculateHandValue(playerHand) > 21) {
        gameOver = true;
        document.getElementById('game-status').textContent = "Player busts! You lose.";
        playerChips -= bet;
        document.getElementById('new-round-button').style.display = 'inline';
    }
    updateDisplay();
});

document.getElementById('stand-button').addEventListener('click', () => {
    if (gameOver) return;
    gameOver = true;
    while (calculateHandValue(dealerHand) < 17) {
        dealerHand.push(dealCard());
    }
    const playerTotal = calculateHandValue(playerHand);
    const dealerTotal = calculateHandValue(dealerHand);
    if (dealerTotal > 21) {
        document.getElementById('game-status').textContent = "Dealer busts! You win!";
        playerChips += bet;
    } else if (playerTotal > dealerTotal) {
        document.getElementById('game-status').textContent = "You win!";
        playerChips += bet;
    } else if (playerTotal < dealerTotal) {
        document.getElementById('game-status').textContent = "Dealer wins!";
        playerChips -= bet;
    } else {
        document.getElementById('game-status').textContent = "It's a tie!";
    }
    document.getElementById('new-round-button').style.display = 'inline';
    updateDisplay();
});

document.getElementById('place-bet').addEventListener('click', () => {
    bet = parseInt(document.getElementById('bet').value);
    if (isNaN(bet) || bet <= 0 || bet > playerChips) {
        alert("Invalid bet amount.");
        return;
    }
    document.getElementById('bet-info').style.display = 'none';
    document.getElementById('hit-button').style.display = 'inline';
    document.getElementById('stand-button').style.display = 'inline';
    startGame();
});

document.getElementById('play-again-button').addEventListener('click', () => {
    if (gameOver) {
        gameOver = false;
        document.getElementById('game-status').textContent = '';
        document.getElementById('hit-button').style.display = 'none';
        document.getElementById('stand-button').style.display = 'none';
        document.getElementById('bet-info').style.display = 'block';
        document.getElementById('new-round-button').style.display = 'none';
        playerHand = [];
        dealerHand = [];
    }
});

document.getElementById('new-round-button').addEventListener('click', () => {
    if (gameOver) {
        gameOver = false;
        document.getElementById('game-status').textContent = '';
        document.getElementById('hit-button').style.display = 'none';
        document.getElementById('stand-button').style.display = 'none';
        document.getElementById('bet-info').style.display = 'block';
        document.getElementById('new-round-button').style.display = 'none';
        playerHand = [];
        dealerHand = [];
    }
});

function startGame() {
    initializeDeck();
    playerHand.push(dealCard(), dealCard());
    dealerHand.push(dealCard(), dealCard());
    updateDisplay();
}
