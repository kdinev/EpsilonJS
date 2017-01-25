interface Array<T> {
    top(): T;
}

Array.prototype.top = function () {
	return this[this.length - 1];
};
module Epsilon {
	const ZERO = 48;
	const NINE = 57;
	const CAP_A = 65;
	const CAP_Z = 90;
	const DEC_POINT = 46;

    export class ExpressionTree {
        pointer: any = null;
        left: ExpressionTree = null;
        right: ExpressionTree = null;
        operator: string = null;
        constructor(token: any);
        constructor(token: any, left: ExpressionTree);
        constructor(token: any, left?: ExpressionTree);
        constructor(token: any, left: ExpressionTree, right?: ExpressionTree);
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

        getRange(): number[] {
            var left = this.left.pointer, right = this.right.pointer, i, list = [];
            if (typeof left === "string") {
                if (left.charCodeAt(0) >= ZERO && left.charCodeAt(0) <= NINE || left.charCodeAt(0) === DEC_POINT) {
                    left = parseFloat(left);
                }
            }
            if (typeof right === "string") {
                if (right.charCodeAt(0) >= ZERO && right.charCodeAt(0) <= NINE || right.charCodeAt(0) === DEC_POINT) {
                    right = parseFloat(right);
                }
            }
            if (typeof left === "number" && typeof right === "number") {
                for (i = left; i <= right; i++) {
                    list.push(i);
                }
            }
            return list;
        }

        getElementValue(el: HTMLElement): number {
            var val = 0, parser, text;
            if (el && el.getAttribute("data-formula")) {
                parser = new ExpressionParser(el.getAttribute("data-formula"));
                val = parser.evaluate();
            } else if (el && (<HTMLInputElement>el).value) {
                val = parseFloat((<HTMLInputElement>el).value) || 0;
            } else if (el) {
				text = el.textContent || el.innerText;
				val = parseFloat(text) || 0;
			}
            return val;
        }
    }
    export class ExpressionParser {
        expression: string = null;
        operatorStack: string[] = [];
        valueStack: ExpressionTree[] = [];
        constructor(public expr?: string) {
            this.expression = expr;
        }
        parse(): void {
            this.transformExpr();
            this.parseExpr(this.expression.split(""));
            this.initValueStack();
        }

        transformExpr(): void {
            
        }

        parseExpr(expr: string[]): void {
            var token,
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
                        this.valueStack.push(new ExpressionTree(this.operatorStack.pop(), this.valueStack.pop(), this.valueStack.pop()));
                    }
                    // remove the opening bracket
                    this.operatorStack.pop();
                    valueToken = true;
                } else if (this.isValueFragment(token)) {
                    // Token is a number
                    temp.push(token);
                    while (expr.length && this.isValueFragment(expr[0])) {
                        temp.push(expr.shift());
                    }
                    this.valueStack.push(new ExpressionTree(temp.join("")));
                    valueToken = true;
                } else if (token === "-" && !valueToken) {
                    // Unary negative operator (negative sign)
                    while (expr.length && this.isValueFragment(expr[0])) {
                        temp.push(expr.shift());
                    }
                    this.valueStack.push(new ExpressionTree(token, new ExpressionTree(temp.join(""))));
                    valueToken = true;
                } else if (this.isOperator(token)) {
                    while (this.operatorStack.length && ((this.operatorStack.top() === "*" || this.operatorStack.top() === "/") || ((token === "+" || token === "-") && (this.operatorStack.top() === "+" || this.operatorStack.top() === "-")))) {
                        this.valueStack.push(new ExpressionTree(this.operatorStack.pop(), this.valueStack.pop(), this.valueStack.pop()));
                    }
                    this.operatorStack.push(token);
                    valueToken = false;
                }
            }
        }

        initValueStack(): void {
            while (this.operatorStack.length) {
                this.valueStack.push(new ExpressionTree(this.operatorStack.pop(), this.valueStack.pop(), this.valueStack.pop()));
            }
        }

        isOperator(token?: string): boolean {
            return token === "+" || token === "-" || token === "*" || token === "/";
        }

        isValueFragment(token?: string): boolean {
            return (token.charCodeAt(0) >= ZERO && token.charCodeAt(0) <= NINE) || (token.charCodeAt(0) >= CAP_A && token.charCodeAt(0) <= CAP_Z) || token.charCodeAt(0) === DEC_POINT;
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

        setExpression(e: string): void {
            this.expression = e;
            this.operatorStack = [];
            this.valueStack = [];
        }
    }
    export function epsilon(els?: any): void {
        var parser = new ExpressionParser(),
            elements = els || document.querySelectorAll("[data-formula]"),
            i, 
            value;
        if (elements.length === undefined) {
            elements = new Array(elements);
        }
        for (i = 0; elements && i < elements.length; i++) {
			value = parser.evaluate((<HTMLElement>elements[i]).getAttribute("data-formula")).toString();
			if ((<HTMLElement>elements[i]).textContent !== undefined) {
				(<HTMLElement>elements[i]).textContent = value;
			} else {
				(<HTMLElement>elements[i]).innerText = value;
			}
        }
    }
}

