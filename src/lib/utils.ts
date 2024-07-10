export function print(ob: object) {
	return JSON.stringify(ob, null, 2);
}

export function strip(block: string): string {
	return block
		.trimEnd()
		.split('\n')
		.map((line) => line.trimEnd())
		.join('\n');
}
