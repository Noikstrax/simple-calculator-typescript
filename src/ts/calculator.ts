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

enum Operation {
    NONE = "none",
    ADD = "+",
    SUBTRACT = "-",
    MULTIPLY = "*",
    DIVIDE = "/",
    PERCENT = "%"
}

function add(a: number, b: number): number {
	return a + b;
}

function subtract(a: number, b: number): number {
	return a - b;
}

function multiply(a: number, b: number): number {
	return a * b;
}

function divide(a: number, b: number): number {
	if(b === 0) {
		throw new Error("Division by zero is not allowed");
	}
	return a / b;
}

function percent(a: number): number {
	return a / 100;
}

function updateScreen(value: string) {
	const screen: HTMLParagraphElement | null = document.querySelector('#screen-input');
    if (screen) {
        screen.textContent = value;
    }
}

function screenClear(): void {
	updateScreen("0");
	operation = Operation.NONE;
}

function handleDelete(): void {
	const screen: HTMLParagraphElement | null = document.querySelector('#screen-input');
    if (screen && screen.textContent) {
        const textContent = screen.textContent;
        const lastChar: string = textContent[textContent.length - 1];
        if (["+", "-", "*", "/", "%"].includes(lastChar)) {
            operation = Operation.NONE;
        }
        updateScreen(textContent.length === 1 ? "0" : textContent.slice(0, -1));
    }

}

function calculate(a: number, b: number, operation: Operation): number {
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

let firstOperand: number;
let secondOperand: number;
let operation: Operation = Operation.NONE;

const operations: Record<string, () => void> = {
	[OPERATIONS.CLEAR]: screenClear,
    [OPERATIONS.DELETE]: handleDelete,
    [OPERATIONS.PERCENT]: (): void => {
        const screen: HTMLParagraphElement | null = document.querySelector('#screen-input');
        if (screen && operation === Operation.NONE && screen.textContent) {
            const operand: number = +screen.textContent;
            updateScreen(`${percent(operand)}`);
            operation = Operation.NONE;
        }
    },
    [OPERATIONS.ADD]: (): void => {
        const screen: HTMLParagraphElement | null = document.querySelector('#screen-input');
        if (screen && operation === Operation.NONE) {
            updateScreen(`${screen.textContent}+`);
            operation = Operation.ADD;
        }
    },
    [OPERATIONS.SUBTRACT]: (): void => {
        const screen: HTMLParagraphElement | null = document.querySelector('#screen-input');
        if (screen && operation === Operation.NONE) {
            updateScreen(`${screen.textContent}-`);
            operation = Operation.SUBTRACT;
        }
    },
    [OPERATIONS.DIVIDE]: (): void => {
        const screen: HTMLParagraphElement | null = document.querySelector('#screen-input');
        if (screen && operation === Operation.NONE) {
            updateScreen(`${screen.textContent}/`);
            operation = Operation.DIVIDE;
        }
    },
    [OPERATIONS.MULTIPLY]: (): void => {
        const screen: HTMLParagraphElement | null = document.querySelector('#screen-input');
        if (screen && operation === Operation.NONE) {
            updateScreen(`${screen.textContent}*`);
            operation = Operation.MULTIPLY;
        }
    },
    [OPERATIONS.EQUALS]: (): void => {
        const screen: HTMLParagraphElement | null = document.querySelector('#screen-input');
        if (screen && operation !== Operation.NONE && screen.textContent) {
            const [first, second] = screen.textContent.split(`${operation}`);
            [firstOperand, secondOperand] = [+first, +second];
            updateScreen(`${calculate(firstOperand, secondOperand, operation)}`);
            operation = Operation.NONE;
        }
    }

}

document.addEventListener('DOMContentLoaded', (event: Event) => {

	const buttonsNumbers: NodeListOf<HTMLButtonElement> = document.querySelectorAll('.numbers');
	const buttonsOperations: NodeListOf<HTMLButtonElement> = document.querySelectorAll('.operations');

	buttonsNumbers.forEach((button: HTMLButtonElement): void => button.addEventListener('click', (e: MouseEvent) => {
		const target = e.target as HTMLButtonElement | null;
		if (target && target.textContent ) {
			const screen: HTMLParagraphElement | null = document.querySelector('#screen-input');
			if (screen && screen.textContent) {
                updateScreen(+screen.textContent === 0 ? target.textContent : `${screen.textContent}${target.textContent}`);
            }
		}
	}));

	buttonsOperations.forEach((button: HTMLButtonElement): void => button.addEventListener('click', (e: MouseEvent) => {
		const target = e.target as HTMLButtonElement | null;
		if (target && target.textContent) {
			operations[target.textContent]();
		}
	}));

})



