import { tokenize } from './tokenizer';
import { termize } from './termer';
import { strip } from './utils';
import { expresserize } from './expresser';
import { type Expr } from './types';
import { print } from './utils';

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

export function ioError(input: string): string {
	const result = io(input);
	if (typeof result === 'string') {
		return result;
	} else {
		return print(result);
	}
}
