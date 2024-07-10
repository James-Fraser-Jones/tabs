<script>
	import { io } from '../lib/main';
	import Expr from './expr.svelte';
	export let input;
	const result = io(input);
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
	{:else}
		<Expr expr={result} />
	{/if}
</div>
