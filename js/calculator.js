var numberButtons = document.querySelectorAll('[data-number]');
var operationButtons = document.querySelectorAll('[data-operation]');
var equalsButton = document.querySelector('[data-equals]');
var deleteButton = document.querySelector('[data-delete]');
var allClearButton = document.querySelector('[data-clear]');
var previousOperandTextElement = document.querySelector('[data-previous-operand]');
var currentOperandTextElement = document.querySelector('[data-current-operand]');
var Calculator = /** @class */ (function () {
    function Calculator(previousOperandTextElement, currentOperandTextElement) {
        this.previousOperand = '';
        this.currentOperand = '';
        this.operation = null;
        this.previousOperandTextElement = previousOperandTextElement;
        this.currentOperandTextElement = currentOperandTextElement;
        this.addListeners();
    }
    Calculator.prototype.addListeners = function () {
        var _this = this;
        numberButtons.forEach(function (button) {
            button.addEventListener('click', function (evt) {
                evt.stopPropagation();
                _this.numberHandlers(button);
            });
        });
        operationButtons.forEach(function (button) {
            button.addEventListener('click', function (evt) {
                evt.stopPropagation();
                _this.operationsHandler(button);
            });
        });
        equalsButton.addEventListener('click', function (evt) {
            evt.stopPropagation();
            _this.compute();
            _this.updateDisplay();
        });
        allClearButton.addEventListener('click', function (evt) {
            evt.stopPropagation();
            _this.clear();
        });
        deleteButton.addEventListener('click', function (evt) {
            evt.stopPropagation();
            _this.deleteNumber();
            _this.updateDisplay();
        });
        document.addEventListener('keyup', function (evt) {
            evt.stopPropagation();
            var buttonNumber = document.querySelector('[data-number="' + evt.key + '"]');
            var buttonOperation = document.querySelector('[data-operation="' + evt.key + '"]');
            var buttonDot = document.querySelector('[data-number="dot"]');
            window.setTimeout(function () {
                !!buttonNumber && buttonNumber.classList.remove('press');
                !!buttonDot && buttonDot.classList.remove('press');
                !!buttonOperation && buttonOperation.classList.remove('press');
                !!equalsButton && equalsButton.classList.remove('press');
                !!deleteButton && deleteButton.classList.remove('press');
                !!allClearButton && allClearButton.classList.remove('press');
            }, 300);
        });
        document.addEventListener('keydown', function (evt) {
            evt.stopPropagation();
            console.log('keydown', evt.key);
            var button = '';
            if (Number(evt.key) || evt.key === '0') {
                button = document.querySelector('[data-number="' + evt.key + '"]');
                button.classList.add('press');
                _this.numberHandlers(button);
            }
            if (evt.key === ',' || evt.key === '.') {
                button = document.querySelector('[data-number="dot"]');
                button.classList.add('press');
                _this.numberHandlers(button);
            }
            if (evt.key === '/' || evt.key === '*' || evt.key === '-' || evt.key === '+' || evt.key === '%') {
                button = document.querySelector('[data-operation="' + evt.key + '"]');
                button.classList.add('press');
                _this.operationsHandler(button);
            }
            if (evt.key === 'Enter') {
                equalsButton.classList.add('press');
                _this.compute();
                _this.updateDisplay();
            }
            if (evt.key === 'Backspace') {
                deleteButton.classList.add('press');
                _this.deleteNumber();
                _this.updateDisplay();
            }
            if (evt.key === 'Delete') {
                allClearButton.classList.add('press');
                _this.clear();
            }
        });
    };
    Calculator.prototype.numberHandlers = function (button) {
        var numberValue = button.dataset.number;
        if (numberValue === 'dot') {
            this.addComma();
        }
        else {
            this.appendNumber(numberValue);
        }
        this.updateDisplay();
    };
    Calculator.prototype.operationsHandler = function (button) {
        this.chooseOperation(button.dataset.operation);
        if (button.dataset.operation === '%') {
            this.compute();
        }
        this.updateDisplay();
    };
    Calculator.prototype.clear = function () {
        this.currentOperand = '';
        this.previousOperand = '';
        this.previousOperandTextElement.value = '';
        this.currentOperandTextElement.value = '';
        this.operation = null;
    };
    Calculator.prototype.deleteNumber = function () {
        this.currentOperand = this.currentOperand.slice(0, -1);
    };
    Calculator.prototype.appendNumber = function (number) {
        this.currentOperand = this.currentOperand.toString() + number.toString();
    };
    Calculator.prototype.addComma = function () {
        if (this.currentOperand.indexOf(".") == -1) {
            this.currentOperand = "".concat(this.currentOperand, ".");
        }
        return;
    };
    Calculator.prototype.chooseOperation = function (operation) {
        if (!this.currentOperand.length) {
            return;
        }
        if (this.previousOperand.length) {
            this.compute();
        }
        this.operation = operation;
        this.previousOperand = this.currentOperand;
        this.currentOperand = '';
    };
    Calculator.prototype.compute = function () {
        var computation = 0;
        var prev = parseFloat(this.previousOperand);
        var current = parseFloat(this.currentOperand);
        if (isNaN(prev) || isNaN(current) && this.operation != '%') {
            return;
        }
        switch (this.operation) {
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
                console.log('prev', prev, 'current', current);
                computation = prev * 0.01;
                break;
            default:
                return;
        }
        this.currentOperand = computation.toString();
        this.operation = null;
        this.previousOperand = '';
    };
    Calculator.prototype.updateDisplay = function () {
        this.currentOperandTextElement.value = this.getDisplayNumber(this.currentOperand);
        if (this.operation != null) {
            var previousOperand = "".concat(this.getDisplayNumber(this.previousOperand), " ").concat(this.operation);
            this.previousOperandTextElement.value = previousOperand;
        }
        else {
            this.previousOperandTextElement.value = '';
        }
    };
    Calculator.prototype.getDisplayNumber = function (number) {
        var floatNumber = parseFloat(number);
        if (isNaN(floatNumber)) {
            return '';
        }
        return floatNumber.toLocaleString('pl');
    };
    return Calculator;
}());
var calculator = new Calculator(previousOperandTextElement, currentOperandTextElement);
