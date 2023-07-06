export {isOperator, evaluate, isNumeric}

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
        case '^':
            return Math.pow(b, a);
        default:
            return '';
    }
}

const fixParentheses = (str) => {
    let orig = str;
  
    //Repeatedly remove all instances of "()" until there are none left
    while (str.includes("()"))
      str = str.replace(/\(\)/g, '');
      
    //Count the number of ")" and "(" left in the string
    let amtOpeningParensNeeded = (str.match(/\)/g) || []).length;
    let amtClosingParensNeeded = (str.match(/\(/g) || []).length;
    
    //Add that many "(" and ")" to the string, respectively
    return "(".repeat(amtOpeningParensNeeded) + orig + ")".repeat(amtClosingParensNeeded);
};

const formatExpression = (expression) => {

    let formatted = expression.replace(/\s+/g, " ");
    formatted = fixParentheses(formatted);

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
                .replaceAll(" - + ", " - ")
                .replaceAll(" ( - ", " ( -")
                .replaceAll(") (", ") * (")
                .replaceAll(" * * ", " ^ ")
                .replaceAll(/\s+/g, " ")
                .trim();

    if(formatted.indexOf("-") === 0)
        formatted = formatted.replace("- ", "-"); 

    let tokens = formatted.split(' ');

    for(let i = 0; i < tokens.length - 1; i++) {
        if(isNumeric(tokens[i]) && tokens[i + 1] === '(') {
            tokens.splice(i + 1, 0, '*');
        }

        if(tokens[i] === ')' && isNumeric(tokens[i + 1])) {
            tokens.splice(i + 1, 0, '*');
        }
    }

    formatted = tokens.join(' ');
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
    //return `Expression: ${format}`;
}