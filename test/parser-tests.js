module("Expression Parser");

test("Single value expression", function () {
	var expression = "1",
		answer = 1,
		e = new Epsilon.ExpressionParser(expression);
	equal(e.evaluate(), answer, "The expression " + expression + " did not yield " + answer);
	expression = "-1";
	answer = -1;
	e = new Epsilon.ExpressionParser(expression);
	equal(e.evaluate(), answer, "The expression " + expression + " did not yield " + answer);
	expression = "-0.21";
	answer = -0.21;
	e.setExpression(expression);
	equal(e.evaluate(), answer, "The expression " + expression + " did not yield " + answer);
	expression = "118.926";
	answer = 118.926;
	e.setExpression(expression);
	equal(e.evaluate(), answer, "The expression " + expression + " did not yield " + answer);
	expression = ".123";
	answer = 0.123;
	e.setExpression(expression);
	equal(e.evaluate(), answer, "The expression " + expression + " did not yield " + answer);
	expression = "-.125";
	answer = -0.125;
	e.setExpression(expression);
	equal(e.evaluate(), answer, "The expression " + expression + " did not yield " + answer);
});

test("Basic expressions", function () {
	var expression = "1+2",
		answer = 3,
		e = new Epsilon.ExpressionParser(expression);
	equal(e.evaluate(), answer, "The expression " + expression + " did not yield " + answer);
	expression = "1-2";
	answer = -1;
	e.setExpression(expression);
	equal(e.evaluate(), answer, "The expression " + expression + " did not yield " + answer);
	expression = "1*2";
	answer = 2;
	e.setExpression(expression);
	equal(e.evaluate(), answer, "The expression " + expression + " did not yield " + answer);
	expression = "1/2";
	answer = 0.5;
	e.setExpression(expression);
	equal(e.evaluate(), answer, "The expression " + expression + " did not yield " + answer);
	expression = "1-(-2)";
	answer = 3;
	e.setExpression(expression);
	equal(e.evaluate(), answer, "The expression " + expression + " did not yield " + answer);
	expression = "-1+-2";
	answer = -3;
	e.setExpression(expression);
	equal(e.evaluate(), answer, "The expression " + expression + " did not yield " + answer);
	expression = "-1*2";
	answer = -2;
	e.setExpression(expression);
	equal(e.evaluate(), answer, "The expression " + expression + " did not yield " + answer);
	expression = "1/-2";
	answer = -0.5;
	e.setExpression(expression);
	equal(e.evaluate(), answer, "The expression " + expression + " did not yield " + answer);
});

test("Operator precedence", function () {
	var expression = "1+2*10-6",
		answer = 15,
		e = new Epsilon.ExpressionParser(expression);
	equal(e.evaluate(), answer, "The expression " + expression + " did not yield " + answer);
	expression = "1-2+8*2";
	answer = 15;
	e.setExpression(expression);
	equal(e.evaluate(), answer, "The expression " + expression + " did not yield " + answer);
	expression = "1/2+8*2";
	answer = 16.5;
	e.setExpression(expression);
	equal(e.evaluate(), answer, "The expression " + expression + " did not yield " + answer);
	expression = "1/(2+8)*2";
	answer = 0.2;
	e.setExpression(expression);
	equal(e.evaluate(), answer, "The expression " + expression + " did not yield " + answer);
	expression = "1/((2+8)*2)";
	answer = 0.05;
	e.setExpression(expression);
	equal(e.evaluate(), answer, "The expression " + expression + " did not yield " + answer);
	expression = "-1/((2+8)*2)";
	answer = -0.05;
	e.setExpression(expression);
	equal(e.evaluate(), answer, "The expression " + expression + " did not yield " + answer);
	expression = "0.1-2.26+8*2.1";
	answer = 14.64;
	e.setExpression(expression);
	equal(e.evaluate(), answer, "The expression " + expression + " did not yield " + answer);
	expression = "-0.1-(2.26+8)*2.1";
	answer = -21.646;
	e.setExpression(expression);
	equal(e.evaluate(), answer, "The expression " + expression + " did not yield " + answer);
	expression = "-0.1/(2.26+8)*2.1";
	answer = -0.020467836257309944;
	e.setExpression(expression);
	equal(e.evaluate(), answer, "The expression " + expression + " did not yield " + answer);
});

test("Expressions with white spaces", function () {
	var expression = "1 + 2 * 10 - 6",
		answer = 15,
		e = new Epsilon.ExpressionParser(expression);
	equal(e.evaluate(), answer, "The expression " + expression + " did not yield " + answer);
	expression = "-0.1 - (2.26 + 8) * 2.1";
	answer = -21.646;
	e.setExpression(expression);
	equal(e.evaluate(), answer, "The expression " + expression + " did not yield " + answer);
});

var TestModule = TestModule || {};
TestModule.renderDom = function () {
	var container = document.createElement("div");
	container.id = "testContainer";
	document.body.appendChild(container);
	var html = "<div id='A1'>1</div><div id='A2' data-formula='=A1*3'></div><div id='A3' data-formula='=A2+20'></div><div id='A4' data-formula='=A5+-1.2'></div><div id='A5' data-formula='=A3-1'></div>";
	container.innerHTML = html;
};
TestModule.renderDomWithInputs = function () {
	var container = document.createElement("div");
	container.id = "testContainer";
	document.body.appendChild(container);
	var html = "<input id='A1' value='1' /><div id='A2' data-formula='=A1*3'></div><div id='A3' data-formula='=A2+20'></div><div id='A4' data-formula='=A5+-1.2'></div><div id='A5' data-formula='=A3-1'></div>";
	container.innerHTML = html;
};

module("DOM reference parser", {
	setup: function () {
		TestModule.renderDom();
		Epsilon.epsilon();
	},
	teardown: function () {
		var node = document.getElementById("testContainer");
		node.parentNode.removeChild(node);
	}
});

test("DOM references and chained formulas.", function () {
	equal(document.getElementById("A2").innerText, "3", "The DOM element with formula =A1*3 was not evaluated correctly.");
	equal(document.getElementById("A3").innerText, "23", "The DOM element with formula =A2+20 was not evaluated correctly.");
	equal(document.getElementById("A4").innerText, "20.8", "The DOM element with formula =A5+-1.2 was not evaluated correctly.");
	equal(document.getElementById("A5").innerText, "22", "The DOM element with formula =A3-1 was not evaluated correctly.");
});

module("DOM reference parser - restricted subset", {
	setup: function () {
		TestModule.renderDom();
		Epsilon.epsilon([document.getElementById("A3")]);
	},
	teardown: function () {
		var node = document.getElementById("testContainer");
		node.parentNode.removeChild(node);
	}
});

test("DOM references and chained formulas - restricted subset.", function () {
	equal(document.getElementById("A2").innerText, "", "The DOM element with formula =A1*3 was not evaluated correctly.");
	equal(document.getElementById("A3").innerText, "23", "The DOM element with formula =A2+20 was not evaluated correctly.");
	equal(document.getElementById("A4").innerText, "", "The DOM element with formula =A5+-1.2 was evaluated and it should not be.");
	equal(document.getElementById("A5").innerText, "", "The DOM element with formula =A3-1 was evaluated and it should not be.");
});

module("DOM reference parser - restricted subset single element", {
	setup: function () {
		TestModule.renderDom();
		Epsilon.epsilon(document.getElementById("A3"));
	},
	teardown: function () {
		var node = document.getElementById("testContainer");
		node.parentNode.removeChild(node);
	}
});

test("DOM references and chained formulas - restricted subset.", function () {
	equal(document.getElementById("A2").innerText, "", "The DOM element with formula =A1*3 was not evaluated correctly.");
	equal(document.getElementById("A3").innerText, "23", "The DOM element with formula =A2+20 was not evaluated correctly.");
	equal(document.getElementById("A4").innerText, "", "The DOM element with formula =A5+-1.2 was evaluated and it should not be.");
	equal(document.getElementById("A5").innerText, "", "The DOM element with formula =A3-1 was evaluated and it should not be.");
});

module("DOM reference parser - input elements", {
	setup: function () {
		TestModule.renderDomWithInputs();
		Epsilon.epsilon();
	},
	teardown: function () {
		var node = document.getElementById("testContainer");
		node.parentNode.removeChild(node);
	}
});

test("DOM references and chained formulas - restricted subset.", function () {
	equal(document.getElementById("A2").innerText, "3", "The DOM element with formula =A1*3 was not evaluated correctly.");
	equal(document.getElementById("A3").innerText, "23", "The DOM element with formula =A2+20 was not evaluated correctly.");
	equal(document.getElementById("A4").innerText, "20.8", "The DOM element with formula =A5+-1.2 was not evaluated correctly.");
	equal(document.getElementById("A5").innerText, "22", "The DOM element with formula =A3-1 was not evaluated correctly.");
});