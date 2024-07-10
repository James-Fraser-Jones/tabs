import { TokenKind, type Token, keyword, type Keyword, whitespace } from './types';

function makeToken(char: string): Token {
	if (keyword.includes(char)) {
		return { kind: TokenKind.Keyword, value: char as Keyword };
	} else if (whitespace.includes(char)) {
		return { kind: TokenKind.Whitespace, value: char };
	} else {
		return { kind: TokenKind.Identifier, value: char };
	}
}

function mergeTokens(token1: Token, token2: Token): Token | undefined {
	if (token1.kind === TokenKind.Whitespace && token2.kind === TokenKind.Whitespace) {
		return { kind: TokenKind.Whitespace, value: token1.value.concat(token2.value) };
	} else if (token1.kind === TokenKind.Identifier && token2.kind === TokenKind.Identifier) {
		return { kind: TokenKind.Identifier, value: token1.value.concat(token2.value) };
	}
	return;
}

function mergeAllTokens(tokens: Token[]): Token[] {
	if (tokens.length < 2) {
		return tokens;
	} else {
		const [x, y, ...tail] = tokens;
		const mergedToken = mergeTokens(x, y);
		if (mergedToken) {
			return mergeAllTokens([mergedToken, ...tail]);
		} else {
			return [x, ...mergeAllTokens([y, ...tail])];
		}
	}
}

export function tokenize(block: string): Token[] {
	return mergeAllTokens([...block].map(makeToken));
}
