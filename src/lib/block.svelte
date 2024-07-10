<script>
	import { io } from './main';
	import { TermKind } from './types';
	export let input;
	$: result = io(input);
</script>

<div
	class="border-2
			border-indigo-900
			rounded-lg
			p-4
			"
>
	{#if typeof result === 'string'}
		<p>Error: {result}</p>
	{:else if result.kind === TermKind.Var}
		<p>{result.value}</p>
	{:else if result.kind === TermKind.Bind}
		<svelte:self result={result.context} />
		<p>λ{result.value}</p>
	{:else if result.kind === TermKind.Apply}
		<svelte:self result={result.context} />
		<svelte:self result={result.value} />
	{:else if result.kind === TermKind.Inject}
		<svelte:self result={result.context} />
		<svelte:self result={result.value} />
	{/if}
</div>
