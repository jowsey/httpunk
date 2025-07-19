<script lang="ts">
	import type { HTMLInputAttributes } from 'svelte/elements';

	interface Props extends HTMLInputAttributes {}

	let { ...attribs }: Props = $props();
</script>

<input
	type="text"
	{...attribs}
	class={[
		'border-brand shadow-brand rounded-tr-md rounded-bl-md border-2 px-4 py-2 transition-shadow outline-none focus:shadow-sm',
		attribs.class
	]}
/>
