const display = document.getElementById("display");
const clearButton = document.querySelector('[data-action="clear"]');

let currentValue = "0";
let previousValue = null;
let operator = null;
let waitingForNewValue = false;

function updateDisplay() {
    const number = Number(currentValue);

    if (!Number.isFinite(number)) {
        display.textContent = "Error";
        clearButton.textContent = "AC";
        return;
    }

    display.textContent = number.toLocaleString("en-US", {
        maximumFractionDigits: 10
    });

    clearButton.textContent = currentValue === "0" ? "AC" : "C";
}

function inputNumber(number) {
    if (currentValue === "Error") {
        currentValue = "0";
    }

    if (waitingForNewValue) {
        currentValue = number === "." ? "0." : number;
        waitingForNewValue = false;
    } else if (number === "." && !currentValue.includes(".")) {
        currentValue += ".";
    } else if (number !== ".") {
        currentValue = currentValue === "0" ? number : currentValue + number;
    }

    updateDisplay();
}

function calculate(first, second, selectedOperator) {
    const a = Number(first);
    const b = Number(second);

    switch (selectedOperator) {
        case "+":
            return a + b;
        case "-":
            return a - b;
        case "*":
            return a * b;
        case "/":
            return b === 0 ? "Error" : a / b;
        default:
            return b;
    }
}

function chooseOperator(nextOperator) {
    if (currentValue === "Error") {
        clearCalculator();
        return;
    }

    if (operator && !waitingForNewValue) {
        const result = calculate(previousValue, currentValue, operator);
        currentValue = String(result);
        previousValue = currentValue;
    } else {
        previousValue = currentValue;
    }

    operator = nextOperator;
    waitingForNewValue = true;
    updateDisplay();
}

function equals() {
    if (!operator || previousValue === null) {
        return;
    }

    const result = calculate(previousValue, currentValue, operator);

    currentValue = String(result);
    previousValue = null;
    operator = null;
    waitingForNewValue = true;

    updateDisplay();
}

function clearCalculator() {
    if (currentValue !== "0") {
        currentValue = "0";
    } else {
        previousValue = null;
        operator = null;
        waitingForNewValue = false;
    }

    updateDisplay();
}

function toggleSign() {
    if (currentValue !== "0" && currentValue !== "Error") {
        currentValue = String(Number(currentValue) * -1);
    }

    updateDisplay();
}

function percentage() {
    if (currentValue !== "Error") {
        currentValue = String(Number(currentValue) / 100);
    }

    updateDisplay();
}

document.querySelectorAll(".btn").forEach((button) => {
    button.addEventListener("click", () => {
        const number = button.dataset.number;
        const selectedOperator = button.dataset.operator;
        const action = button.dataset.action;

        if (number !== undefined) {
            inputNumber(number);
        }

        if (selectedOperator) {
            chooseOperator(selectedOperator);
        }

        if (action === "clear") {
            clearCalculator();
        }

        if (action === "toggle-sign") {
            toggleSign();
        }

        if (action === "percent") {
            percentage();
        }

        if (action === "equals") {
            equals();
        }
    });
});

document.addEventListener("keydown", (event) => {
    const key = event.key;

    if (/^[0-9]$/.test(key)) {
        inputNumber(key);
    } else if (key === ".") {
        inputNumber(".");
    } else if (key === "+" || key === "-") {
        chooseOperator(key);
    } else if (key === "*") {
        chooseOperator("*");
    } else if (key === "/") {
        event.preventDefault();
        chooseOperator("/");
    } else if (key === "Enter" || key === "=") {
        equals();
    } else if (key === "Escape") {
        clearCalculator();
    } else if (key === "Backspace") {
        currentValue = currentValue.length > 1 && currentValue !== "Error"
            ? currentValue.slice(0, -1)
            : "0";

        updateDisplay();
    }
});

updateDisplay();
