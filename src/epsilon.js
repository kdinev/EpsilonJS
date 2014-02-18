"use strict";
// Extending JS array with top methor looking up the last member
Array.prototype.top = function () {
	return this[this.length - 1];
};

var ZERO = 48,
	NINE = 57,
	CAP_A = 65,
	CAP_Z = 90;

var Calculator = function () {
	this.exprParser = new ExpressionParser();
};

var ExpressionParser = function (expr) {
	this.expression = expr;
	this.operatorStack = [];
	this.valueStack = [];
	
	// Public Methods
	// Parsing a mathematical expression
	// TODO: 1. The CAP_A through CAP_Z should resolve the cell ptr inside the evaluate handler of the tree
	this.parse = function () {
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
					this.valueStack.push(new ExpressionTree(this.operatorStack.pop(), this.valueStack.pop(), this.valueStack.pop()));
				}
				// remove the opening bracket
				this.operatorStack.pop();
				valueToken = true;
			} else if ((token.charCodeAt(0) >= ZERO && token.charCodeAt(0) <= NINE) || (token.charCodeAt(0) >= CAP_A && token.charCodeAt(0) <= CAP_Z)) {
				// Token is a number
				temp.push(token);
				while (expr.length && ((expr[0].charCodeAt(0) >= ZERO && expr[0].charCodeAt(0) <= NINE) || (expr[0].charCodeAt(0) >= CAP_A && expr[0].charCodeAt(0) <= CAP_Z))) {
					temp.push(expr.shift());
				}
				this.valueStack.push(new ExpressionTree(temp.join("")));
				valueToken = true;
			} else if (token === "-" && !valueToken) {
				// Unary negative operator (negative sign)
				while (expr.length && ((expr[0].charCodeAt(0) >= ZERO && expr[0].charCodeAt(0) <= NINE) || (expr[0].charCodeAt(0) >= CAP_A && expr[0].charCodeAt(0) <= CAP_Z))) {
					temp.push(expr.shift());
				}
				this.valueStack.push(new ExpressionTree(token, new ExpressionTree(temp.join(""))));
				valueToken = true;
			} else if (token === "+" || token === "-" || token === "*" || token === "/") {
				while (this.operatorStack.length && ((this.operatorStack.top() === "*" || this.operatorStack.top() === "/") || (token === "+" || token === "-"))) {
					this.valueStack.push(new ExpressionTree(this.operatorStack.pop(), this.valueStack.pop(), this.valueStack.pop()));
				}
				this.operatorStack.push(token);
				valueToken = false;
			}
		}
		while (this.operatorStack.length) {
			this.valueStack.push(new ExpressionTree(this.operatorStack.pop(), this.valueStack.pop(), this.valueStack.pop()));
		}
	};
	this.evaluate = function () {
		return this.valueStack[0].evaluate();
	};
	this.value = function () {
		this.parse();
		return this.evaluate();
	};
};

var ExpressionTree = function (token, left, right) {
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
			this.left = left;
			this.right = right;
			break;
		default:
			this.pointer = this.left = this.right = this.operator = null;
			break;
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
	this.value = function () {
		if (typeof this.pointer === "number") {
			return this.pointer;
		}
		if (this.pointer.charCodeAt(0) >= ZERO && this.pointer.charCodeAt(0) <= NINE) {
			this.pointer = parseFloat(this.pointer);
		}
		return this.pointer;
	};
};
