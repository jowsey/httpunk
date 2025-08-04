<script lang="ts">
	interface Props {
		pronoun: 'he' | 'they' | 'she';
	}

	let { pronoun }: Props = $props();
</script>

<span
	class={[
		'm-1 inline-flex h-4 w-max items-center justify-center px-1.5 text-sm font-bold text-neutral-950',
		pronoun === 'he' && 'bg-brand-masc',
		pronoun === 'they' && 'bg-brand-nb',
		pronoun === 'she' && 'bg-brand-fem'
	]}
>
	{#if pronoun === 'he'}
		he/him
	{:else if pronoun === 'they'}
		they/them
	{:else if pronoun === 'she'}
		she/her
	{/if}
</span>
