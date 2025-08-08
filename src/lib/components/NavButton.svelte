<script lang="ts">
	import { page } from '$app/state';

	interface Props {
		icon: string;
		label?: string;
		href: string;
	}

	const { icon, label, href }: Props = $props();

	const active = $derived(page.url.pathname === href);
</script>

<a
	title={label}
	class={[
		'group hover:bg-brand relative flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg border border-neutral-800 bg-neutral-900 transition-all duration-75 hover:-translate-y-0.5 hover:scale-105',
		active && '!bg-brand'
	]}
	{href}
	aria-label={label}
>
	<img src={icon} alt={label} class={['size-5 invert-100 group-hover:invert-0', active && '!invert-0']} />

	{#if label}
		<div class="absolute -top-8 hidden rounded-md bg-neutral-800 px-2 py-0.5 text-sm text-white group-hover:block">
			{label}
		</div>
	{/if}
</a>
