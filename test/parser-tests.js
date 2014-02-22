module("Expression Parser");

test("Operator precedence.", function () {
	var expression = '1+2*10-6',
		answer = 15,
		e = new ExpressionParser(expression);
	e.parse();
	equal(e.evaluate(), answer, "The expression " + expression + " did not yield " + answer);
});