<script>
	import Reduction from './reduction.svelte';
	import { reduce } from '$lib/reduction';
	export let expr;
</script>

<Reduction reduction={reduce(expr)} />
