import { type Token, Keyword, TokenKind, type error, TermKind, type Term } from './types';
import { printObject } from './utils';

function parseTermsScope(
	[token, ...tokens]: Token[],
	scope?: TermKind
): { terms: Term[]; tokens: Token[] } | error {
	let terms: Term[] = [];
	let bind = false;
	while (token) {
		switch (token.kind) {
			case TokenKind.Keyword:
				if (bind) {
					return `Term - Binder missing an identifier`;
				}
				switch (token.value) {
					case Keyword.OpenBrace:
					case Keyword.OpenAngle:
						const openBrace = token.value === Keyword.OpenBrace;
						const result = parseTermsScope(tokens, openBrace ? TermKind.Apply : TermKind.Inject);
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
						if (scope !== (closeBrace ? TermKind.Apply : TermKind.Inject)) {
							return `Term - Unexpected closing brace: ${token.value}`;
						} else {
							return { terms, tokens };
						}
					case Keyword.Lambda:
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
	if (bind) {
		return `Term - Binder missing an identifier`;
	}
	if (scope !== undefined) {
		return `Term - Expected closing brace ${scope == TermKind.Apply ? ')' : '>'}`;
	} else {
		return { terms, tokens };
	}
}

export function parseTerms(tokens: Token[]): Term[] | error {
	const result = parseTermsScope(tokens);
	if (typeof result === 'string') {
		return result;
	} else if (result.tokens.length > 0) {
		return `Term - Extraneous tokens: ${printObject(result.tokens)}`;
	} else {
		return result.terms;
	}
}
