<script>
	import { io } from '../lib/io';

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
	p-8
	break-all

	text-2xl
	font-mono
	text-indigo-900
	selection:bg-indigo-600

	flex
	flex-col
	gap-8
	"
>
	<h1 class="text-4xl flex-none font-bold">λ with tabs!</h1>
	<div class="flex-1 relative">
		<div class="absolute inset-0 overflow-auto">
			<div class="flex gap-8">
				<textarea
					bind:value={input}
					placeholder="λ code goes in"
					class="
					flex-1
					bg-indigo-100
					selection:text-indigo-100
					p-8
					rounded-lg
					
					overflow-hidden
					border-2
					border-indigo-900
					focus:border-indigo-600
					outline-none
					resize-none
					placeholder:text-indigo-200
					"
				></textarea>
				<pre
					class="
					flex-1
					bg-indigo-100
					selection:text-indigo-100
					p-8
					rounded-lg

					text-wrap
					{input ? '' : 'text-indigo-200'}
					">{input ? io(input) : 'λ code comes out'}</pre>
			</div>
		</div>
	</div>
</div>
