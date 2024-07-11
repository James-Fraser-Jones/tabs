<script>
	import Exprdiagram from './exprdiagram.svelte';
	import Exprtext from './exprtext.svelte';
	export let reduction;
	let index = 0;
</script>

<div class="flex flex-col gap-2">
	<div class="flex text-bold text-2xl gap-2 bg-indigo-300 p-4">
		<span>Iteration:</span>
		<span
			class="bg-indigo-200
            border
            border-indigo-900
            rounded-lg
            w-20
            text-center
            ">{index}</span
		>
		<span class="grow"></span>
		<button
			disabled={index === 0}
			on:click={() => {
				index -= 1;
				index = Math.max(index, 0);
			}}
			class="
            bg-indigo-200
            border-2
            border-indigo-900
            rounded-lg
            w-20
            drop-shadow-lg
            enabled:hover:drop-shadow-xl
            enabled:active:bg-indigo-300
            enabled:active:drop-shadow-none
			disabled:drop-shadow-none
			disabled:border-indigo-300
			disabled:text-indigo-400
            ">{'<'}</button
		>
		<button
			disabled={index === reduction.length - 1}
			on:click={() => {
				index += 1;
				index = Math.min(index, reduction.length - 1);
			}}
			class="
            bg-indigo-200
            border-2
            border-indigo-900
            rounded-lg
            w-20
            drop-shadow-lg
            enabled:hover:drop-shadow-xl
            enabled:active:bg-indigo-300
            enabled:active:drop-shadow-none
			disabled:drop-shadow-none
			disabled:border-indigo-300
			disabled:text-indigo-400
            ">{'>'}</button
		>
	</div>
	<div class="p-4 flex justify-start">
		<Exprdiagram expr={reduction[index]} />
	</div>
</div>
