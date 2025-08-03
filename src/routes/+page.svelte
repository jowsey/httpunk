<script lang="ts">
	import { enhance } from '$app/forms';
	import { characterNameRegex } from '$lib';
	import { authClient } from '$lib/auth-client';
	import StyledButton from '$lib/components/StyledButton.svelte';
	import StyledInput from '$lib/components/StyledInput.svelte';

	let { data, form } = $props();
</script>

<div class="mx-auto max-w-2xl px-4 py-32">
	{#if !data.session || !data.character}
		<p class="hover:text-brand mb-4 cursor-crosshair text-xl font-bold select-none hover:italic">httpunk</p>
	{/if}

	{#if data.character}
		<p class="text-2xl font-bold">Welcome back, {data.session.user.name}.</p>
	{:else if data.session}
		<p class="text-3xl font-bold">Welcome, {data.session.user.name}!</p>
		<form method="POST" action="?/createCharacter" use:enhance>
			<p class="mt-4 text-xl font-bold">Begin by creating a new character.</p>
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
	{:else}
		<button
			class="border-brand focus:bg-brand mb-4 flex h-14 cursor-pointer items-center gap-x-4 bg-neutral-900 px-4 hover:border hover:bg-neutral-800 focus:border-black focus:**:text-black"
			onclick={async () => {
				await authClient.signIn.social({ provider: 'discord', callbackURL: '/' });
			}}
		>
			<img class="h-8 group-hover:invert" src="/svg/discord.svg" alt="Discord logo" />
			<div class="text-left">
				<p class="font-bold">Join game</p>
				<p class="-mt-0.5 text-xs text-neutral-500">Requires a Discord account</p>
			</div>
		</button>

		<p class="text-neutral-500">A Cyberpunk-themed web-game.</p>
	{/if}
</div>
