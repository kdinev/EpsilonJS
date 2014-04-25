EpsilonJS
=========

A JavaScript calculator and an expression parser.

Description:

Parses and evaluates mathematical expressions. The expression is provided to the expression parser as a string.

    var expr = "1/(2+8)*2",
        parser = new ExpressionParser(expr);
    parser.evaluate(); // Yeilds 0.2 as a number type
    
Supported operators:

 * Addition (+)
 * Subtraction (-)
 * Multiplication (*)
 * Division (/)
 * Negative values (-)
 * Brackets (())

The epsilon expression parser handles DOM formula references as well. The epsilon expression parser will evaluate all elements containing a `data-formula` attribute. In order to get the DOM evaluated the global `epsilon()` method needs to be called after loading the DOM. The references need to be like excel cells (e.g. `A10`, `C2`) and will be looked-up by `id` and by `data-formula-ref` attribute if not found by `id`.

Example:

    <ul>
        <li id="A1">10</li> <!-- <li data-formula-ref="A1">10</li> -->
        <li data-formula="=A1*2"></li>
    </ul>
    <script type="text/javascript">
        epsilon();
    </script>
    
The result will be:

 * 10
 * 20

There is also a jQuery UI epsilon calculator widget provided by `calculator.js`. This widget was created to test the epsilon expression parser. The calculator widget is dependent on jQuery and jQuery UI. In order to use it:
    
    <div id="calculator"></div>
    <script type="text/javascript">
		$(document).ready(function () {
			$("#calculator").calculator();
		});
	</script>
