import { type Expr, type Term, TermKind, type error } from './types';
import { print, indent } from './utils';

export function expresserize(terms: Term[]): Expr | error {
	const term = terms.pop();
	if (term) {
		switch (term.kind) {
			case TermKind.Var:
				if (terms.length > 0) {
					return `Expr - Attempted to add free variable, ${term.value}, to existing context, ${print(terms)}`;
				} else {
					return { kind: term.kind, value: term.value };
				}
			case TermKind.Bind:
				if (terms.length > 0) {
					const context = expresserize(terms);
					if (typeof context === 'string') {
						return context;
					}
					return { kind: term.kind, context, value: term.value };
				} else {
					return `Expr - Attempted to bind with no context: ${term.value}`;
				}
			case TermKind.Apply:
			case TermKind.Inject:
				if (terms.length > 0) {
					const value = expresserize(term.value);
					if (typeof value === 'string') {
						return value;
					}
					const context = expresserize(terms);
					if (typeof context === 'string') {
						return context;
					}
					return { kind: term.kind, context, value };
				} else {
					return `Expr - Attempted to ${term.kind.toString()} with no context: ${term.value}`;
				}
		}
	} else {
		return `Expr - Terms list is empty`;
	}
}

export function showExpression(expr: Expr): string {
	switch (expr.kind) {
		case TermKind.Var:
			return expr.value;
		case TermKind.Bind:
			return `${showExpression(expr.context)}\nλ${expr.value}`;
		case TermKind.Apply:
			if (expr.value.kind === TermKind.Var) {
				return `${showExpression(expr.context)}\n(${showExpression(expr.value)})`;
			} else {
				return `${showExpression(expr.context)}\n(\n${indent(showExpression(expr.value))}\n)`;
			}
		case TermKind.Inject:
			if (expr.value.kind === TermKind.Var) {
				return `${showExpression(expr.context)}\n<${showExpression(expr.value)}>`;
			} else {
				return `${showExpression(expr.context)}\n<\n${indent(showExpression(expr.value))}\n>`;
			}
	}
}
