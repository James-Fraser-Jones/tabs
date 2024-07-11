<script>
	import ReductionAll from './reductionAll.svelte';
	import Reduction from './reduction.svelte';
	import { calculateReduction } from '$lib/reduction';
	export let expr;
</script>

<Reduction reduction={calculateReduction(expr)} />
