import { TermKind, type Expr, type Reduction } from './types';

function sub(id: string, arg: Expr, body: Expr): Expr {
	switch (body.kind) {
		case TermKind.Var:
			if (id === body.value) {
				return arg;
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

function beta(expr: Expr): Expr | undefined {
	switch (expr.kind) {
		case TermKind.Apply:
		case TermKind.Inject:
			const fun = expr.kind === TermKind.Apply ? expr.context : expr.value;
			if (fun.kind === TermKind.Bind) {
				const arg = expr.kind === TermKind.Apply ? expr.value : expr.context;
				return sub(fun.value, arg, fun.context);
			}
	}
	return;
}

function normal_step(e: Expr): Expr | undefined {
	const expr = structuredClone(e);
	const top = beta(expr);
	if (top) {
		return top;
	} else {
		switch (expr.kind) {
			case TermKind.Bind:
				const body = beta(expr.context);
				if (body) {
					expr.context = body;
					return expr;
				}
				break;
			case TermKind.Apply:
				const apLeft = beta(expr.context);
				if (apLeft) {
					expr.context = apLeft;
					return expr;
				}
				const apRight = beta(expr.value);
				if (apRight) {
					expr.value = apRight;
					return expr;
				}
				break;
			case TermKind.Inject:
				const inRight = beta(expr.value);
				if (inRight) {
					expr.value = inRight;
					return expr;
				}
				const inLeft = beta(expr.context);
				if (inLeft) {
					expr.context = inLeft;
					return expr;
				}
				break;
		}
	}
	return;
}

export function normal(expr: Expr, steps: number = 10): Expr {
	if (steps === 0) {
		return expr;
	}
	const next = normal_step(expr);
	if (!next) {
		return expr;
	}
	return normal(next, steps - 1);
}

export function reduce(expr: Expr, steps: number = 10): Reduction {
	if (steps === 0) {
		return [expr];
	}
	const next = normal_step(expr);
	if (!next) {
		return [expr];
	}
	return [expr].concat(reduce(next, steps - 1));
}
