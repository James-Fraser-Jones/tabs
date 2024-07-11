import { TokenKind, type Token, keyword, type Keyword, whitespace } from './types';

function parseTokenChar(char: string): Token {
	if (keyword.includes(char)) {
		return { kind: TokenKind.Keyword, value: char as Keyword };
	} else if (whitespace.includes(char)) {
		return { kind: TokenKind.Whitespace, value: char };
	} else {
		return { kind: TokenKind.Identifier, value: char };
	}
}

function mergeTokenPair(token1: Token, token2: Token): Token | undefined {
	if (token1.kind === TokenKind.Whitespace && token2.kind === TokenKind.Whitespace) {
		return { kind: TokenKind.Whitespace, value: token1.value.concat(token2.value) };
	} else if (token1.kind === TokenKind.Identifier && token2.kind === TokenKind.Identifier) {
		return { kind: TokenKind.Identifier, value: token1.value.concat(token2.value) };
	}
	return;
}

function mergeTokens(tokens: Token[]): Token[] {
	if (tokens.length < 2) {
		return tokens;
	} else {
		const [x, y, ...tail] = tokens;
		const mergedToken = mergeTokenPair(x, y);
		if (mergedToken) {
			return mergeTokens([mergedToken, ...tail]);
		} else {
			return [x, ...mergeTokens([y, ...tail])];
		}
	}
}

export function parseTokens(input: string): Token[] {
	return mergeTokens([...input].map(parseTokenChar));
}
