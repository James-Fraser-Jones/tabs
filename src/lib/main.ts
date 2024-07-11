import { parseTokens } from './token';
import { parseTerms } from './term';
import { strip } from './utils';
import { parseExpr } from './expr';
import { type Expr, type error } from './types';

export function parse(input: string): Expr | error {
	const stripped = strip(input);
	const tokens = parseTokens(stripped);
	const terms = parseTerms(tokens);
	if (typeof terms === 'string') {
		return terms;
	} else {
		return parseExpr(terms);
	}
}
