import { tokenize } from './tokenizer';
import { scopenize } from './scoper';
import { strip, print } from './utils';

function io(block: string): string {
	const stripped = strip(block);
	const tokens = tokenize(stripped);
	const result = scopenize(tokens);
	if (typeof result === 'string') {
		return result;
	} else {
		return print(result);
	}
}
