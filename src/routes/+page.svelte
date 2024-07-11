<script>
	import Main from '../components/main.svelte';
	import { tick } from 'svelte';

	async function handleKeydown(event) {
		if (event.key !== '\\') return;
		event.preventDefault();
		const { selectionStart, selectionEnd } = this;
		input = input.slice(0, selectionStart) + 'λ' + input.slice(selectionEnd);
		await tick();
		this.selectionStart = selectionStart + 1;
		this.selectionEnd = selectionStart + 1;
	}

	let input = `2 <+> (3)

λ3 (
    2 <+1>
)

λ2 (
    0 <+1> <+1>
)

λ+ (
    n
    (+1)
    (m)
    λm λn
)

λ+1 (
    n
    (s)
    (z)
    <s>
    λz λs λn
)

λ0 (
    z
    λz λs
)`;
</script>

<div
	class="
	bg-indigo-50
	selection:text-indigo-50
	h-screen
	w-screen
	p-4
	break-all

	text-md
	font-mono
	text-indigo-900
	selection:bg-indigo-600

	flex
	flex-col
	gap-4
	"
>
	<div class="flex-none flex gap-4">
		<h1 class="text-4xl grow font-bold">λ with tabs!</h1>
	</div>
	<div class="flex-1 relative">
		<div
			class="
			absolute
			inset-0
			overflow-y-scroll
			border-2
			border-indigo-900
			rounded-lg
			"
		>
			<div
				class="
				flex
				min-h-full
				"
			>
				<textarea
					bind:value={input}
					on:keydown={handleKeydown}
					placeholder="λ code goes in"
					class="
					flex-1
					bg-indigo-100
					selection:text-indigo-100
					border-indigo-900

					border-r-1
					p-4
					overflow-hidden
					outline-none
					resize-none
					placeholder:text-indigo-200
					"
				></textarea>
				<div
					class="
					flex-1
					bg-indigo-100
					selection:text-indigo-100
					border-indigo-900

					border-l-1
					"
				>
					<Main {input} />
				</div>
			</div>
		</div>
	</div>
</div>
