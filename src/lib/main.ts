import { tokenize } from './tokenizer';
import { termize } from './termer';
import { strip } from './utils';
import { expresserize, showExpression } from './expresser';
import { type Expr } from './types';
import { normalise } from './evaluator';

export function io(input: string): Expr | string {
	const stripped = strip(input);
	const tokens = tokenize(stripped);
	const terms = termize(tokens);
	if (typeof terms === 'string') {
		return terms;
	} else {
		const expr = expresserize(terms);
		if (typeof expr === 'string') {
			return expr;
		} else {
			return normalise(expr, 100);
		}
	}
}

export function ioError(input: string): string {
	const result = io(input);
	if (typeof result === 'string') {
		return result;
	} else {
		return showExpression(result);
	}
}
