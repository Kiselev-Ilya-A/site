// Функция priority позволяет получить
// значение приоритета для оператора.
// Возможные операторы: +, -, *, /.
// ----------------------------------------------------------------------------
// The "priority" function allows you to
// get the priority of an operator.
// Possible operators: +, -, *, /.

function priority(operation) {
    if (operation == '+' || operation == '-') {
        return 1;
    } else {
        return 2;
    }
}

// Проверка, является ли строка str числом.
// ----------------------------------------------------------------------------
// Checking if the string "str" contains a number.

function isNumeric(str) {
    return /^\d+(.\d+){0,1}$/.test(str);
}

// Проверка, является ли строка str цифрой.
// ----------------------------------------------------------------------------
// Checking if the string "str" contains a digit.

function isDigit(str) {
    return /^\d{1}$/.test(str);
}

// Проверка, является ли строка str оператором.
// ----------------------------------------------------------------------------
// Checking if the string "str" contains an operator.

function isOperation(str) {
    return /^[\+\-\*\/]{1}$/.test(str);
}

// Функция tokenize принимает один аргумент -- строку
// с арифметическим выражением и делит его на токены
// (числа, операторы, скобки). Возвращаемое значение --
// массив токенов.
// ----------------------------------------------------------------------------
// The "tokenize" function takes one argument, a string
// with an arithmetic expression, and divides it into
// tokens (numbers, operators, brackets).The return value
// is an array of tokens.

function tokenize(str) {
    let tokens = [];
    let lastNumber = '';
    for (char of str) {
        if (isDigit(char) || char == '.') {
            lastNumber += char;
        } else {
            if (lastNumber.length > 0) {
                tokens.push(lastNumber);
                lastNumber = '';
            }
        }
        if (isOperation(char) || char == '(' || char == ')') {
            tokens.push(char);
        }
    }
    if (lastNumber.length > 0) {
        tokens.push(lastNumber);
    }
    return tokens;
}

// Функция compile принимает один аргумент -- строку
// с арифметическим выражением, записанным в инфиксной
// нотации, и преобразует это выражение в обратную
// польскую нотацию (ОПН). Возвращаемое значение --
// результат преобразования в виде строки, в которой
// операторы и операнды отделены друг от друга пробелами.
// Выражение может включать действительные числа, операторы
// +, -, *, /, а также скобки. Все операторы бинарны и левоассоциативны.
// Функция реализует алгоритм сортировочной станции
// (https://ru.wikipedia.org/wiki/Алгоритм_сортировочной_станции).
// ----------------------------------------------------------------------------
// The compile function takes one argument, a string with an arithmetic
// expression written in infix notation, and converts this expression to
// reverse Polish notation(RPN).The return value is the result of the
// conversion as a string with operators and operands separated by
// spaces.The expression can include real numbers, +, -, *, / operators,
// and brackets. All operators are binary and left associative.
// The function implements the Shunting yard algorithm
// (https://en.wikipedia.org/wiki/Shunting_yard_algorithm).

function compile(str) {
    let out = [];
    let stack = [];
    for (token of tokenize(str)) {
        if (isNumeric(token)) {
            out.push(token);
        } else if (isOperation(token)) {
            while (stack.length > 0 &&
                   isOperation(stack[stack.length - 1]) &&
                   priority(stack[stack.length - 1]) >= priority(token)) {
                out.push(stack.pop());
            }
            stack.push(token);
        } else if (token == '(') {
            stack.push(token);
        } else if (token == ')') {
            while (stack.length > 0 && stack[stack.length - 1] != '(') {
                out.push(stack.pop());
            }
            stack.pop();
        }
    }
    while (stack.length > 0) {
        out.push(stack.pop());
    }
    return out.join(' ');
}

// Функция evaluate принимает один аргумент -- строку
// с арифметическим выражением, записанным в обратной
// польской нотации. Возвращаемое значение -- результат
// вычисления выражения. Выражение может включать
// действительные числа и опер

function evaluate(str) {
    let stack = [];
    let tokens = str.split(' ');
    for (let token of tokens) {
        if (!isNaN(token)) {
            stack.push(parseFloat(token));
        } else if (isOperation(token)) {
            let operand2 = stack.pop();
            let operand1 = stack.pop();
            if (token === '+') {
                stack.push(operand1 + operand2);
            } else if (token === '-') {
                stack.push(operand1 - operand2);
            } else if (token === '*') {
                stack.push(operand1 * operand2);
            } else if (token === '/') {
                stack.push(operand1 / operand2);
            }
        }
    }
    return stack.pop().toFixed(2);
}

// Функция clickHandler предназначена для обработки 
// событий клика по кнопкам калькулятора. 
// По нажатию на кнопки с классами digit, operation и bracket
// на экране (элемент с классом screen) должны появляться 
// соответствующие нажатой кнопке символы.
// По нажатию на кнопку с классом clear содержимое экрана 
// должно очищаться.
// По нажатию на кнопку с классом result на экране 
// должен появиться результат вычисления введённого выражения 
// с точностью до двух знаков после десятичного разделителя (точки).

document.addEventListener('DOMContentLoaded', function() {
    const screen = document.querySelector('.screen');
    const buttons = document.querySelectorAll('.key');

    buttons.forEach(button => {
        button.addEventListener('click', function() {
            // eslint-disable-next-line max-len
            if (button.classList.contains('digit') || button.classList.contains('operation') || button.classList.contains('bracket')) {
                screen.textContent += button.textContent;
            } else if (button.classList.contains('clear')) {
                screen.textContent = '';
            } else if (button.classList.contains('result')) {
                let expression = screen.textContent.trim();
                let rpnExpression = compile(expression);
                let result = evaluate(rpnExpression);
                screen.textContent = result;
            }
        });
    });
});
