import {
	type Token,
	Keyword,
	TokenKind,
	type error,
	ScopeKind,
	type Scope,
	ElemKind,
	type Elem
} from './types';
import { print } from './utils';

function makeScope(
	[token, ...tokens]: Token[],
	kind: ScopeKind
): { scope: Scope; tokens: Token[] } | error {
	let scope: Scope = { kind, value: [] };
	let bind = false;
	while (token) {
		switch (token.kind) {
			case TokenKind.Keyword:
				switch (token.value) {
					case Keyword.OpenBrace:
					case Keyword.OpenAngle:
						if (bind) {
							return 'Binder missing an identifier';
						}
						const openBrace = token.value === Keyword.OpenBrace;
						const result = makeScope(tokens, openBrace ? ScopeKind.Apply : ScopeKind.Inject);
						if (typeof result === 'string') {
							return result;
						} else {
							scope.value.push({
								kind: openBrace ? ElemKind.Apply : ElemKind.Inject,
								value: result.scope
							});
							tokens = result.tokens;
						}
						break;
					case Keyword.CloseBrace:
					case Keyword.CloseAngle:
						const closeBrace = token.value === Keyword.CloseBrace;
						if (kind === (closeBrace ? ScopeKind.Apply : ScopeKind.Inject)) {
							return { scope, tokens };
						} else {
							return `Unexpected closing brace: ${token.value}`;
						}
					case Keyword.Lambda:
						bind = true;
						break;
				}
			case TokenKind.Whitespace:
				//do nothing, for now
				break;
			case TokenKind.Identifier:
				scope.value.push({ kind: bind ? ElemKind.Bind : ElemKind.Var, value: token.value });
				bind = false;
				break;
		}
		[token, ...tokens] = tokens;
	}
	return { scope, tokens };
}

export function scopenize(tokens: Token[]): Scope | error {
	const result = makeScope(tokens, ScopeKind.Top);
	if (typeof result === 'string') {
		return result;
	} else if (result.tokens.length > 0) {
		return `Extraneous tokens: ${print(result.tokens)}`;
	} else {
		return result.scope;
	}
}
