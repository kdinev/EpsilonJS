Array.prototype.top = function () {
    return this[this.length - 1];
};

var Epsilon;
(function (Epsilon) {
    var ZERO = 48, NINE = 57, CAP_A = 65, CAP_Z = 90, DEC_POINT = 46;

    var ExpressionTree = (function () {
        function ExpressionTree(token, left, right) {
            this.pointer = null;
            this.left = null;
            this.right = null;
            this.operator = null;
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
        ExpressionTree.prototype.evaluate = function () {
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
        };

        ExpressionTree.prototype.value = function () {
            if (typeof this.pointer === "number") {
                return this.pointer;
            }
            if (this.pointer.charCodeAt(0) >= ZERO && this.pointer.charCodeAt(0) <= NINE || this.pointer.charCodeAt(0) === DEC_POINT) {
                this.pointer = parseFloat(this.pointer);
            } else if (this.pointer.charCodeAt(0) >= CAP_A && this.pointer.charCodeAt(0) <= CAP_Z) {
                this.pointer = this.getDomVal();
            }
            return this.pointer;
        };

        ExpressionTree.prototype.getDomVal = function () {
            var el = document.getElementById(this.pointer);
            if (!el) {
                el = document.querySelector("[data-formula-ref='" + this.pointer + "']");
            }
            return this.getElementValue(el);
        };

        ExpressionTree.prototype.getElementValue = function (el) {
            var val, parser;
            if (el && el.getAttribute("data-formula")) {
                parser = new ExpressionParser(el.getAttribute("data-formula"));
                val = parser.evaluate();
            } else if (el) {
                val = el.innerText;
            }
            return parseFloat(val);
        };
        return ExpressionTree;
    })();
    Epsilon.ExpressionTree = ExpressionTree;
    var ExpressionParser = (function () {
        function ExpressionParser(expr) {
            this.expr = expr;
            this.expression = null;
            this.operatorStack = [];
            this.valueStack = [];
            this.expression = expr;
        }
        ExpressionParser.prototype.parse = function () {
            var expr = this.expression.split(""), token, temp, valueToken = false;
            while (expr.length) {
                token = expr.shift();
                temp = [];
                if (token === "(") {
                    this.operatorStack.push("(");
                    valueToken = false;
                } else if (token === ")") {
                    while (this.operatorStack.top() !== "(") {
                        this.valueStack.push(new Epsilon.ExpressionTree(this.operatorStack.pop(), this.valueStack.pop(), this.valueStack.pop()));
                    }

                    this.operatorStack.pop();
                    valueToken = true;
                } else if (this.isValueFragment(token)) {
                    temp.push(token);
                    while (expr.length && this.isValueFragment(expr[0])) {
                        temp.push(expr.shift());
                    }
                    this.valueStack.push(new Epsilon.ExpressionTree(temp.join("")));
                    valueToken = true;
                } else if (token === "-" && !valueToken) {
                    while (expr.length && this.isValueFragment(expr[0])) {
                        temp.push(expr.shift());
                    }
                    this.valueStack.push(new Epsilon.ExpressionTree(token, new Epsilon.ExpressionTree(temp.join(""))));
                    valueToken = true;
                } else if (this.isOperator(token)) {
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
        };

        ExpressionParser.prototype.isOperator = function (token) {
            return token === "+" || token === "-" || token === "*" || token === "/";
        };

        ExpressionParser.prototype.isValueFragment = function (token) {
            return (token.charCodeAt(0) >= ZERO && token.charCodeAt(0) <= NINE) || (token.charCodeAt(0) >= CAP_A && token.charCodeAt(0) <= CAP_Z) || token.charCodeAt(0) === DEC_POINT;
        };

        ExpressionParser.prototype.value = function () {
            return this.valueStack[0].evaluate();
        };

        ExpressionParser.prototype.evaluate = function (e) {
            if (arguments.length) {
                this.setExpression(e);
            }
            this.parse();
            return this.value();
        };

        ExpressionParser.prototype.setExpression = function (e) {
            this.expression = e;
            this.operatorStack = [];
            this.valueStack = [];
        };
        return ExpressionParser;
    })();
    Epsilon.ExpressionParser = ExpressionParser;
    function epsilon(els) {
        var parser = new ExpressionParser(), elements = els || document.querySelectorAll("[data-formula]"), i;
        for (i = 0; elements && i < elements.length; i++) {
            elements[i].innerText = parser.evaluate(elements[i].getAttribute("data-formula")).toString();
        }
    }
    Epsilon.epsilon = epsilon;
})(Epsilon || (Epsilon = {}));
//# sourceMappingURL=epsilon.js.map
