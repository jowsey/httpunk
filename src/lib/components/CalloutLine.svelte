<script lang="ts">
	import type { SvelteHTMLElements } from 'svelte/elements';

	interface Vector2 {
		x: number;
		y: number;
	}

	type DivAttributes = SvelteHTMLElements['div'];
	interface Props extends DivAttributes {
		firstOffset: Vector2;
		secondOffset: Vector2;
		strokeWidth?: number;
		color?: string;
		label?: string;
	}

	let { firstOffset, secondOffset, strokeWidth = 2, color = 'var(--color-brand)', label, ...attribs }: Props = $props();

	let minX = $derived(Math.min(0, firstOffset.x, secondOffset.x) - strokeWidth);
	let minY = $derived(Math.min(0, firstOffset.y, secondOffset.y) - strokeWidth);
	let maxX = $derived(Math.max(0, firstOffset.x, secondOffset.x) + strokeWidth);
	let maxY = $derived(Math.max(0, firstOffset.y, secondOffset.y) + strokeWidth);
	let width = $derived(maxX - minX);
	let height = $derived(maxY - minY);
	let viewBox = $derived(`${minX} ${minY} ${width} ${height}`);
</script>

<div {...attribs} class={['relative inline-block size-0', attribs.class]}>
	<svg
		class="pointer-events-none absolute overflow-visible"
		style="width: {width}px; height: {height}px; left: {minX}px; top: {minY}px;"
		{viewBox}
	>
		<path
			d="M 0 0 L {firstOffset.x} {firstOffset.y} L {secondOffset.x} {secondOffset.y}"
			stroke={color}
			stroke-width={strokeWidth}
			fill="none"
			stroke-linecap="round"
			stroke-linejoin="round"
		/>

		<!-- path underneath as a shadow -->
		<path
			d="M 0 2 L {firstOffset.x} {firstOffset.y + 2} L {secondOffset.x} {secondOffset.y + 2}"
			stroke="var(--color-neutral-950)"
			stroke-width={strokeWidth - 1}
			fill="none"
			stroke-linecap="round"
			stroke-linejoin="round"
			stroke-opacity="0.5"
		/>

		<circle cx="0" cy="0" r="3" fill={color} />
		<circle cx={firstOffset.x} cy={firstOffset.y} r="3" fill={color} />
		<circle cx={secondOffset.x} cy={secondOffset.y} r="3" fill={color} />

		{#if label}
			<text
				x={secondOffset.x - 2}
				y={secondOffset.y + 12}
				text-anchor="end"
				dominant-baseline="hanging"
				fill={color}
				font-size="14"
			>
				{label}
			</text>
		{/if}
	</svg>
</div>
