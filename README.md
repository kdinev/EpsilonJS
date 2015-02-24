EpsilonJS[![Codacy Badge](https://www.codacy.com/project/badge/3d2d4cba93d94dc59cbbad849f7c9fbe)](https://www.codacy.com/public/kdinev/EpsilonJS)[![Build Status](https://travis-ci.org/kdinev/EpsilonJS.svg?branch=master)](https://travis-ci.org/kdinev/EpsilonJS)
=========

EpsilonJS us a JavaScript calculator and an expression parser. The framework allows for parsing mathematical expressions from string or from DOM attributes. It also allows evaluation of mathematical expressions as part of DOM attributes which reference other DOM elements.

How to build EpsilonJS
=========

Clone the repo:

    git clone https://github.com/kdinev/EpsilonJS.git
    
Install the grunt client:

    npm install -g grunt-cli bower
    
Go to the EpsilonJS folder and install dependencies:

    cd epsilonjs
    npm install
    bower install
    
Build:

    grunt default

Description
=========

Parses and evaluates mathematical expressions. The expression is provided to the expression parser as a string.

    var expr = "1/(2+8)*2",
        parser = new Epsilon.ExpressionParser(expr);
    parser.evaluate(); // Yeilds 0.2 as a number type
    
Supported operators:

 * Addition (+)
 * Subtraction (-)
 * Multiplication (*)
 * Division (/)
 * Negative values (-)
 * Brackets (())

The epsilon expression parser handles DOM formula references as well. The epsilon expression parser will evaluate all elements containing a `data-formula` attribute. In order to get the DOM evaluated the `Epsilon.epsilon()` method needs to be called after loading the DOM. The references need to be like excel cells (e.g. `A10`, `C2`) and will be looked-up by `id` and by `data-formula-ref` attribute if not found by `id`. The referenced elements can contain and formula and epsilon will evaluate them according to their `data-formula`. Circular references are not handled at this point and will result in out of stack space exception.

Example:

    <ul>
        <li id="A1">10</li> <!-- <li data-formula-ref="A1">10</li> -->
        <li data-formula="=A1*2"></li>
    </ul>
    <script type="text/javascript">
        Epsilon.epsilon();
    </script>
    
The result will be:

 * 10
 * 20

Epsilon can evaluate only specific DOM elements as well and can be invoked at any point for those elements. If the reference elements contain formulas, then their formulas will be evaluated as part of the requested element's formula but their DOM values will not be changed.

Example:

    <ul>
        <li id="A1">10</li> <!-- <li data-formula-ref="A1">10</li> -->
        <li id="A2" data-formula="=A1*2"></li>
        <li id="A3" data-formula="=A2+5"></li>
    </ul>
    <script type="text/javascript">
        Epsilon.epsilon([document.getElementById("A3")]);
    </script>

The result will be:

 * 10
 * 
 * 25

There is also a jQuery UI epsilon calculator widget provided by [https://github.com/kdinev/calculatorjs](https://github.com/kdinev/calculatorjs). This widget was created to test the epsilon expression parser. The calculator widget is dependent on jQuery and jQuery UI. In order to use it:
    
    <div id="calculator"></div>
    <script type="text/javascript">
		$(document).ready(function () {
			$("#calculator").calculator();
		});
	</script>

The calculator widget is used in a Windows 8.1 store application which you may download and play with here: [http://apps.microsoft.com/windows/app/epsilon-calculator/ec41ebdd-00c6-4654-a2a2-b297a0118a87](http://apps.microsoft.com/windows/app/epsilon-calculator/ec41ebdd-00c6-4654-a2a2-b297a0118a87)
