<script>
	export let block;
</script>

{#each block as token}
	{#if token.type === 'var'}
		<p>var: {token.id}</p>
	{:else if token.type === 'bind'}
		<p>bind: {token.id}</p>
	{:else if token.type === 'apply'}
		<p>apply:</p>
	{:else if token.type === 'inject'}
		<p>inject:</p>
	{/if}
{/each}
