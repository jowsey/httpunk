<script lang="ts">
	import type { HTMLButtonAttributes } from 'svelte/elements';

	interface Props extends HTMLButtonAttributes {}

	let { children, ...attribs }: Props = $props();
</script>

<button
	{...attribs}
	class={[
		'bg-brand shadow-brand flex h-12 w-32 min-w-max cursor-pointer items-center justify-center rounded-tr-md rounded-bl-md text-lg font-bold text-neutral-900 transition-shadow hover:shadow-sm',
		attribs.class
	]}
>
	{@render children?.()}
</button>
