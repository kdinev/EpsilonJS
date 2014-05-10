/*
	Calculator jQuery UI Widget

	Author: Konstantin Dinev
	Date: February 2014
	Dependencies:
		jQuery (v. 1.6.0+)
		jQuery UI
		epsilon.js
*/
(function ($) {
	$.widget("ui.calculator", {
		_css: {
			calculator: "ui-widget ui-calculator",
			displayValue: "calc-display-value"
		},
		options: {
			documentKeyboard: true
		},
		_parser: null,
		_create: function() {
			this._parser = new ExpressionParser();
			this._render();
			this._attachEvents();
			this.element.addClass(this._css.calculator);
			if (this.options.focused) {
				this.element.find("." + this._css.displayValue).focus();
			}
		},
		_render: function () {
			var html = "<table><thead><tr><td colspan='4' class='" + this._css.displayValue + "'>0</td></tr></thead><tbody>" +
				"<tr><td>Del</td><td>C</td><td></td><td>/</td></tr>" +
				"<tr><td>7</td><td>8</td><td>9</td><td>*</td></tr>" +
				"<tr><td>4</td><td>5</td><td>6</td><td>-</td></tr>" +
				"<tr><td>1</td><td>2</td><td>3</td><td>+</td></tr>" +
				"<tr><td colspan='2'>0</td><td>.</td><td>=</td></tr>" +
				"</tbody></table>";
			this.element.html(html);
		},
		_attachEvents: function () {
			var input = this.element.find('.' + this._css.displayValue),
				self = this;
			this.element.on("click", "tbody td", function () {
				var target = $(this),
					value = target.text(),
					val = input.text();
				switch (value) {
				case '=':
					self._evaluate();
					break;
				case 'C':
					input.text(0);
					break;
				case 'Del':
					self._delete();
					break;
				default:
					self._input(value);
					break;
				}
				self._animateButton(target);
			});
			if (this.options.documentKeyboard) {
				$(document).on("keydown", function (event) {
					self._handleKeydown(event);
				});
			}
		},
		_allowedKeys: {
			"8": "Del",
			"13": "=",
			"46": "C",
			"48": "0",
			"49": "1",
			"50": "2",
			"51": "3",
			"52": "4",
			"53": "5",
			"54": "6",
			"55": "7",
			"56": "8",
			"57": "9",
			"96": "0",
			"97": "1",
			"98": "2",
			"99": "3",
			"100": "4",
			"101": "5",
			"102": "6",
			"103": "7",
			"104": "8",
			"105": "9",
			"106": "*",
			"107": "+",
			"109": "-",
			"110": ".",
			"111": "/",
			"190": "."
		},
		_handleKeydown: function (event) {
			if (!(event.keyCode in this._allowedKeys)) {
				return false;
			}
			var character = this._allowedKeys[event.keyCode];
			this._animateButton(this.element.find("tbody td:contains(" + character + ")"));
			switch (event.keyCode) {
			case 8:
				this._delete();
				break;
			case 13:
				this._evaluate();
				break;
			case 46:
				this.element.find('.' + this._css.displayValue).text(0);
				break;
			default:
				this._input(character);
				break;
			}
		},
		_evaluate: function () {
			var input = this.element.find('.' + this._css.displayValue),
				value = input.text(),
				result;
			this._clear = true;
			this._parser.setExpression(value);
			try {
				result = this._parser.evaluate();
			} catch (e) {
				result = "ERROR!";
			}
			if (isNaN(result)) {
				result = "ERROR!";
			}
			input.text(result);
		},
		_delete: function () {
			var input = this.element.find('.' + this._css.displayValue),
				val = input.text();
			if (val.length === 1) {
				val = '0';
				input.text(0);
			}
			if (val !== '0') {
				input.text(val.substring(0, val.length - 1));
			}
		},
		_input: function (value) {
			var input = this.element.find('.' + this._css.displayValue),
				val = input.text();
			switch (value) {
			case "+":
			case "-":
			case "*":
			case "/":
				this._clear = false;
				break;
			}
			if ((val !== "." && val === "0") || this._clear) {
				this._clear = false;
				input.text(value);
			} else {
				input.text(val + value);
			}
		},
		_animateButton: function (target) {
			target.stop(true, true).animate({"background-color": "#FFC500"}, 150, function () {
				target.animate({"background-color": "#FFF"}, 150);
			});
		},
		_destroy: function() {
			this.element.off();
			this.element.empty();
		}
	});
}(jQuery));