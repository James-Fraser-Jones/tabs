import { type Token, Keyword, TokenKind, type error, TermKind, type Term } from './types';
import { print } from './utils';

function makeTerms(
	[token, ...tokens]: Token[],
	scope?: TermKind
): { terms: Term[]; tokens: Token[] } | error {
	let terms: Term[] = [];
	let bind = false;
	while (token) {
		switch (token.kind) {
			case TokenKind.Keyword:
				switch (token.value) {
					case Keyword.OpenBrace:
					case Keyword.OpenAngle:
						if (bind) {
							return `Term - Binder missing an identifier`;
						}
						const openBrace = token.value === Keyword.OpenBrace;
						const result = makeTerms(tokens, openBrace ? TermKind.Apply : TermKind.Inject);
						if (typeof result === 'string') {
							return result;
						} else {
							terms.push({
								kind: openBrace ? TermKind.Apply : TermKind.Inject,
								value: result.terms
							});
							tokens = result.tokens;
						}
						break;
					case Keyword.CloseBrace:
					case Keyword.CloseAngle:
						const closeBrace = token.value === Keyword.CloseBrace;
						if (scope === (closeBrace ? TermKind.Apply : TermKind.Inject)) {
							return { terms, tokens };
						} else {
							return `Term - Unexpected closing brace: ${token.value}`;
						}
					case Keyword.Lambda:
						if (bind) {
							return `Term - Binder missing an identifier`;
						}
						bind = true;
						break;
				}
			case TokenKind.Whitespace:
				//do nothing, for now
				break;
			case TokenKind.Identifier:
				terms.push({ kind: bind ? TermKind.Bind : TermKind.Var, value: token.value });
				bind = false;
				break;
		}
		[token, ...tokens] = tokens;
	}
	return { terms, tokens };
}

export function termize(tokens: Token[]): Term[] | error {
	const result = makeTerms(tokens);
	if (typeof result === 'string') {
		return result;
	} else if (result.tokens.length > 0) {
		return `Term - Extraneous tokens: ${print(result.tokens)}`;
	} else {
		return result.terms;
	}
}
