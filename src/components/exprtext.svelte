<script>
	import { printExpr } from '$lib/expr';
	export let expr;
</script>

<pre
	class="
    selection:text-indigo-100
	text-wrap">{printExpr(expr)}</pre>
