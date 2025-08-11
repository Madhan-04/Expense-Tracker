const balance = document.getElementById("balance");
const income = document.getElementById("income");
const expense = document.getElementById("expense");

const incomeList = document.getElementById("income-list");
const expenseList = document.getElementById("expense-list");

const incomeForm = document.getElementById("income-form");
const expenseForm = document.getElementById("expense-form");

const incomeText = document.getElementById("income-text");
const incomeAmount = document.getElementById("income-amount");
const expenseText = document.getElementById("expense-text");
const expenseAmount = document.getElementById("expense-amount");

let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

function updateValues() {
  const amounts = transactions.map(t => t.amount);
  const total = amounts.reduce((acc, val) => acc + val, 0).toFixed(2);
  const totalIncome = amounts.filter(a => a > 0).reduce((a, b) => a + b, 0).toFixed(2);
  const totalExpense = (amounts.filter(a => a < 0).reduce((a, b) => a + b, 0) * -1).toFixed(2);

  balance.innerText = total;
  income.innerText = `₹${totalIncome}`;
  expense.innerText = `₹${totalExpense}`;
}

function addTransactionDOM(transaction) {
  const li = document.createElement("li");
  li.innerHTML = `
    ${transaction.text} 
    <span>₹${Math.abs(transaction.amount)}</span>
    <button onclick="removeTransaction(${transaction.id})">x</button>
  `;

  if (transaction.amount >= 0) {
    incomeList.appendChild(li);
  } else {
    expenseList.appendChild(li);
  }
}

function addIncome(e) {
  e.preventDefault();

  const transaction = {
    id: Date.now(),
    text: incomeText.value,
    amount: +incomeAmount.value
  };

  transactions.push(transaction);
  localStorage.setItem("transactions", JSON.stringify(transactions));
  addTransactionDOM(transaction);
  updateValues();

  incomeText.value = "";
  incomeAmount.value = "";
}

function addExpense(e) {
  e.preventDefault();

  const transaction = {
    id: Date.now(),
    text: expenseText.value,
    amount: -Math.abs(expenseAmount.value)
  };

  transactions.push(transaction);
  localStorage.setItem("transactions", JSON.stringify(transactions));
  addTransactionDOM(transaction);
  updateValues();

  expenseText.value = "";
  expenseAmount.value = "";
}

function removeTransaction(id) {
  transactions = transactions.filter(t => t.id !== id);
  localStorage.setItem("transactions", JSON.stringify(transactions));
  init();
}

function init() {
  incomeList.innerHTML = "";
  expenseList.innerHTML = "";
  transactions.forEach(addTransactionDOM);
  updateValues();
}

incomeForm.addEventListener("submit", addIncome);
expenseForm.addEventListener("submit", addExpense);

init();

// Slide-to-Clear functionality
const sliderHandle = document.getElementById("slider-handle");
const sliderButton = document.getElementById("slider-button");
const sliderLabel = document.getElementById("slider-label");

let isDragging = false;
let startX;

sliderHandle.addEventListener("mousedown", startDrag);
sliderHandle.addEventListener("touchstart", startDrag);

document.addEventListener("mousemove", onDrag);
document.addEventListener("touchmove", onDrag);

document.addEventListener("mouseup", stopDrag);
document.addEventListener("touchend", stopDrag);

function startDrag(e) {
  isDragging = true;
  startX = e.type === "touchstart" ? e.touches[0].clientX : e.clientX;
}

function onDrag(e) {
  if (!isDragging) return;

  const clientX = e.type === "touchmove" ? e.touches[0].clientX : e.clientX;
  const diffX = clientX - startX;

  const maxX = sliderButton.offsetWidth - sliderHandle.offsetWidth;
  const newX = Math.min(Math.max(0, diffX), maxX);

  sliderHandle.style.left = `${newX}px`;

  if (newX >= maxX - 10) {
    isDragging = false;
    triggerClearAction();
  }
}

function stopDrag() {
  if (!isDragging) return;
  isDragging = false;
  sliderHandle.style.left = "0px";
}

function triggerClearAction() {
  transactions = [];
  localStorage.removeItem("transactions");
  incomeList.innerHTML = "";
  expenseList.innerHTML = "";
  updateValues();

  incomeText.value = "";
  incomeAmount.value = "";
  expenseText.value = "";
  expenseAmount.value = "";

  sliderLabel.innerText = "Data Cleared! ✅";
  sliderHandle.style.backgroundColor = "#dc3545";
  sliderHandle.innerText = "✔";

  setTimeout(() => {
    sliderHandle.style.left = "0px";
    sliderHandle.style.backgroundColor = "#fff";
    sliderHandle.innerText = "≫";
    sliderLabel.innerText = "Slide to Clear All Data";
  }, 1500);
}
