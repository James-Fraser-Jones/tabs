export enum ElemKind {
	Var = 'VAR',
	Bind = 'BIND',
	Apply = 'APPLY',
	Inject = 'INJECT'
}
export type Elem =
	| { kind: ElemKind.Var; value: string }
	| { kind: ElemKind.Bind; value: string }
	| { kind: ElemKind.Apply; value: Scope }
	| { kind: ElemKind.Inject; value: Scope };

export enum ScopeKind {
	Top = 'TOP',
	Apply = 'APPLY',
	Inject = 'INJECT'
}
export type Scope = { kind: ScopeKind; value: Elem[] };

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

export type error = string;
