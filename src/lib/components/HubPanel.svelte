<script lang="ts">
	import type { HTMLAnchorAttributes } from 'svelte/elements';

	interface Props extends HTMLAnchorAttributes {
		title: string;
		subtitle?: string;
		href?: string;
		background?: string;
		backgroundHover?: string;
	}

	let { title, subtitle, href, background, backgroundHover, ...attribs }: Props = $props();

	let isHovering = $state(false);
</script>

<a
	{...attribs}
	{href}
	onmouseenter={() => (isHovering = true)}
	onmouseleave={() => (isHovering = false)}
	class={[
		'group relative flex cursor-pointer flex-col items-start justify-end rounded-3xl px-6 py-4 inset-ring-2 shadow-black inset-ring-white/25 transition-transform duration-75 select-none hover:-translate-y-0.5 hover:shadow-lg hover:brightness-110 active:brightness-125',
		attribs.class
	]}
>
	{#if background}
		<img
			src={backgroundHover && isHovering ? backgroundHover : background}
			alt="{title} background"
			class={['absolute inset-0 -z-10 size-full rounded-2xl object-cover']}
		/>
	{/if}

	<div
		class="pointer-events-none drop-shadow-sm drop-shadow-black/75 text-shadow-black/75 text-shadow-sm group-hover:-translate-y-0.5"
	>
		<p class="text-2xl font-bold lg:text-3xl">{title}</p>
		{#if subtitle}
			<p class="text-lg text-neutral-300">{subtitle}</p>
		{/if}
	</div>
</a>
