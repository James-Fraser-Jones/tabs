export function parseTop(input: string): Block<string> | string {
	const filteredInput = input.replace(/\s+/g, '');
	const result = parseBlock([...filteredInput], undefined);
	if (typeof result === 'string') {
		return result;
	} else {
		return result.block;
	}
}

function parseBlock(
	[head, ...tail]: string[],
	delimiter: string | undefined
): { block: Block<string>; tail: string[] } | string {
	let bind = false;
	let block: Block<string> = [];
	let id = '';
	while (head) {
		if (head === 'λ') {
			if (id !== '') {
				block.push({ type: bind ? 'bind' : 'var', id });
				id = '';
			} else if (block.length === 0) {
				return `Attempted to bind with no body. Or no binder name.`;
			}
			bind = true;
		} else if (['<', '>', '(', ')'].includes(head)) {
			if (id !== '') {
				block.push({ type: bind ? 'bind' : 'var', id });
				id = '';
			}
			if (['<', '('].includes(head)) {
				let result = parseBlock(tail, head === '(' ? ')' : '>');
				if (typeof result === 'string') {
					return result;
				} else {
					block.push({ type: head === '(' ? 'apply' : 'inject', block: result.block });
					tail = result.tail;
				}
			} else {
				if (delimiter === head) {
					return { block, tail };
				} else {
					return `Unexpected closing brace: ${head}`;
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
		return `Expected closing brace: ${delimiter === '>' ? '>' : ')'}`;
	}
}

type Block<T> = Token<T>[];
type Token<T> =
	| { type: 'var'; id: T }
	| { type: 'bind'; id: T }
	| { type: 'apply'; block: Block<T> }
	| { type: 'inject'; block: Block<T> };

// type Expr<T> =
// 	| { type: 'var'; id: T }
// 	| { type: 'bind'; context: Expr<T>; id: T }
// 	| { type: 'apply'; context: Expr<T>; arg: Expr<T> }
// 	| { type: 'inject'; context: Expr<T>; fun: Expr<T> };
