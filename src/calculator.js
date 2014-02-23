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
			calculator: "ui-calculator",
			displayValue: "calc-display-value"
		},
		options: {
			focused: true
		},
		_create: function() {
			this._render();
			this._attachEvents();
			this.element.addClass(this._css.calculator);
			if (this.options.focused) {
				this.element.find(this._css.displayValue).focus();
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
				case '.':
					input.val(val + value);
					break;
				case 'Del':
					if (val !== '0') {
						input.val(val.substring(0, val.length - 1));
					}
					break;
				default:
					if (input.val() === '0') {
						input.val(value);
					} else {
						input.val(val + value);
					}
					break;
				}
				target.animate({"background-color": "#AFEEEE"}, 150, function () {
					target.animate({"background-color": "#FFF"}, 150);
				});
			});
			this.element.on("mouseover", "td", function () {
				var target = $(this);
				if (target.text() !== '') {
					target.animate({"border-color": "#FFA500"}, 150);
				}
			});
			this.element.on("mouseout", "td", function () {
				var target = $(this);
				if (target.text() !== '') {
					target.animate({"border-color": "#DDCCDD"}, 150);
				}
			});
		},
		_evaluate: function () {
			var input = this.element.find('.' + this._css.displayValue),
				value = input.val(),
				parser = new ExpressionParser(value);
			input.val(parser.evaluate());
		},
		_destroy: function() {
			this.element.off();
			this.element.empty();
		}
	});
}(jQuery));