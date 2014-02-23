module("Expression Parser");

test("Single value expression", function () {
	var expression = '1',
		answer = 1,
		e = new ExpressionParser(expression);
	equal(e.evaluate(), answer, "The expression " + expression + " did not yield " + answer);
	expression = '-1';
	answer = -1;
	e = new ExpressionParser(expression);
	equal(e.evaluate(), answer, "The expression " + expression + " did not yield " + answer);
	expression = '-0.21';
	answer = -0.21;
	e.setExpression(expression);
	equal(e.evaluate(), answer, "The expression " + expression + " did not yield " + answer);
	expression = '118.926';
	answer = 118.926;
	e.setExpression(expression);
	equal(e.evaluate(), answer, "The expression " + expression + " did not yield " + answer);
	expression = '.123';
	answer = 0.123;
	e.setExpression(expression);
	equal(e.evaluate(), answer, "The expression " + expression + " did not yield " + answer);
	expression = '-.125';
	answer = -0.125;
	e.setExpression(expression);
	equal(e.evaluate(), answer, "The expression " + expression + " did not yield " + answer);
});

test("Basic expressions", function () {
	var expression = '1+2',
		answer = 3,
		e = new ExpressionParser(expression);
	equal(e.evaluate(), answer, "The expression " + expression + " did not yield " + answer);
	expression = '1-2';
	answer = -1;
	e.setExpression(expression);
	equal(e.evaluate(), answer, "The expression " + expression + " did not yield " + answer);
	expression = '1*2';
	answer = 2;
	e.setExpression(expression);
	equal(e.evaluate(), answer, "The expression " + expression + " did not yield " + answer);
	expression = '1/2';
	answer = 0.5;
	e.setExpression(expression);
	equal(e.evaluate(), answer, "The expression " + expression + " did not yield " + answer);
	expression = '1-(-2)';
	answer = 3;
	e.setExpression(expression);
	equal(e.evaluate(), answer, "The expression " + expression + " did not yield " + answer);
	expression = '-1+-2';
	answer = -3;
	e.setExpression(expression);
	equal(e.evaluate(), answer, "The expression " + expression + " did not yield " + answer);
	expression = '-1*2';
	answer = -2;
	e.setExpression(expression);
	equal(e.evaluate(), answer, "The expression " + expression + " did not yield " + answer);
	expression = '1/-2';
	answer = -0.5;
	e.setExpression(expression);
	equal(e.evaluate(), answer, "The expression " + expression + " did not yield " + answer);
});

test("Operator precedence.", function () {
	var expression = '1+2*10-6',
		answer = 15,
		e = new ExpressionParser(expression);
	equal(e.evaluate(), answer, "The expression " + expression + " did not yield " + answer);
	expression = '1-2+8*2';
	answer = 15;
	e.setExpression(expression);
	equal(e.evaluate(), answer, "The expression " + expression + " did not yield " + answer);
	expression = '1/2+8*2';
	answer = 16.5;
	e.setExpression(expression);
	equal(e.evaluate(), answer, "The expression " + expression + " did not yield " + answer);
	expression = '1/(2+8)*2';
	answer = 0.2;
	e.setExpression(expression);
	equal(e.evaluate(), answer, "The expression " + expression + " did not yield " + answer);
	expression = '1/((2+8)*2)';
	answer = 0.05;
	e.setExpression(expression);
	equal(e.evaluate(), answer, "The expression " + expression + " did not yield " + answer);
	expression = '-1/((2+8)*2)';
	answer = -0.05;
	e.setExpression(expression);
	equal(e.evaluate(), answer, "The expression " + expression + " did not yield " + answer);
	expression = '0.1-2.26+8*2.1';
	answer = 14.64;
	e.setExpression(expression);
	equal(e.evaluate(), answer, "The expression " + expression + " did not yield " + answer);
	expression = '-0.1-(2.26+8)*2.1';
	answer = -21.646;
	e.setExpression(expression);
	equal(e.evaluate(), answer, "The expression " + expression + " did not yield " + answer);
	expression = '-0.1/(2.26+8)*2.1';
	answer = -0.020467836257309944;
	e.setExpression(expression);
	equal(e.evaluate(), answer, "The expression " + expression + " did not yield " + answer);
});