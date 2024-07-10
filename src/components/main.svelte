<script>
	import { io } from '../lib/main';
	import Expr from './expr.svelte';
	export let input;
	const result = io(input);
</script>

{#if typeof result === 'string'}
	<p>Error: {result}</p>
{:else}
	<Expr expr={result} />
{/if}
