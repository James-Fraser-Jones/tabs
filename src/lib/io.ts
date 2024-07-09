import { parse } from 'cookie';

export function io(input: string): string {
	try {
		const result = parseBlock([...input], undefined);
		return `${JSON.stringify(result, null, 2)}`;
	} catch (error) {
		return `${error}`;
	}
}

function parseBlock(
	[head, ...tail]: string[],
	delimiter: string | undefined
): { block: Block<string>; tail: string[] } {
	let bind = false;
	let block: Block<string> = [];
	let id = '';
	while (head) {
		if (head === 'λ') {
			if (id !== '') {
				block.push({ type: bind ? 'bind' : 'var', id });
				id = '';
			} else {
				throw new Error(`Attempted to bind with no body. Or no binder name.`);
			}
			bind = true;
		} else if (['<', '>', '(', ')'].includes(head)) {
			if (id !== '') {
				block.push({ type: bind ? 'bind' : 'var', id });
				id = '';
			}
			if (['<', '('].includes(head)) {
				try {
					let { block: b, tail: t } = parseBlock(tail, head === '(' ? ')' : '>');
					block.push({ type: head === '(' ? 'apply' : 'inject', block: b });
					tail = t;
				} catch (error) {
					throw error;
				}
			} else {
				if (delimiter === head) {
					return { block, tail };
				} else {
					throw new Error(`Unexpected closing brace: ${head}`);
				}
			}
		} else {
			id += head;
		}
		[head, ...tail] = tail;
	}
	if (id !== '') {
		block.push({ type: bind ? 'bind' : 'var', id });
		id = '';
	}
	if (delimiter === undefined) {
		return { block, tail };
	} else {
		throw new Error(`Expected closing brace: ${delimiter === '>' ? '>' : ')'}`);
	}
}

type Block<T> = Token<T>[];
type Token<T> =
	| { type: 'var'; id: T }
	| { type: 'bind'; id: T }
	| { type: 'apply'; block: Block<T> }
	| { type: 'inject'; block: Block<T> };

type Expr<T> =
	| { type: 'var'; id: T }
	| { type: 'bind'; context: Expr<T>; id: T }
	| { type: 'apply'; context: Expr<T>; arg: Expr<T> }
	| { type: 'inject'; context: Expr<T>; fun: Expr<T> };
