<script lang="ts">
	import type { HTMLInputAttributes } from 'svelte/elements';

	let { ...attribs }: HTMLInputAttributes = $props();
</script>

<input
	type="text"
	{...attribs}
	class={[
		'border-brand shadow-brand h-12 rounded-tr-md rounded-bl-md border-2 px-4 transition-shadow outline-none focus:shadow-sm',
		attribs.class
	]}
/>
