interface Array<T> {
    top(): T;
}
declare module Epsilon {
    class ExpressionTree {
        pointer: any;
        left: ExpressionTree;
        right: ExpressionTree;
        operator: string;
        constructor(token: any);
        constructor(token: any, left: ExpressionTree);
        constructor(token: any, left?: ExpressionTree);
        constructor(token: any, left: ExpressionTree, right?: ExpressionTree);
        evaluate(): number;
        value(): number;
        getDomVal(): number;
        getElementValue(el: HTMLElement): number;
    }
    class ExpressionParser {
        expr: string;
        expression: string;
        operatorStack: string[];
        valueStack: ExpressionTree[];
        constructor(expr?: string);
        parse(): void;
        isOperator(token?: string): boolean;
        isValueFragment(token?: string): boolean;
        value(): number;
        evaluate(e?: string): number;
        setExpression(e: string): void;
    }
    function epsilon(els?: any): void;
}
