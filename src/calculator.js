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
			focused: true,
			documentKeyboard: true
		},
		_create: function() {
			this._render();
			this._attachEvents();
			this.element.addClass(this._css.calculator);
			if (this.options.focused) {
				this.element.find("." + this._css.displayValue).focus();
			}
		},
		_render: function () {
			var html = "<table><tbody>" +
				"<tr><td colspan='4'><input type='text' class='" + this._css.displayValue + "' value='0' /></td></tr>" +
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
			this.element.on("click", "td", function () {
				var target = $(this),
					value = target.text(),
					val = input.val();
				switch (value) {
				case '=':
					self._evaluate();
					break;
				case 'C':
					input.val(0);
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
				this.element.on("keydown", "." + this._css.displayValue, function (event) {
					event.preventDefault();
				});
			}
		},
		_allowedKeys: {
			"8": 8,
			"13": 13,
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
			switch (event.keyCode) {
			case 8:
				this._delete();
				this._animateButton(this.element.find("td:contains(Del)"));
				return false;
			case 13:
				this._evaluate();
				this._animateButton(this.element.find("td:contains(=)"));
				break;
			default:
				var character = this._allowedKeys[event.keyCode];
				this._input(character);
				this._animateButton(this.element.find("td:contains(" + character + ")"));
				return false;
			}
		},
		_evaluate: function () {
			var input = this.element.find('.' + this._css.displayValue),
				value = input.val(),
				parser = new ExpressionParser(value);
			input.val(parser.evaluate());
		},
		_delete: function () {
			var input = this.element.find('.' + this._css.displayValue),
				val = input.val();
			if (val !== '0') {
				input.val(val.substring(0, val.length - 1));
			}
		},
		_input: function (value) {
			var input = this.element.find('.' + this._css.displayValue),
				val = input.val();
			if (value === ".") {
				input.val(val + value);
			} else {
				if (val === '0') {
					input.val(value);
				} else {
					input.val(val + value);
				}
			}
		},
		_animateButton: function (target) {
			target.animate({"background-color": "#FFC500"}, 150, function () {
				target.animate({"background-color": "#FFF"}, 150);
			});
		},
		_destroy: function() {
			this.element.off();
			this.element.empty();
		}
	});
}(jQuery));