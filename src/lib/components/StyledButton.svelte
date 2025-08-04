<script lang="ts">
	import type { HTMLButtonAttributes } from 'svelte/elements';

	interface Props extends HTMLButtonAttributes {
		theme?: 'standard' | 'danger' | 'good' | 'masc' | 'nb' | 'fem';
		size?: 'compact' | 'standard';
		rounded?: 'none' | 'left' | 'right' | 'both';
		selected?: boolean;
	}

	let {
		theme = 'standard',
		size = 'standard',
		rounded = 'both',
		selected = false,
		children,
		...attribs
	}: Props = $props();
</script>

<button
	type="button"
	{...attribs}
	class={[
		'flex w-max cursor-pointer items-center justify-center font-bold text-neutral-900 hover:shadow-sm',
		theme === 'standard' && 'bg-brand shadow-brand',
		theme === 'danger' && 'bg-brand-danger shadow-brand-danger',
		theme === 'good' && 'bg-brand-good shadow-brand-good',
		theme === 'masc' && 'bg-brand-masc shadow-brand-masc',
		theme === 'nb' && 'bg-brand-nb shadow-brand-nb',
		theme === 'fem' && 'bg-brand-fem shadow-brand-fem',
		size === 'compact' && 'px-4 py-2 text-base',
		size === 'standard' && 'px-8 py-3 text-lg',
		rounded === 'left' && 'rounded-bl-md',
		rounded === 'right' && 'rounded-tr-md',
		rounded === 'both' && 'rounded-tr-md rounded-bl-md',
		selected && 'outline-brand outline-2 outline-offset-2',
		attribs.class
	]}
>
	{@render children?.()}
</button>
