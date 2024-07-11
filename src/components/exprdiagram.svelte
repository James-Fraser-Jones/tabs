<script>
	import { TermKind } from '../lib/types';
	export let expr;
</script>

<div
	class="
	border
	border-indigo-900
	rounded-lg
	p-2
	flex
	flex-col
	items-center
	gap-1
	{expr.kind === TermKind.Var ? 'bg-red-100' : ''}
	{expr.kind === TermKind.Bind ? 'bg-green-100' : ''}
	{expr.kind === TermKind.Apply ? 'bg-blue-100' : ''}
	{expr.kind === TermKind.Inject ? 'bg-yellow-100' : ''}
	"
>
	{#if expr.kind === TermKind.Var}
		<span>{expr.value}</span>
	{:else if expr.kind === TermKind.Bind}
		<svelte:self expr={expr.context} />
		<!-- <span>λ {expr.value}</span> -->
		<span>{expr.value}</span>
	{:else if expr.kind === TermKind.Apply}
		<svelte:self expr={expr.context} />
		<!-- <span>{'(,)'}</span> -->
		<svelte:self expr={expr.value} />
	{:else if expr.kind === TermKind.Inject}
		<svelte:self expr={expr.context} />
		<!-- <span>{'<,>'}</span> -->
		<svelte:self expr={expr.value} />
	{/if}
</div>
