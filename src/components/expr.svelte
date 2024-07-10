<script>
	import { TermKind } from '../lib/types';
	export let expr;
</script>

<div
	class="border-2
			border-indigo-900
			rounded-lg
			p-4
			"
>
	{#if expr.kind === TermKind.Var}
		<p>{expr.value}</p>
	{:else if expr.kind === TermKind.Bind}
		<svelte:self expr={expr.context} />
		<p>λ{expr.value}</p>
	{:else if expr.kind === TermKind.Apply}
		<svelte:self result={expr.context} />
		<svelte:self result={expr.value} />
	{:else if expr.kind === TermKind.Inject}
		<svelte:self result={expr.context} />
		<svelte:self result={expr.value} />
	{/if}
</div>
