        const resultElement = document.getElementById('result');
        const calculationElement = document.getElementById('calculation');
        

        let currentValue = '0';
        let previousValue = '';
        let operation = null;
        let resetScreen = false;
        

        function updateDisplay() {
            resultElement.textContent = currentValue;
            calculationElement.textContent = previousValue + (operation ? ' ' + getOperationSymbol(operation) : '');
        }
        

        function getOperationSymbol(op) {
            switch(op) {
                case 'add': return '+';
                case 'subtract': return '-';
                case 'multiply': return '×';
                case 'divide': return '÷';
                default: return op;
            }
        }
        
        function appendNumber(number) {
            if (resetScreen) {
                currentValue = '';
                resetScreen = false;
            }
            
            if (number === '.' && currentValue.includes('.')) return;
            
            if (currentValue === '0' && number !== '.') {
                currentValue = number;
            } else {
                currentValue += number;
            }
        }
        

        function chooseOperation(op) {
            if (currentValue === '') return;
            
            if (previousValue !== '') {
                calculate();
            }
            
            operation = op;
            previousValue = currentValue;
            resetScreen = true;
        }
        

        function calculate() {
            let computation;
            const prev = parseFloat(previousValue);
            const current = parseFloat(currentValue);
            
            if (isNaN(prev) || isNaN(current)) return;
            
            switch(operation) {
                case 'add':
                    computation = prev + current;
                    break;
                case 'subtract':
                    computation = prev - current;
                    break;
                case 'multiply':
                    computation = prev * current;
                    break;
                case 'divide':
                    if (current === 0) {
                        alert("Ошибка: деление на ноль!");
                        clearCalculator();
                        return;
                    }
                    computation = prev / current;
                    break;
                default:
                    return;
            }
            

            currentValue = Math.round(computation * 10000000000) / 10000000000;
            currentValue = currentValue.toString();
            operation = null;
            previousValue = '';
            resetScreen = true;
        }
        
        function clearCalculator() {
            currentValue = '0';
            previousValue = '';
            operation = null;
        }
        
        function backspace() {
            if (currentValue.length > 1) {
                currentValue = currentValue.slice(0, -1);
            } else {
                currentValue = '0';
            }
        }
        
        function handleButtonClick(button) {
            if (button.hasAttribute('data-number')) {
                appendNumber(button.getAttribute('data-number'));
                updateDisplay();
                return;
            }
            
            if (button.hasAttribute('data-action')) {
                const action = button.getAttribute('data-action');
                
                switch(action) {
                    case 'clear':
                        clearCalculator();
                        break;
                    case 'backspace':
                        backspace();
                        break;
                    case 'equals':
                        if (previousValue === '' || operation === null) return;
                        calculate();
                        break;
                    case 'decimal':
                        if (resetScreen) {
                            currentValue = '0';
                            resetScreen = false;
                        }
                        appendNumber('.');
                        break;
                    default:
                        chooseOperation(action);
                        break;
                }
                
                updateDisplay();
            }
        }
        
        function handleKeyboardInput(e) {
            if (e.key >= '0' && e.key <= '9') {
                appendNumber(e.key);
                updateDisplay();
            } else if (e.key === '.') {
                if (resetScreen) {
                    currentValue = '0';
                    resetScreen = false;
                }
                appendNumber('.');
                updateDisplay();
            } else if (e.key === '+' || e.key === '-') {
                chooseOperation(e.key === '+' ? 'add' : 'subtract');
                updateDisplay();
            } else if (e.key === '*' || e.key === 'x') {
                chooseOperation('multiply');
                updateDisplay();
            } else if (e.key === '/') {
                chooseOperation('divide');
                updateDisplay();
            } else if (e.key === 'Enter' || e.key === '=') {
                if (previousValue === '' || operation === null) return;
                calculate();
                updateDisplay();
            } else if (e.key === 'Escape') {
                clearCalculator();
                updateDisplay();
            } else if (e.key === 'Backspace') {
                backspace();
                updateDisplay();
            }
        }
        
        function initCalculator() {
            document.querySelectorAll('button').forEach(button => {
                button.addEventListener('click', () => {
                    handleButtonClick(button);
                    button.style.transform = 'scale(0.95)';
                    setTimeout(() => {
                        button.style.transform = 'scale(1)';
                    }, 100);
                });
            });
            
            document.addEventListener('keydown', handleKeyboardInput);
            
            //* возвращение в исходку *//
            updateDisplay();
        }
        
        document.addEventListener('DOMContentLoaded', initCalculator);