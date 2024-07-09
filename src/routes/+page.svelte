<script>
	import { io } from '../lib/io';

	let input = '';
</script>

<div
	class="
	bg-indigo-50
	selection:text-indigo-50
	h-screen
	w-screen
	p-8

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
	<div class="h-0 grow flex gap-8">
		<textarea
			bind:value={input}
			placeholder="λ code goes in"
			class="
			bg-indigo-100
			selection:text-indigo-100
			p-8
			flex-1
			rounded-lg
			overflow-auto
			
			border-2
			border-indigo-900
			focus:border-indigo-600
			outline-none
			resize-none
			placeholder:text-indigo-200
			"
		></textarea>
		<div
			class="
			bg-indigo-100
			selection:text-indigo-100
			p-8
			flex-1
			rounded-lg
			overflow-auto
			{input ? '' : 'text-indigo-200'}
			"
		>
			{input ? io(input) : 'λ code comes out'}
		</div>
	</div>
</div>
