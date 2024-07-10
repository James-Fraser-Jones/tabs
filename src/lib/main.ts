import { tokenize } from './tokenizer';
import { termize } from './termer';
import { strip } from './utils';
import { expresserize } from './expresser';
import { type Expr } from './types';

export function io(input: string): Expr | string {
	const stripped = strip(input);
	const tokens = tokenize(stripped);
	const terms = termize(tokens);
	if (typeof terms === 'string') {
		return terms;
	} else {
		return expresserize(terms);
	}
}
