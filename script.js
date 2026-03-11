// ---------- DOM elements ----------
// get DOM Elements
const addBtn = document.getElementById("addTransaction");
const clearBtn = document.getElementById("clearBtn");
const desc = document.getElementById("text");
const amount = document.getElementById("amount");
const expenseType = document.getElementById("type");
const historyList = document.getElementById("list");
const totalIncome = document.getElementById("totalIncome");
const totalExpense = document.getElementById("totalExpense");
const balance = document.getElementById("balance");
const historyFilter = document.getElementById("historyFilter");
const filter = document.getElementById("filter");

// counters to calculate all transactions
let incomeCounter = 0;
let expenseCounter = 0;
let totalBalance = 0;

// updating counters and updating UI.
function updateTotals() {
  incomeCounter = 0;
  expenseCounter = 0;
  transactionsHistory.forEach((e) => {
    if (e.expenseType == "income") {
      incomeCounter += parseFloat(e.amount);
    } else {
      expenseCounter += parseFloat(e.amount);
    }
  });
  totalBalance = incomeCounter - expenseCounter;
  totalIncome.innerHTML = "Rs. " + incomeCounter.toFixed(2);
  totalExpense.innerHTML = "Rs. " + expenseCounter.toFixed(2);
  balance.innerHTML = "Rs. " + totalBalance.toFixed(2);
}

// rendering the transaction history list based on the in-memory array. Each entry has a delete button with a data attribute for its index in the array
function renderHistory() {
  historyList.innerHTML = "";
  transactionsHistory.forEach((e, idx) => {
    const li = document.createElement("li");
    li.dataset.index = idx;
    li.textContent = `${new Date(e.date).toLocaleDateString()} | ${e.desc} - ${e.amount}`;
    li.classList.add(e.expenseType);
    const removeBtn = document.createElement("button");
    removeBtn.textContent = "X";
    removeBtn.classList.add("delete");
    li.appendChild(removeBtn);
    historyList.appendChild(li);
  });
}

// remove an entry by its array index and refresh UI/storage
function removeTransaction(index) {
  if (index >= 0 && index < transactionsHistory.length) {
    transactionsHistory.splice(index, 1);
    localStorage.setItem(
      "transactionsHistory",
      JSON.stringify(transactionsHistory),
    );
    renderHistory();
    updateTotals();
  }
}

// ---------- load saved transactions ----------
// read the array from localStorage (if any) and fall back to empty list
const transactionsHistory =
  JSON.parse(localStorage.getItem("transactionsHistory")) || [];

// render initial state
renderHistory();
updateTotals();

// ---------- add transaction handler ----------
// when the user clicks the "Add Transaction" button we validate the
// inputs, update storage and the UI, and recalc totals
addBtn.addEventListener("click", (e) => {
  e.preventDefault();
  if (desc.value !== "" && amount.value !== "" && !isNaN(amount.value)) {
    let newTransaction = {
      desc: desc.value,
      amount: amount.value,
      expenseType: expenseType.value,
      date: new Date().toLocaleDateString(),
    };

    // push to in-memory array and persist
    transactionsHistory.push(newTransaction);
    localStorage.setItem(
      "transactionsHistory",
      JSON.stringify(transactionsHistory),
    );

    // redraw everything based on new array and recalc totals
    renderHistory();
    updateTotals();
  } else {
    alert("Please fill in both fields.");
  }
  // recalc net balance and clear inputs
  totalBalance = incomeCounter - expenseCounter;
  balance.innerHTML = "Rs. " + totalBalance.toFixed(2);
  desc.value = "";
  amount.value = "";
});

// ---------- clear all data ----------
// removes everything from storage and resets the UI/counters
clearBtn.addEventListener("click", () => {
  localStorage.removeItem("transactionsHistory");
  transactionsHistory.length = 0;
  historyList.innerHTML = "";
  incomeCounter = 0;
  totalIncome.innerHTML = "Rs. 0";
  totalExpense.innerHTML = "Rs. 0";
  balance.innerHTML = "Rs. 0";
});

// ---------- filter history by type ----------
// show/hide list items depending on the chosen filter option
filter.addEventListener("change", () => {
  const selectedFilter = filter.value;
  const listItems = historyList.getElementsByTagName("li");
  for (let item of listItems) {
    if (selectedFilter === "all") {
      item.style.display = "flex";
    } else if (item.classList.contains(selectedFilter)) {
      item.style.display = "flex";
    } else {
      item.style.display = "none";
    }
  }
});
// ---------- input sanitization ----------
// prevent the user from typing non-numeric characters into the
// amount field (especially scientific notation or +/− signs)
amount.addEventListener("keydown", (e) => {
  if (["e", "E", "+", "-"].includes(e.key)) {
    e.preventDefault();
  }
});

// ---------- remove individual transaction ----------
// listen for delete-button clicks on the list and remove by index
historyList.addEventListener("click", (e) => {
  if (e.target.classList.contains("delete")) {
    const idx = parseInt(e.target.parentElement.dataset.index, 10);
    if (!isNaN(idx)) {
      removeTransaction(idx);
    }
  }
});
// ---------- theme toggle ----------
const toggleBtn = document.querySelector("#themeToggle")

// load theme
if(localStorage.getItem("theme") === "dark"){
document.body.classList.add("dark")
}

toggleBtn.addEventListener("click", ()=>{

document.body.classList.toggle("dark")

if(document.body.classList.contains("dark")){
localStorage.setItem("theme","dark")
}else{
localStorage.setItem("theme","light")
}

});
