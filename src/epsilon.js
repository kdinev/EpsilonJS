// Extending JS array with top methor looking up the last member
Array.prototype.top = function () {
	return this[this.length - 1];
}

var ZERO = 48,
	NINE = 57,
	CAP_A = 65,
	CAP_Z = 90

var Calculator = function () {
	this.exprParser = new ExpressionParser();
};

var ExpressionParser = function (expr) {
	this.expression = expr;
	this.operatorStack = [];
	this.valueStack = [];
	
	// Accessors and modifiers
	this.setExpression = function (expr) {
		this.expression = expr;
	}
	
	// Public Methods
	this.parse = function () {
		var expr = this.expression.split(""),
			token,
			temp;
		while (expr.length) {
			token = expr.shift();
			temp = [];
			if (token === "(") {
				this.operatorStack.push("(");
			} else if (token === ")") {
				while (this.operatorStack.top() !== "(") {
					// Push a new node on the value stack
					this.valueStack.push(new ExpressionTree(this.operatorStack.pop(), this.valueStack.pop(), this.valueStack.pop()));
				}
				// remove the opening bracket
				this.operatorStack.pop();
			} else if (token.charCodeAt(0) >= ZERO && token.charCodeAt(0) <= NINE) {
				// Token is a number
				temp.push(token);
				while (expr.length && (expr[0].charCodeAt(0) >= ZERO && expr[0].charCodeAt(0) <= NINE) || expr[0] === ".") {
					temp.push(expr.shift());
				}
				this.valueStack.push(new ExpressionTree(parseFloat(temp.join(""))));
			} else if (token.charCodeAt(0) >= CAP_A && token.charCodeAt(0) <= CAP_Z) {
				// Token is a cell pointer
				temp.push(token);
				while (expr.length && (expr[0].charCodeAt(0) >= ZERO && expr[0].charCodeAt(0) <= NINE) || (expr[0].charCodeAt(0) >= CAP_A && expr[0].charCodeAt(0) <= CAP_Z)) {
					temp.push(expr.shift());
				}
				this.valueStack.push(new ExpressionTree(temp.join("")));
			} else if (token === "+" || token === "-" || token === "*" || token === "/") {
				while (this.operatorStack.length && ((this.operatorStack.top() === "*" || this.operatorStack.top() === "/") || (token === "+" || token === "-"))) {
					this.valueStack.push(new ExpressionTree(this.operatorStack.pop(), this.valueStack.pop(), this.valueStack.pop()));
				}
				this.operatorStack.push(token);
			}
		}
		while (this.operatorStack.length) {
			this.valueStack.push(new ExpressionTree(this.operatorStack.pop(), this.valueStack.pop(), this.valueStack.pop()));
		}
	}
	
	this.evaluate = function () {
		return this.valueStack[0].evaluate();
	}
}

var ExpressionTree = function (token, left, right) {
	if (arguments.length === 1) {
		this.value = token;
		this.left = this.right = this.operator = null;
	} else if (arguments.length === 3) {
		this.value = null;
		this.operator = token;
		this.left = left;
		this.right = right;
	}
	
	this.evaluate = function () {
		if (this.left && this.left.operator) {
			this.left.evaluate();
		}
		if (this.right && this.right.operator) {
			this.right.evaluate();
		}
		switch (this.operator) {
		case "+":
			this.value = this.left.value + this.right.value;
			break;
		case "-":
			this.value = this.left.value - this.right.value;
			break;
		case "*":
			this.value = this.left.value * this.right.value;
			break;
		case "/":
			this.value = this.left.value / this.right.value;
			break;
		default:
			break;
		}
		return this.value;
	}
}

