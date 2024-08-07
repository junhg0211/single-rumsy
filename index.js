let rumsy;
let rumsySpan;
let handsDiv;
let handsSpan;
let dealerHandsDiv;
let dealerHandsSpan;
let resultSpan;
let potInput;
let betInput;
let walletInput;
let betButton;
let dealButton;
let submitButton;
let resetButton;
let betDiv;

let phase = 0;

function updateButtons() {
  betButton.style.display = "none";
  doubleButton.style.display = "none";
  dealButton.style.display = "none";
  submitButton.style.display = "none";
  resetButton.style.display = "none";
  betDiv.style.display = "none";

  if (phase === 0) {
    betButton.style.display = "";
    doubleButton.style.display = "";
    betDiv.style.display = "";
  } else if (phase === 1) {
    generateDice();
    dealButton.style.display = "";
    submitButton.style.display = "";
  } else if (phase === 2) {
    resetButton.style.display = "";
  }

  phase += 1;
}

let deck = [];

function generateDeck() {
  deck = [];

  for (let i = 1; i <= 8; i++) {
    deck.push(`${i}A`);
    deck.push(`${i}S`);
    deck.push(`${i}G`);
    deck.push(`${i}P`);
  }

  for (let i = 0; i < 32; i++) {
    const index = Math.floor(Math.random() * 32);

    const wow = deck[i];
    deck[i] = deck[index];
    deck[index] = wow;
  }

  return deck;
}

let hand = [];
let dealerHand = [];

function getHandSum(hand) {
  let result = 0;
  hand.forEach((card) => {
    result += ((parseInt(card[0]) - 1) % 8) + 1;
  });
  return result;
}

function renderHand(div, span, hand, hidden) {
  div.innerHTML = "";

  hand.forEach((card) => {
    const img = document.createElement("img");

    if (!hidden) img.src = `./res/img/${card}.svg`;
    else img.src = "./res/img/back.svg";
    img.classList.add("card");

    div.appendChild(img);
  });

  span.innerText = hidden ? "?" : getHandSum(hand);
}

function deal() {
  if (deck.length <= 0) return;

  hand.push(deck.pop());
  renderHand(handsDiv, handsSpan, hand);
}

function dealerDeal(hidden) {
  if (deck.length <= 0) return;

  dealerHand.push(deck.pop());
  renderHand(dealerHandsDiv, dealerHandsSpan, dealerHand, hidden);
}

function roll() {
  generateDice();
}

let diceSum = [];

function setDiceNumbers(numbers) {
  rumsy.innerHTML = "";

  let sum = 0;
  numbers.forEach((number) => {
    const img = document.createElement("img");

    img.src = `./res/img/die${number}.svg`;
    img.classList.add("dice");

    rumsy.appendChild(img);

    sum += number;
  });

  rumsySpan.innerText = sum;
}

function generateDice() {
  const numbers = [];
  diceSum = 0;

  for (let i = 0; i < 3; i++) {
    const die = Math.floor(Math.random() * 6) + 1;
    numbers.push(die);
    diceSum += die;
  }

  setDiceNumbers(numbers);
}

function resetDice() {
  diceSum = 0;
  setDiceNumbers([0, 0, 0]);
}

function submit() {
  while (diceSum - getHandSum(dealerHand) >= 6) {
    dealerDeal();
  }

  const dealerSum = getHandSum(dealerHand);
  const youSum = getHandSum(hand);
  const dealerDiff = dealerSum - diceSum;
  const youDiff = youSum - diceSum;

  if (dealerSum === youSum) {
    resultSpan.innerText = "Draw";
    walletInput.value = parseInt(walletInput.value) + parseInt(potInput.value);
  } else if (
    (youDiff < 0 && dealerDiff < 0 && youDiff > dealerDiff) ||
    (youDiff > 0 && dealerDiff > 0 && youDiff < dealerDiff) ||
    (youDiff < 0 && dealerDiff > 0) ||
    youDiff === 0
  ) {
    resultSpan.innerText = "Win";
    walletInput.value =
      parseInt(walletInput.value) + parseInt(potInput.value) * 2;
  } else {
    resultSpan.innerText = "Lose";
  }

  renderHand(dealerHandsDiv, dealerHandsSpan, dealerHand, false);
  updateButtons();
}

function reset() {
  hand = [];
  dealerHand = [];

  generateDeck();
  resetDice();

  deal();
  dealerDeal(true);
  potInput.value = 0;
  bet(5);

  resultSpan.innerText = "-";

  phase = 0;
  updateButtons();
}

function double() {
  potInput.value = parseInt(potInput.value) + parseInt(betInput.value) * 2;
  walletInput.value =
    parseInt(walletInput.value) - parseInt(betInput.value) * 2;

  updateButtons();
}

function bet(value) {
  if (value === undefined) {
    value = parseInt(betInput.value);
  }

  potInput.value = parseInt(potInput.value) + value;
  walletInput.value = parseInt(walletInput.value) - value;

  updateButtons();
}

document.addEventListener("DOMContentLoaded", () => {
  rumsy = document.querySelector("#rumsy");
  rumsySpan = document.querySelector("#rumsy-number");
  handsDiv = document.querySelector("#hands");
  handsSpan = document.querySelector("#hands-number");
  dealerHandsDiv = document.querySelector("#dealer-hands");
  dealerHandsSpan = document.querySelector("#dealer-hands-number");
  resultSpan = document.querySelector("#result");
  potInput = document.querySelector("#pot");
  betInput = document.querySelector("#bet");
  walletInput = document.querySelector("#wallet");
  betButton = document.querySelector("#bet-button");
  doubleButton = document.querySelector("#double-button");
  dealButton = document.querySelector("#deal-button");
  submitButton = document.querySelector("#submit-button");
  resetButton = document.querySelector("#reset-button");
  betDiv = document.querySelector("#bet-div");

  reset();
});
