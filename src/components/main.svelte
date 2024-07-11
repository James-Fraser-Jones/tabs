<script>
	import { parse } from '../lib/main';
	import Expr from './expr.svelte';
	export let input;
	$: expr = parse(input);
</script>

{#if typeof expr === 'string'}
	<div class="p-4">
		<span>Error: {expr}</span>
	</div>
{:else}
	<Expr {expr} />
{/if}
