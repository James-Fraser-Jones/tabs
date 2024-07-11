import { type Expr, type Term, TermKind, type error } from './types';
import { printObject, indent } from './utils';

export function parseExpr(terms: Term[]): Expr | error {
	const term = terms.pop();
	if (term) {
		switch (term.kind) {
			case TermKind.Var:
				if (terms.length > 0) {
					return `Expr - Attempted to add free variable, ${term.value}, to existing context: ${printObject(terms)}`;
				} else {
					return { kind: term.kind, value: term.value };
				}
			case TermKind.Bind:
				if (terms.length > 0) {
					const context = parseExpr(terms);
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
					const value = parseExpr(term.value);
					if (typeof value === 'string') {
						return value;
					}
					const context = parseExpr(terms);
					if (typeof context === 'string') {
						return context;
					}
					return { kind: term.kind, context, value };
				} else {
					return `Expr - Attempted to ${term.kind.toString()} with no context: ${printObject(term.value)}`;
				}
		}
	} else {
		return `Expr - Terms list is empty`;
	}
}

export function printExpr(expr: Expr): string {
	if (expr.kind === TermKind.Var) {
		return expr.value;
	} else {
		const context = `${printExpr(expr.context)}\n`;
		if (expr.kind === TermKind.Bind) {
			return `${context}λ${expr.value}`;
		} else {
			const left = expr.kind === TermKind.Apply ? '(' : '<';
			const right = expr.kind === TermKind.Apply ? ')' : '>';
			let body = printExpr(expr.value);
			if (expr.value.kind !== TermKind.Var) {
				body = `\n${indent(body)}\n`;
			}
			return `${context}${left}${body}${right}`;
		}
	}
}
