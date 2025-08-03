<script lang="ts">
	interface Props {
		icon?: string;
		label?: string;
		href: string;
	}

	const { icon, label, href }: Props = $props();
</script>

<a
	title={label}
	class="group hover:bg-brand relative flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg border border-neutral-800 bg-neutral-900 text-white transition-all duration-75 hover:-translate-y-0.5 hover:scale-105 hover:text-neutral-900"
	{href}
	aria-label={label}
>
	{#if icon}
		<img src={icon} alt={label} class="size-5 invert-100 group-hover:invert-0" />
	{:else}
		<p>?</p>
	{/if}
	{#if label}
		<div class="absolute -top-8 hidden rounded-md bg-neutral-800 px-2 py-0.5 text-sm text-white group-hover:block">
			{label}
		</div>
	{/if}
</a>
