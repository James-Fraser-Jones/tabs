import { tokenize } from './tokenizer';
import { termize } from './termer';
import { strip, print } from './utils';
import { expresserize } from './expresser';

export function io(block: string): string {
	const stripped = strip(block);
	const tokens = tokenize(stripped);
	const terms = termize(tokens);
	if (typeof terms === 'string') {
		return terms;
	} else {
		const expr = expresserize(terms);
		if (typeof expr === 'string') {
			return expr;
		} else {
			return print(expr);
		}
	}
}
