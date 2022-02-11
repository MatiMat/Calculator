const numberButtons: NodeList = document.querySelectorAll('[data-number]');
const operationButtons: NodeList = document.querySelectorAll('[data-operation]');
const equalsButton: HTMLElement = document.querySelector('[data-equals]');
const deleteButton: HTMLElement = document.querySelector('[data-delete]');
const allClearButton: HTMLElement = document.querySelector('[data-clear]');
const previousOperandTextElement: HTMLInputElement = document.querySelector('[data-previous-operand]');
const currentOperandTextElement: HTMLInputElement = document.querySelector('[data-current-operand]');

class Calculator {
    previousOperandTextElement: HTMLInputElement;
    currentOperandTextElement: HTMLInputElement;
    previousOperand: string = '';
    currentOperand: string = '';
    operation: string = null;

    constructor(previousOperandTextElement: HTMLInputElement, currentOperandTextElement: HTMLInputElement) {
        this.previousOperandTextElement = previousOperandTextElement;
        this.currentOperandTextElement = currentOperandTextElement;
        this.addListeners();
    }

    private addListeners() {
        numberButtons.forEach( button => {
            button.addEventListener('click', (evt: Event) => {
                evt.stopPropagation();
                this.numberHandlers(button);
            });
        });
        operationButtons.forEach(button => {
            button.addEventListener('click', (evt: Event) => {
                evt.stopPropagation();
                this.operationsHandler(button);
            })
        });

        equalsButton.addEventListener('click', (evt: Event) => {
            evt.stopPropagation();
            this.compute();
            this.updateDisplay();
        });

        allClearButton.addEventListener('click', (evt: Event) => {
            evt.stopPropagation();
            this.clear();
        });

        deleteButton.addEventListener('click', (evt: Event) => {
            evt.stopPropagation();
            this.deleteNumber();
            this.updateDisplay();
        });

        document.addEventListener('keyup', (evt: KeyboardEvent) => {
            evt.stopPropagation();
            const buttonNumber = document.querySelector('[data-number="' + evt.key + '"]');
            const buttonOperation = document.querySelector('[data-operation="' + evt.key + '"]');
            const buttonDot = document.querySelector('[data-number="dot"]');

            window.setTimeout(() => {
                !!buttonNumber && buttonNumber.classList.remove('press');
                !!buttonDot && buttonDot.classList.remove('press');
                !!buttonOperation && buttonOperation.classList.remove('press');
                !!equalsButton && equalsButton.classList.remove('press');
                !!deleteButton && deleteButton.classList.remove('press');
                !!allClearButton && allClearButton.classList.remove('press');
            }, 300);
        });

        document.addEventListener('keydown', (evt: KeyboardEvent) => {
            evt.stopPropagation();
            let button: any = '';
            if (Number(evt.key) || evt.key === '0') {
                button = document.querySelector('[data-number="' + evt.key + '"]');
                button.classList.add('press');
                this.numberHandlers(button);
            }

            if (evt.key === ',' || evt.key === '.') {
                button = document.querySelector('[data-number="dot"]');
                button.classList.add('press');
                this.numberHandlers(button);
            }

            if (evt.key === '/' || evt.key === '*' || evt.key === '-' || evt.key === '+' || evt.key === '%') {
                button = document.querySelector('[data-operation="' + evt.key + '"]');
                button.classList.add('press');
                this.operationsHandler(button);
            }

            if (evt.key === 'Enter') {
                equalsButton.classList.add('press');
                this.compute();
                this.updateDisplay();
            }
            
            if (evt.key === 'Backspace') {
                deleteButton.classList.add('press');
                this.deleteNumber();
                this.updateDisplay();
            }

            if (evt.key === 'Delete') {
                allClearButton.classList.add('press');
                this.clear();
            }
        });
    }

    private numberHandlers(button) {
        const numberValue = button.dataset.number;
        if (numberValue === 'dot') {
            this.addComma();
        } else {
            this.appendNumber(numberValue);
        }
        this.updateDisplay();
    }

    private operationsHandler(button) {
        this.chooseOperation(button.dataset.operation);
        if (button.dataset.operation === '%') {
            this.compute();
        }
        this.updateDisplay();
    }

    private clear() { // czyszczenie
        this.currentOperand = '';
        this.previousOperand = '';
        this.previousOperandTextElement.value = '';
        this.currentOperandTextElement.value = '';
        this.operation = null;
    }

    private deleteNumber() { // kasowanie 
        this.currentOperand = this.currentOperand.slice(0, -1);
    }

    private appendNumber(number: Number) { // łączenie cyfr w liczby
        this.currentOperand = this.currentOperand.toString() + number.toString();
    }

    private addComma() {
        if (this.currentOperand.indexOf(".") == -1) {
            this.currentOperand = `${this.currentOperand}.`;
        }
        return;
    }

    private chooseOperation(operation: string) { // wybrana operacja
        if (!this.currentOperand.length) {
            return;
        }

        if (this.previousOperand.length) {
            this.compute();
        }

        this.operation = operation;
        this.previousOperand = this.currentOperand;
        this.currentOperand = '';
    }

    private compute() { // oblicz
        let computation = 0;
        const prev = parseFloat(this.previousOperand);
        const current = parseFloat(this.currentOperand);

        if (isNaN(prev) || isNaN(current) && this.operation != '%') {
            return;
        }

        switch(this.operation) {
            case '+':
                computation = prev + current;
                break;
            case '-':
                computation = prev - current;
                break;
            case '*':
                computation = prev * current;
                break;
            case '/':
                computation = prev / current;
                break;
            case '%':
                computation = prev * 0.01;
                break;
            default:
                return;
        }
        this.currentOperand = computation.toString();
        this.operation = null;
        this.previousOperand = '';
    }

    private updateDisplay() { // wyświetl wynik
        this.currentOperandTextElement.value = this.getDisplayNumber(this.currentOperand);
        if (this.operation != null) {
            const previousOperand = `${this.getDisplayNumber(this.previousOperand)} ${this.operation}`;
            this.previousOperandTextElement.value = previousOperand;
        } else {
            this.previousOperandTextElement.value = '';
        }
    }

    private getDisplayNumber(number: string): string {
        const floatNumber = parseFloat(number);
        if (isNaN(floatNumber)) {
            return '';
        }
        return floatNumber.toLocaleString('pl');
    }
}

const calculator = new Calculator(previousOperandTextElement, currentOperandTextElement);