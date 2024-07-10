<script>
	import { io, ioError } from '$lib/main';
	import Main from '../components/main.svelte';
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
	<h1 class="text-4xl flex-none font-bold">λ with tabs!</h1>
	<div class="flex-1 relative">
		<div
			class="
			absolute
			inset-0
			overflow-auto
			border-2
			border-indigo-900
			rounded-lg
			"
		>
			<div
				class="
				flex
				gap-4
				min-h-full
				"
			>
				<textarea
					bind:value={input}
					placeholder="λ code goes in"
					class="
					flex-1
					bg-indigo-100
					selection:text-indigo-100
					p-4
					rounded-lg
					
					overflow-hidden
					outline-none
					resize-none
					placeholder:text-indigo-200
					"
				></textarea>
				<!-- <div
					class="
					flex-1
					bg-indigo-100
					selection:text-indigo-100
					p-4
					rounded-lg
					flex
					justify-start
					items-start
					"
				>
					<Main {input} />
				</div> -->
				<pre
					class="
					flex-1
					bg-indigo-100
					selection:text-indigo-100
					p-4
					rounded-lg

					text-wrap
					{input ? '' : 'text-indigo-200'}
					">{input ? ioError(input) : 'λ code comes out'}</pre>
			</div>
		</div>
	</div>
</div>
