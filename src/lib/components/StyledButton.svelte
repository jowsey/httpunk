<script lang="ts">
	import type { HTMLButtonAttributes } from 'svelte/elements';

	interface Props extends HTMLButtonAttributes {
		theme?: 'standard' | 'danger' | 'good';
	}

	let { theme = 'standard', children, ...attribs }: Props = $props();
</script>

<button
	{...attribs}
	class={[
		'flex h-12 w-32 min-w-max cursor-pointer items-center justify-center rounded-tr-md rounded-bl-md text-lg font-bold text-neutral-900 hover:shadow-sm',
		theme === 'standard' && 'bg-brand shadow-brand',
		theme === 'danger' && 'bg-brand-danger shadow-brand-danger',
		theme === 'good' && 'bg-brand-good shadow-brand-good',
		attribs.class
	]}
>
	{@render children?.()}
</button>
