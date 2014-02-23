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
