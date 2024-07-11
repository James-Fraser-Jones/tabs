<script>
	import Reduction from './reduction.svelte';
	import { calculateReduction } from '$lib/reduction';
	export let expr;
</script>

<Reduction reduction={calculateReduction(expr)} />
