// type Grammar<N, T> = {
// 	P: Map<{ left: String<N, T>; mid: N; right: String<N, T> }, Set<String<N, T>>>;
// 	S: N;
// };
// const ε: String<any, any> = [];
// type String<N, T> = Symbol<N, T>[];
// enum SymbolKind {
// 	Terminal = 'TERMINAL',
// 	NonTerminal = 'NONTERMINAL'
// }
// type Symbol<N, T> =
// 	| { kind: SymbolKind.Terminal; value: T }
// 	| { kind: SymbolKind.NonTerminal; value: N };

type CFG = {
	start: string;
	rules: Map<string, Set<{ symbol: string; terminal: boolean }[]>>;
};

export function printCFG(cfg: CFG): string {
	return `(${cfg.start.toUpperCase()})\n${Array.from(cfg.rules)
		.map(
			([k, v]) =>
				`${k.toUpperCase()} -> ${Array.from(v)
					.map((str) => str.map((c) => (c.terminal ? c.symbol : c.symbol.toUpperCase())).join(''))
					.join(' | ')};`
		)
		.join('\n')}`;
}

export const example: CFG = {
	start: 's',
	rules: new Map([
		[
			's',
			new Set([
				[
					{ symbol: 'a', terminal: false },
					{ symbol: 'b', terminal: false }
				],
				[
					{ symbol: 'b', terminal: false },
					{ symbol: 'c', terminal: false }
				]
			])
		],
		[
			'a',
			new Set([
				[
					{ symbol: 'b', terminal: false },
					{ symbol: 'a', terminal: false }
				],
				[{ symbol: 'a', terminal: true }]
			])
		],
		[
			'b',
			new Set([
				[
					{ symbol: 'c', terminal: false },
					{ symbol: 'c', terminal: false }
				],
				[{ symbol: 'b', terminal: true }]
			])
		],
		[
			'c',
			new Set([
				[
					{ symbol: 'a', terminal: false },
					{ symbol: 'b', terminal: false }
				],
				[{ symbol: 'a', terminal: true }]
			])
		]
	])
};

//convert context free grammar to chomsky normal form
function toCNF(cfg: CFG): CFG {
	return cfg;
}

function start(cfg: CFG): CFG {
	return cfg;
}

function term(cfg: CFG): CFG {
	return cfg;
}

function bin(cfg: CFG): CFG {
	return cfg;
}

function del(cfg: CFG): CFG {
	return cfg;
}

function unit(cfg: CFG): CFG {
	return cfg;
}
