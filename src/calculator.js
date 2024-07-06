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
        case '^':
            return b ** a;
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
    let expr = expression.replace(/\s+/g, "")
    .replaceAll("+-", "-")
    .replaceAll("-+", "-")
    .replaceAll("--", "+") 
    .replaceAll("**", "^")
    .replaceAll(")(", ")*(")
    .trim();
                
    if(expr.startsWith("-(")) 
        expr = "0" + expr;

    expr = fixParentheses(expr);

    let tokens = []
    let i = 0;
    const pattern = /^[-]?([0-9]+([.][0-9]+)?|[.][0-9]+)$/
    let re = new RegExp(pattern);

    while(i < expr.length) {
        let c = expr[i];
        if(isOperator(c)) {
            tokens.push(`${c}`);
        } else if(c === '(') {
            if(tokens.length > 0 && re.test(tokens[tokens.length - 1])) {
                tokens.push("*");
            }
            tokens.push(`${c}`);
        } else if(c === ')') {
            tokens.push(c);
        } else {
            let value = `${c}`;
            while(i + 1 < expr.length && !isOperator(expr[i + 1]) && expr[i + 1] !== '(' && expr[i + 1] !== ')') {
                value += expr[i + 1];
                i++;
            }

            if(!re.test(value))
                return "ERROR";

            if(tokens.length === 1 && tokens[0] === "-") {
                tokens[0] = `-${value}`;
            } else if(tokens.length >= 2 && (isOperator(tokens[tokens.length - 2]) || tokens[tokens.length - 2] === "(") && tokens[tokens.length - 1] === "-") {
                tokens[tokens.length - 1] = `-${value}`;
            } else {
                tokens.push(value);
            }
        }   
        i++;
    }

    return tokens.join(' ').trim();
};

    

function evaluate(expression) {
    const format = formatExpression(expression);
    if(format === "ERROR")
        return NaN;

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
}
