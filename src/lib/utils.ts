export function print(ob: object) {
	return JSON.stringify(ob, null, 2);
}

export function strip(input: string): string {
	return input
		.trimEnd()
		.split('\n')
		.map((line) => line.trimEnd())
		.join('\n');
}

export function indent(input: string): string {
	return input
		.split('\n')
		.map((line) => '    '.concat(line))
		.join('\n');
}
