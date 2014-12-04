interface Array<T> {
    top(): T;
}

Array.prototype.top = function () {
	return this[this.length - 1];
};

module Epsilon {
    var ZERO = 48,
        NINE = 57,
        CAP_A = 65,
        CAP_Z = 90,
        DEC_POINT = 46;

    export class ExpressionTree {
        pointer = null;
        left = null;
        right = null;
        operator = null;
        constructor(token: any, left?: ExpressionTree, right?: ExpressionTree) {
            switch (arguments.length) {
                case 1:
                    this.pointer = token;
                    this.left = this.right = this.operator = null;
                    break;
                case 2:
                    this.pointer = null;
                    this.operator = token;
                    this.left = new ExpressionTree(0);
                    this.right = left;
                    break;
                case 3:
                    this.pointer = null;
                    this.operator = token;
                    this.left = right;
                    this.right = left;
                    break;
                default:
                    this.pointer = this.left = this.right = this.operator = null;
                    break;
            }
        }

        evaluate(): number {
            if (this.left && this.left.operator) {
                this.left.evaluate();
            }
            if (this.right && this.right.operator) {
                this.right.evaluate();
            }
            switch (this.operator) {
                case "+":
                    this.pointer = this.left.value() + this.right.value();
                    break;
                case "-":
                    this.pointer = this.left.value() - this.right.value();
                    break;
                case "*":
                    this.pointer = this.left.value() * this.right.value();
                    break;
                case "/":
                    this.pointer = this.left.value() / this.right.value();
                    break;
                default:
                    break;
            }
            return this.value();
        }

        value(): number {
            if (typeof this.pointer === "number") {
                return this.pointer;
            }
            if (this.pointer.charCodeAt(0) >= ZERO && this.pointer.charCodeAt(0) <= NINE || this.pointer.charCodeAt(0) === DEC_POINT) {
                this.pointer = parseFloat(this.pointer);
            } else if (this.pointer.charCodeAt(0) >= CAP_A && this.pointer.charCodeAt(0) <= CAP_Z) {
                this.pointer = this.getDomVal();
            }
            return this.pointer;
        }

        getDomVal(): number {
            var el = document.getElementById(this.pointer);
            if (!el) {
                el = <HTMLElement>document.querySelector("[data-formula-ref='" + this.pointer + "']");
            }
            return this.getElementValue(el);
        }

        getElementValue(el: HTMLElement): number {
            var val, parser;
            if (el && el.getAttribute("data-formula")) {
                parser = new ExpressionParser(el.getAttribute("data-formula"));
                val = parser.evaluate();
            } else if (el) {
                val = el.innerText;
            }
            return parseFloat(val);
        }
    }
    export class ExpressionParser {
        expression = null;
        operatorStack = [];
        valueStack = [];
        constructor(public expr?: string) {
            this.expression = expr;
        }
        parse() {
            var expr = this.expression.split(""),
                token,
                temp,
                valueToken = false;
            while (expr.length) {
                token = expr.shift();
                temp = [];
                if (token === "(") {
                    this.operatorStack.push("(");
                    valueToken = false;
                } else if (token === ")") {
                    while (this.operatorStack.top() !== "(") {
                        // Push a new node on the value stack
                        this.valueStack.push(new Epsilon.ExpressionTree(this.operatorStack.pop(), this.valueStack.pop(), this.valueStack.pop()));
                    }
                    // remove the opening bracket
                    this.operatorStack.pop();
                    valueToken = true;
                } else if ((token.charCodeAt(0) >= ZERO && token.charCodeAt(0) <= NINE) || (token.charCodeAt(0) >= CAP_A && token.charCodeAt(0) <= CAP_Z) || token.charCodeAt(0) === DEC_POINT) {
                    // Token is a number
                    temp.push(token);
                    while (expr.length && ((expr[0].charCodeAt(0) >= ZERO && expr[0].charCodeAt(0) <= NINE) || (expr[0].charCodeAt(0) >= CAP_A && expr[0].charCodeAt(0) <= CAP_Z) || expr[0].charCodeAt(0) === DEC_POINT)) {
                        temp.push(expr.shift());
                    }
                    this.valueStack.push(new Epsilon.ExpressionTree(temp.join("")));
                    valueToken = true;
                } else if (token === "-" && !valueToken) {
                    // Unary negative operator (negative sign)
                    while (expr.length && ((expr[0].charCodeAt(0) >= ZERO && expr[0].charCodeAt(0) <= NINE) || (expr[0].charCodeAt(0) >= CAP_A && expr[0].charCodeAt(0) <= CAP_Z) || expr[0].charCodeAt(0) === DEC_POINT)) {
                        temp.push(expr.shift());
                    }
                    this.valueStack.push(new Epsilon.ExpressionTree(token, new Epsilon.ExpressionTree(temp.join(""))));
                    valueToken = true;
                } else if (token === "+" || token === "-" || token === "*" || token === "/") {
                    while (this.operatorStack.length && ((this.operatorStack.top() === "*" || this.operatorStack.top() === "/") || ((token === "+" || token === "-") && (this.operatorStack.top() === "+" || this.operatorStack.top() === "-")))) {
                        this.valueStack.push(new Epsilon.ExpressionTree(this.operatorStack.pop(), this.valueStack.pop(), this.valueStack.pop()));
                    }
                    this.operatorStack.push(token);
                    valueToken = false;
                }
            }
            while (this.operatorStack.length) {
                this.valueStack.push(new Epsilon.ExpressionTree(this.operatorStack.pop(), this.valueStack.pop(), this.valueStack.pop()));
            }
        }

        value(): number {
            return this.valueStack[0].evaluate();
        }

        evaluate(e?: string): number {
            if (arguments.length) {
                this.setExpression(e);
            }
            this.parse();
            return this.value();
        }

        setExpression(e: string) {
            this.expression = e;
            this.operatorStack = [];
            this.valueStack = [];
        }
    }
    export function epsilon(els?: NodeList) {
        var parser = new ExpressionParser(),
            elements = els || document.querySelectorAll("[data-formula]"),
            i;
        for (i = 0; elements && i < elements.length; i++) {
            (<HTMLElement>elements[i]).innerText = parser.evaluate((<HTMLElement>elements[i]).getAttribute("data-formula")).toString();
        }
    }
}