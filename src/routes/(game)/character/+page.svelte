<script lang="ts">
	import { enhance } from '$app/forms';
	import { characterNameRegex } from '$lib';
	import StyledButton from '$lib/components/StyledButton.svelte';
	import StyledInput from '$lib/components/StyledInput.svelte';

	let { data, form } = $props();
</script>

<div class="mx-auto max-w-7xl">
	<p class="text-3xl font-bold">Character</p>

	{#if data.character}
		<p class="text-xl font-bold">Name: {data.character.name}</p>
	{:else}
		<form method="POST" action="?/create" use:enhance>
			<p class="mt-4 text-xl font-bold">Create a <span class="text-brand">new</span> character</p>
			<div class="flex max-w-64 flex-col">
				<StyledInput
					class="mt-4"
					name="name"
					placeholder="Name"
					required
					maxlength={12}
					spellcheck="false"
					autocomplete="off"
					value={form?.name || ''}
					pattern={characterNameRegex.source}
				/>

				<p class="text-brand mt-1 text-right text-sm italic">1-12 letters</p>
			</div>

			{#if form?.nameErr}
				<p class="mt-2 text-red-500">{form.nameErr}</p>
			{/if}

			<StyledButton type="submit" class="mt-4">Create</StyledButton>
		</form>
	{/if}
</div>
