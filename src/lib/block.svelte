<script>
	export let result;
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
		{#each result as token}
			{#if token.type === 'var'}
				<p>var: {token.id}</p>
			{:else if token.type === 'bind'}
				<p>bind: {token.id}</p>
			{:else if token.type === 'apply'}
				<p>apply:</p>
				<svelte:self result={token.block} />
			{:else if token.type === 'inject'}
				<p>inject:</p>
				<svelte:self result={token.block} />
			{/if}
		{/each}
	{/if}
</div>
