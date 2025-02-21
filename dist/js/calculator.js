"use strict";
const OPERATIONS = {
    CLEAR: "AC",
    DELETE: "DEL",
    PERCENT: "%",
    ADD: "+",
    SUBTRACT: "-",
    DIVIDE: "/",
    MULTIPLY: "*",
    EQUALS: "=",
    NONE: "none"
};
var Operation;
(function (Operation) {
    Operation["NONE"] = "none";
    Operation["ADD"] = "+";
    Operation["SUBTRACT"] = "-";
    Operation["MULTIPLY"] = "*";
    Operation["DIVIDE"] = "/";
    Operation["PERCENT"] = "%";
})(Operation || (Operation = {}));
function add(a, b) {
    return a + b;
}
function subtract(a, b) {
    return a - b;
}
function multiply(a, b) {
    return a * b;
}
function divide(a, b) {
    if (b === 0) {
        throw new Error("Division by zero is not allowed");
    }
    return a / b;
}
function percent(a) {
    return a / 100;
}
function updateScreen(value) {
    const screen = document.querySelector('#screen-input');
    if (screen) {
        screen.textContent = value;
    }
}
function screenClear() {
    updateScreen("0");
    operation = Operation.NONE;
}
function handleDelete() {
    const screen = document.querySelector('#screen-input');
    if (screen && screen.textContent) {
        const textContent = screen.textContent;
        const lastChar = textContent[textContent.length - 1];
        if (["+", "-", "*", "/", "%"].includes(lastChar)) {
            operation = Operation.NONE;
        }
        updateScreen(textContent.length === 1 ? "0" : textContent.slice(0, -1));
    }
}
function calculate(a, b, operation) {
    switch (operation) {
        case Operation.ADD:
            return add(a, b);
        case Operation.SUBTRACT:
            return subtract(a, b);
        case Operation.MULTIPLY:
            return multiply(a, b);
        case Operation.DIVIDE:
            return divide(a, b);
        default:
            throw new Error("Unknown operation");
    }
}
let firstOperand;
let secondOperand;
let operation = Operation.NONE;
const operations = {
    [OPERATIONS.CLEAR]: screenClear,
    [OPERATIONS.DELETE]: handleDelete,
    [OPERATIONS.PERCENT]: () => {
        const screen = document.querySelector('#screen-input');
        if (screen && operation === Operation.NONE && screen.textContent) {
            const operand = +screen.textContent;
            updateScreen(`${percent(operand)}`);
            operation = Operation.NONE;
        }
    },
    [OPERATIONS.ADD]: () => {
        const screen = document.querySelector('#screen-input');
        if (screen && operation === Operation.NONE) {
            updateScreen(`${screen.textContent}+`);
            operation = Operation.ADD;
        }
    },
    [OPERATIONS.SUBTRACT]: () => {
        const screen = document.querySelector('#screen-input');
        if (screen && operation === Operation.NONE) {
            updateScreen(`${screen.textContent}-`);
            operation = Operation.SUBTRACT;
        }
    },
    [OPERATIONS.DIVIDE]: () => {
        const screen = document.querySelector('#screen-input');
        if (screen && operation === Operation.NONE) {
            updateScreen(`${screen.textContent}/`);
            operation = Operation.DIVIDE;
        }
    },
    [OPERATIONS.MULTIPLY]: () => {
        const screen = document.querySelector('#screen-input');
        if (screen && operation === Operation.NONE) {
            updateScreen(`${screen.textContent}*`);
            operation = Operation.MULTIPLY;
        }
    },
    [OPERATIONS.EQUALS]: () => {
        const screen = document.querySelector('#screen-input');
        if (screen && operation !== Operation.NONE && screen.textContent) {
            const [first, second] = screen.textContent.split(`${operation}`);
            [firstOperand, secondOperand] = [+first, +second];
            updateScreen(`${calculate(firstOperand, secondOperand, operation)}`);
            operation = Operation.NONE;
        }
    }
};
document.addEventListener('DOMContentLoaded', (event) => {
    const buttonsNumbers = document.querySelectorAll('.numbers');
    const buttonsOperations = document.querySelectorAll('.operations');
    buttonsNumbers.forEach((button) => button.addEventListener('click', (e) => {
        const target = e.target;
        if (target && target.textContent) {
            const screen = document.querySelector('#screen-input');
            if (screen && screen.textContent) {
                updateScreen(+screen.textContent === 0 ? target.textContent : `${screen.textContent}${target.textContent}`);
            }
        }
    }));
    buttonsOperations.forEach((button) => button.addEventListener('click', (e) => {
        const target = e.target;
        if (target && target.textContent) {
            operations[target.textContent]();
        }
    }));
});
