<script lang="ts">
	import type { HTMLButtonAttributes } from 'svelte/elements';

	interface Props extends HTMLButtonAttributes {
		theme?: 'standard' | 'danger' | 'good';
		size?: 'compact' | 'standard';
	}

	let { theme = 'standard', size = 'standard', children, ...attribs }: Props = $props();
</script>

<button
	{...attribs}
	class={[
		'flex min-w-max cursor-pointer items-center justify-center rounded-tr-md rounded-bl-md font-bold text-neutral-900 hover:shadow-sm',
		theme === 'standard' && 'bg-brand shadow-brand',
		theme === 'danger' && 'bg-brand-danger shadow-brand-danger',
		theme === 'good' && 'bg-brand-good shadow-brand-good',
		size === 'compact' && 'px-4 py-2 text-base',
		size === 'standard' && 'px-5 py-3 text-lg',
		attribs.class
	]}
>
	{@render children?.()}
</button>
