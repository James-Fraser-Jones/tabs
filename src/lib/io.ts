export function parseExpr(input: string): string {
	const result = parseTop(input);
	if (typeof result === 'string') {
		return result;
	} else {
		const result2 = blockToExpr(result);
		if (typeof result2 === 'string') {
			return result2;
		} else {
			return JSON.stringify(result2, null, 2);
		}
	}
}

function blockToExpr<T>(block: Block<T>): Expr<T> | string {
	if (block.length === 0) {
		return 'Empty block';
	} else {
		let [head, ...tail] = [...block].reverse(); //TODO: fix this
		let contextResult;
		switch (head.type) {
			case 'var':
				if (tail.length === 0) {
					return { type: 'var', id: head.id };
				} else {
					return `Open var, ${head.id}, with extraneous context, ${JSON.stringify(tail, null, 2)}`;
				}
			case 'bind':
				contextResult = blockToExpr(tail);
				if (typeof contextResult === 'string') {
					return contextResult;
				}
				return { type: 'bind', context: contextResult, id: head.id };
			case 'apply':
				contextResult = blockToExpr(tail);
				if (typeof contextResult === 'string') {
					return contextResult;
				}
				let argResult = blockToExpr(head.block);
				if (typeof argResult === 'string') {
					return argResult;
				}
				return { type: 'apply', context: contextResult, arg: argResult };
			case 'inject':
				contextResult = blockToExpr(tail);
				if (typeof contextResult === 'string') {
					return contextResult;
				}
				let funResult = blockToExpr(head.block);
				if (typeof funResult === 'string') {
					return funResult;
				}
				return { type: 'inject', context: contextResult, fun: funResult };
		}
	}
}

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

type Expr<T> =
	| { type: 'var'; id: T }
	| { type: 'bind'; context: Expr<T>; id: T }
	| { type: 'apply'; context: Expr<T>; arg: Expr<T> }
	| { type: 'inject'; context: Expr<T>; fun: Expr<T> };
