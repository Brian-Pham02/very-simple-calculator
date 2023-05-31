export {isOperator, evaluate}

function isNumeric(expr) {
    return !isNaN(expr);
}

function isOperator(c) {
    return ['^', '*', '/', '%', '+', '-'].includes(c);
}

function precedence(c) {
    let prec = 0;

    if(c === '^') {
        prec = 3;
    } else if(c === '*' || c === '/' || c === '%') {
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
        let c = formatted[i];
        if(isOperator(c) || (c === '(' || c === ')')) {
            formatted = formatted.replaceAll(c, " " + c + " ").replace(/\s+/g, " ");
        }
    }

    formatted = formatted  
                .replaceAll(" - - ", " + ") 
                .replaceAll(" * - ", " * -") 
                .replaceAll(" / - ", " / -")
                .replaceAll(" ^ - ", " ^ -")
                .replaceAll(" + - ", " - ")
                .replaceAll(" ( - ", " ( -")
                .replaceAll(") (", ") * (")
                .replaceAll(" * * ", " ^ ")
                .replaceAll(/\s+/g, " ")
                .trim();

    if(formatted.indexOf("-") === 0)
        formatted = formatted.replace("- ", "-"); 

    
    let tokens = formatted.split(' ');

    for(let i = 0; i < tokens.length - 1; i++) {
        if((isNumeric(tokens[i]) || tokens[i] === 'e' || tokens[i] === 'π') && tokens[i + 1] === '(') {
            tokens.splice(i + 1, 0, '*');
        }

        if(tokens[i] === ')' && (isNumeric(tokens[i + 1]) || tokens[i + 1] === 'e' || tokens[i + 1] === 'π')) {
            tokens.splice(i + 1, 0, '*');
        }
    }

    const reg1 = /^[+-]?((\d+(\.\d*)?)|(\.\d+))e/g;
    const reg2 = /^[+-]?((\d+(\.\d*)?)|(\.\d+))π/g;
    const reg3 = /^e((\d+(\.\d*)?)|(\.\d+))/g;
    const reg4 = /^π((\d+(\.\d*)?)|(\.\d+))/g;

    for(let i = 0; i < tokens.length; i++) {
        if(reg1.test(tokens[i])) {
            let arr = tokens[i].split('e').join(' * e');
            tokens[i] = arr;
        }

        if(reg2.test(tokens[i])) {
            let arr = tokens[i].split('π').join(' * π');
            tokens[i] = arr;
        }

        if(reg3.test(tokens[i])) {
            let arr = tokens[i].split('e').join('e * ');
            tokens[i] = arr;
        }

        if(reg4.test(tokens[i])) {
            let arr = tokens[i].split('π').join('π * ');
            tokens[i] = arr;
        }
    }

    formatted = tokens.join(' ').replaceAll("e", "" + Math.E).replaceAll("π", "" + Math.PI);
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
            let x = parseFloat(c);
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
    //return `Expression: ${format}`
}