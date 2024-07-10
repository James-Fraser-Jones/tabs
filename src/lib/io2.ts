function strip(block: string): string {
	return block
		.trimEnd()
		.split('\n')
		.map((line) => line.trimEnd())
		.join('\n');
}

type Token =
	| { kind: TokenKind.Keyword; value: Keyword }
	| { kind: TokenKind.Whitespace; value: string }
	| { kind: TokenKind.Identifier; value: string };

enum TokenKind {
	Keyword = 'KEYWORD',
	Whitespace = 'WHITESPACE',
	Identifier = 'IDENTIFIER'
}

enum Keyword {
	OpenBrace = '(',
	CloseBrace = ')',
	OpenAngle = '<',
	CloseAngle = '>',
	Lambda = 'λ'
}
const keyword = Object.values(Keyword).map((name) => name.toString());

enum Whitespace {
	Space = ' ',
	Newline = '\n'
}
const whitespace = Object.values(Whitespace).map((name) => name.toString());

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
		let [x, y, ...tail] = tokens;
		let mergedToken = mergeTokens(x, y);
		if (mergedToken) {
			return mergeAllTokens([mergedToken, ...tail]);
		} else {
			return [x, ...mergeAllTokens([y, ...tail])];
		}
	}
}

export function tokenize(block: string): Token[] {
	return mergeAllTokens([...strip(block)].map(makeToken)).filter(
		(token) => token.kind !== TokenKind.Whitespace
	);
}
