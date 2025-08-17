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
		'group hover:border-brand relative flex cursor-pointer flex-col items-start justify-end rounded-3xl border-2 border-white/25 px-6 py-4 transition-transform duration-75 select-none hover:-translate-y-0.5 hover:brightness-110 active:brightness-125',
		attribs.class
	]}
>
	{#if background}
		<img
			src={backgroundHover && isHovering ? backgroundHover : background}
			alt="{title} background"
			class={['absolute inset-0 size-full rounded-3xl object-cover']}
		/>
	{/if}

	<div
		class="pointer-events-none drop-shadow-sm drop-shadow-black/75 text-shadow-black/75 text-shadow-sm group-hover:-translate-y-0.5"
	>
		<p class="text-2xl font-bold lg:text-3xl">{title}</p>
		{#if subtitle}
			<p class="text-lg leading-tight text-neutral-300">{subtitle}</p>
		{/if}
	</div>
</a>
