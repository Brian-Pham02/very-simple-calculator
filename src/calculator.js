export {isOperator, evaluate}

function isNumeric(expr) {
    return !isNaN(expr);
}

function isOperator(c) {
    return ['^', '*', '/', '+', '-'].includes(c);
}

function precedence(c) {
    let prec = 0;

    if(c === '^') {
        prec = 3;
    } else if(c === '*' || c === '/') {
        prec = 2;
    } else if(c === '+' || c === '-') {
        prec = 1;
    }

    return prec;
}
    
function applyOp(op, a, b) {
    switch (op) {
        case '+':
            return a + b;
        case '-':
            return b - a;
        case '*':
            return a * b;
        case '/':
            if(a === 0) {
                return 'Undefined';
            }
            return b / a;
        case '%':
            if(a === 0) {
                return 'Undefined';
            }
            return b % a;
        case '^':
            return Math.pow(b, a);
        default:
            return '';
    }
}

const formatExpression = (expression) => {
    let formatted = expression.replace(/\s+/g, " ");

    for(let i = 0; i < formatted.length; i++) {
        if(isOperator(formatted[i]) || (formatted[i] === '(' || formatted[i] === ')')) {
            formatted = formatted.replaceAll(formatted[i], " " + formatted[i] + " ").replace(/\s+/g, " ");
        }
    }

    formatted = formatted
                .replaceAll("e", "" + Math.E)
                .replaceAll("π", "" + Math.PI)
                .replaceAll(" - - ", " + ") 
                .replaceAll(" * - ", " * -") 
                .replaceAll(" / - ", " / -")
                .replaceAll(" ^ - ", " ^ -")
                .replaceAll(" + - ", " - ")
                .replaceAll(" ( - ", " ( -")
                .replaceAll(" * * ", " ^ ")
                .replaceAll(/\s+/g, " ")
                .trim();

    if(formatted.indexOf("-") === 0)
        formatted = formatted.replace("- ", "-");

    return formatted;
};

function evaluate(expression) {
    const format = formatExpression(expression);

    let tokens = format.split(' ');
    let values = [];
    let ops = [];

    for(let i = 0; i < tokens.length; i++) {
        let c = tokens[i];
        
        if(isNumeric(c)) {
            let x = parseFloat(tokens[i]);
            values.push(x);    
        } else if(c === '(') {
            ops.push(c);
        } else if(c === ')') {
            while (ops[ops.length - 1] !== '(') {
                values.push(applyOp(ops.pop(), values.pop(), values.pop()));
            }
            ops.pop(); 
        } else if(isOperator(c)) {
            while(ops.length > 0 && precedence(c) <= precedence(ops[ops.length - 1])) {
                values.push(applyOp(ops.pop(), values.pop(), values.pop()));
            }
            ops.push(c);
        }
    }

    while(ops.length > 0) {
        values.push(applyOp(ops.pop(), values.pop(), values.pop()));
    }

    return values.pop();
    //return "Expression: " + format;
}