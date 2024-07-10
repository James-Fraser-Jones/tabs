export type Expr =
	| { kind: TermKind.Var; value: string }
	| { kind: TermKind.Bind; context: Expr; value: string }
	| { kind: TermKind.Apply; context: Expr; value: Expr }
	| { kind: TermKind.Inject; context: Expr; value: Expr };

//===========================================================================

export enum TermKind {
	Var = 'VAR',
	Bind = 'BIND',
	Apply = 'APPLY',
	Inject = 'INJECT'
}
export type Term =
	| { kind: TermKind.Var; value: string }
	| { kind: TermKind.Bind; value: string }
	| { kind: TermKind.Apply; value: Term[] }
	| { kind: TermKind.Inject; value: Term[] };

//===========================================================================

export type Token =
	| { kind: TokenKind.Keyword; value: Keyword }
	| { kind: TokenKind.Whitespace; value: string }
	| { kind: TokenKind.Identifier; value: string };
export enum TokenKind {
	Keyword = 'KEYWORD',
	Whitespace = 'WHITESPACE',
	Identifier = 'IDENTIFIER'
}

export enum Keyword {
	OpenBrace = '(',
	CloseBrace = ')',
	OpenAngle = '<',
	CloseAngle = '>',
	Lambda = 'λ'
}
export const keyword = Object.values(Keyword).map((name) => name.toString());

export enum Whitespace {
	Space = ' ',
	Newline = '\n'
}
export const whitespace = Object.values(Whitespace).map((name) => name.toString());

//===========================================================================

export type error = string;
