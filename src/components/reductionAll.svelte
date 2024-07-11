<script>
	import Exprdiagram from './exprdiagram.svelte';
	export let reduction;
</script>

<div class="flex gap-2 relative w-full h-full absolute inset-0 overflow-scroll">
	{#each reduction as expr}
		<div class="p-4 flex justify-start">
			<Exprdiagram {expr} />
		</div>
	{/each}
</div>
