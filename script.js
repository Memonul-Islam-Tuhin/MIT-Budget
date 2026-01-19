/*
 * Title:Budget Tracker App
 * Description: This is the main project simple of this project
 * Author: Memonul Islam ( Learn in Memonul )
 * Date:01-20-2026
 *
 */

// finding element

const darkModeToggle = document.getElementById("darkModeToggle");
const budgetChart = document.getElementById("budgetChart");
const root = document.documentElement;

const userNameElement = document.getElementById("userName");
const incomeElement = document.getElementById("income");
const numberOfExpensesElement = document.getElementById("numberExpenses");
const startBudgetElement = document.getElementById("startBudget");
const resetBudgetElement = document.getElementById("resetBudget");
const expnesesInputsElement = document.getElementById("expnesesInputs");
const calculateBudgetElement = document.getElementById("calculateBudget");
const clearBudgetElement = document.getElementById("clearBudget");
const budgetResultElement = document.querySelector(".budgetResult");

// listening for budget
darkModeToggle.addEventListener("click", toggleDarkMode);
startBudgetElement.addEventListener("click", getExpenses);
calculateBudgetElement.addEventListener("click", startCalculateBudget);
clearBudgetElement.addEventListener("click", clearBudget);
resetBudgetElement.addEventListener("click", fullReset);

userNameElement.addEventListener("input", validateForm);
incomeElement.addEventListener("input", validateForm);
numberOfExpensesElement.addEventListener("input", validateForm);

startBudgetElement.disabled = true;

function validateForm() {
  const incomeValid = parseFloat(incomeElement.value) > 0;
  const userNameValid = userNameElement.value.trim().length > 0;
  const numberExpensesValid = parseInt(numberOfExpensesElement.value) >= 0;

  startBudgetElement.disabled = !(
    incomeValid &&
    userNameValid &&
    numberExpensesValid
  );
}

function fullReset() {
  userNameElement.value = "";
  incomeElement.value = "";
  numberOfExpensesElement.value = "";
  clearBudgetFormLocal();

  expnesesInputsElement.innerHTML = "";
  budgetResultElement.innerHTML = "";
  calculateBudgetElement.style.display = "none";
  clearBudgetElement.style.display = "none";
}

function saveBudgetFormLocal(userBudget) {
  localStorage.setItem("userBudget", JSON.stringify(userBudget));
}

function getBudget() {
  const saveBudget = localStorage.getItem("userBudget");
  return saveBudget ? JSON.parse(saveBudget) : null;
}

function clearBudgetFormLocal(userBudget) {
  localStorage.removeItem("userBudget");
  alert("Budget data cleared from local storage");
}

function clearBudget() {
  clearBudgetFormLocal();
  budgetResultElement.innerHTML = "";
  expnesesInputsElement.innerHTML = "";
  calculateBudgetElement.style.display = "none";
  clearBudgetElement.style.display = "none";
}

function isValidNumber(value) {
  return !isNaN(value) && value >= 0;
}

function getExpenses() {
  const numberOfExpenses = numberOfExpensesElement.value;
  if (isNaN(numberOfExpenses) || numberOfExpenses < 0) {
    alert("⚠️ Enter a valid number of expenses.");
    return;
  }
  for (let index = 1; index <= numberOfExpenses; index++) {
    const expensesLabel = document.createElement("label");
    expensesLabel.textContent = `Enter expenses ${index}`;

    const expnesesInput = document.createElement("input");
    expnesesInput.type = "number";
    expnesesInput.classList.add("expensesValue");

    expnesesInputsElement.appendChild(expensesLabel);
    expnesesInputsElement.appendChild(expnesesInput);

    expnesesInputsElement.appendChild(document.createElement("br"));
  }

  calculateBudgetElement.style.display = "inline-block";
  clearBudgetElement.style.display = "inline-block";
}

function calculateTotalExpenses(expensesArray) {
  console.log(expensesArray);
  let total = 0;
  for (const expense of expensesArray) {
    total += expense;
  }

  return total;
}

function calculateTex(income, rate = 0.1) {
  return income * rate;
}

function calculateNetIncome(income, tax) {
  return income - tax;
}

function calculateBalance(netIncome, totalExpenses) {
  return netIncome - totalExpenses;
}

function calculateSavings(balance, rate = 0.2) {
  return balance * rate;
}

function getFinancialStatusMessage(savings) {
  let financialStatusMessage = "";
  if (savings >= 1000) {
    financialStatusMessage = "💰 Excellent! You are saving well!";
  } else if (savings >= 500) {
    financialStatusMessage = "✅ Good! You have a decent savings amount.";
  } else if (savings >= 100) {
    financialStatusMessage =
      "⚠️ Needs Improvement. Consider reducing expenses.";
  } else {
    financialStatusMessage = "🚨 Critical! Your savings are too low!";
  }

  return financialStatusMessage;
}

function checkOverSpending(totalExpenses, income) {
  return totalExpenses > income
    ? "⚠️ Warning: You are spending more than your income!"
    : "";
}

function startCalculateBudget() {
  const userBudget = {
    userName: userNameElement.value,
    income: parseFloat(incomeElement.value),
    numberOfExpenses: parseInt(numberOfExpensesElement.value),
    expenses: [],
    totalExpenses: 0,
    tax: 0,
    netIncome: 0,
    balance: 0,
    savings: 0,
    financialStatusMessage: "",
    overspendingMessage: "",
  };

  console.log(userBudget);

  let expneseInputs = document.getElementsByClassName("expensesValue");

  for (let i = 0; i < expneseInputs.length; i++) {
    const expense = parseFloat(expneseInputs[i].value);
    userBudget.expenses.push(isNaN(expense) || expense < 0 ? 0 : expense);
  }

  calculateBudget(userBudget);
  saveBudgetFormLocal(userBudget);
  displayResult(userBudget);
}

function calculateBudget(userBudget) {
  userBudget.totalExpenses = calculateTotalExpenses(userBudget.expenses);
  userBudget.tax = calculateTex(userBudget.income);
  userBudget.netIncome = calculateNetIncome(userBudget.income, userBudget.tax);
  userBudget.balance = calculateBalance(
    userBudget.netIncome,
    userBudget.totalExpenses,
  );

  userBudget.savings = calculateSavings(userBudget.balance);
  userBudget.financialStatusMessage = getFinancialStatusMessage(
    userBudget.savings,
  );
}

function displayResult(userBudget) {
  budgetResultElement.innerHTML = `
   <img  src="./image/img.jpg"  alt="MIT-Img" />
  <p>📊 MIT Budget Show</p>
  <p>user : ${userBudget.userName} </p>
  <p>💰 Total Income: $${userBudget.income}</p>
  <p>💸 Total Expenses: $${userBudget.totalExpenses} </p>
  <p> 📉 Tax Deducted (10%): $${userBudget.tax} </p>
  <p>💲 Net Income After Tax: $${userBudget.netIncome}</p>
  <p>🟢 Remaining Balance: $${userBudget.balance} </p>
  <p>Savings (20% of balance): $${userBudget.savings}</p>
  <p>${userBudget.financialStatusMessage}</p>
  `;

  renderChart(userBudget);
}

function toggleDarkMode() {
  const isDark = root.classList.toggle("dark-mode");
  localStorage.setItem("theme", isDark ? "dark" : "light");
}

function runBudgetTracker() {
  const saveBudget = getBudget();

  if (saveBudget) {
    displayResult(saveBudget);
  }

  if (localStorage.getItem("theme") === "dark") {
    root.classList.add("dark-mode");
  }

  renderChart(saveBudget);
}

function renderChart(userBudget) {
  const ctx = budgetChart.getContext("2d");
  if (window.budgetPieChart) {
    window.budgetPieChart.destroy();
  }

  window.budgetPieChart = new Chart(ctx, {
    type: "pie",
    data: {
      labels: ["income", "expenses", "savings"],
      datasets: [
        {
          label: "Budget Breakdown",
          data: [
            userBudget.income,
            userBudget.totalExpenses,
            userBudget.savings,
          ],
          backgroundColor: ["#e74c3c", "#27ae60", "#f1c40f"],
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: "bottom",
        },
        title: {
          display: true,
          text: "Income Distribution",
        },
      },
    },
  });
}

window.addEventListener("load", runBudgetTracker);
