interface Array<T> {
    top(): T;
}
declare module Epsilon {
    class ExpressionTree {
        public pointer: any;
        public left: any;
        public right: any;
        public operator: any;
        constructor(token: any, left?: ExpressionTree, right?: ExpressionTree);
        public evaluate(): number;
        public value(): number;
        public getDomVal(): number;
        public getElementValue(el: HTMLElement): number;
    }
    class ExpressionParser {
        public expr: string;
        public expression: any;
        public operatorStack: any[];
        public valueStack: any[];
        constructor(expr?: string);
        public parse(): void;
        public isOperator(token?: string): boolean;
        public isValueFragment(token?: string): boolean;
        public value(): number;
        public evaluate(e?: string): number;
        public setExpression(e: string): void;
    }
    function epsilon(els?: NodeList): void;
}
