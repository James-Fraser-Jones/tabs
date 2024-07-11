import { TermKind, type Expr, type Reduction } from './types';

function sub(id: string, arg: Expr, body: Expr): Expr {
	switch (body.kind) {
		case TermKind.Var:
			if (id === body.value) {
				return structuredClone(arg);
			}
			break;
		case TermKind.Bind: //non-capture-avoiding
			if (id !== body.value) {
				body.context = sub(id, arg, body.context);
			}
			break;
		case TermKind.Apply:
		case TermKind.Inject:
			body.context = sub(id, arg, body.context);
			body.value = sub(id, arg, body.value);
			break;
	}
	return body;
}

function reduceNormal(expr: Expr): Expr | undefined {
	switch (expr.kind) {
		case TermKind.Bind:
			const normalContext = reduceNormal(expr.context);
			if (normalContext) {
				expr.context = normalContext;
				return expr;
			}
			break;
		case TermKind.Apply:
			if (expr.context.kind === TermKind.Bind) {
				return sub(expr.context.value, expr.value, expr.context.context);
			} else {
				const normalContext = reduceNormal(expr.context);
				if (normalContext) {
					expr.context = normalContext;
					return expr;
				}
				const normalValue = reduceNormal(expr.value);
				if (normalValue) {
					expr.value = normalValue;
					return expr;
				}
			}
			break;
		case TermKind.Inject:
			if (expr.value.kind === TermKind.Bind) {
				return sub(expr.value.value, expr.context, expr.value.context);
			} else {
				const normalValue = reduceNormal(expr.value);
				if (normalValue) {
					expr.value = normalValue;
					return expr;
				}
				const normalContext = reduceNormal(expr.context);
				if (normalContext) {
					expr.context = normalContext;
					return expr;
				}
			}
			break;
	}
}

export function calculateReduction(expr: Expr, steps: number = 100): Reduction {
	if (steps === 0) {
		return [expr];
	}
	const next = reduceNormal(structuredClone(expr));
	if (!next) {
		return [expr];
	}
	return [expr].concat(calculateReduction(next, steps - 1));
}
