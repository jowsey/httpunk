<script lang="ts">
	import { enhance } from '$app/forms';
	import { CHARACTER_NAME_REGEX, MAX_CHARACTER_NAME_LENGTH } from '$lib/constants';
	import { authClient } from '$lib/auth-client';
	import CharacterCreationSection from '$lib/components/CharacterCreationSection.svelte';
	import StyledInput from '$lib/components/StyledInput.svelte';
	import StyledButton from '$lib/components/StyledButton.svelte';

	let { data, form } = $props();

	const pronounOptions = [
		{ label: 'he/him', value: 'he', theme: 'masc', rounded: 'left' },
		{ label: 'they/them', value: 'they', theme: 'nb', rounded: 'none' },
		{ label: 'she/her', value: 'she', theme: 'fem', rounded: 'right' }
	] as const;

	let pronouns = $state(form?.pronouns || 'they');
</script>

{#if data.session}
	<p class="mt-4 text-3xl font-bold">Welcome, {data.session.user.name}!</p>
	<form method="POST" action="?/createCharacter" use:enhance>
		<p class="text-xl font-bold">Begin by creating a new character.</p>

		<CharacterCreationSection>
			<p class="text-lg font-bold">How should people refer to you?</p>

			<div class="flex max-w-64 flex-col">
				<StyledInput
					class="mt-4"
					name="name"
					placeholder="Name"
					required
					maxlength={MAX_CHARACTER_NAME_LENGTH}
					spellcheck="false"
					autocomplete="off"
					value={form?.name || ''}
					pattern={CHARACTER_NAME_REGEX.source}
				/>

				<p class="text-brand mt-1 text-right text-sm italic">1-{MAX_CHARACTER_NAME_LENGTH} letters</p>
			</div>

			{#if form?.nameErr}
				<p class="mt-2 text-red-500">{form.nameErr}</p>
			{/if}

			<div class="mt-4 flex gap-x-2" role="radiogroup" aria-label="Pronouns">
				<input type="hidden" name="pronouns" value={pronouns} />
				{#each pronounOptions as option (option.value)}
					<StyledButton
						theme={option.theme}
						size="compact"
						rounded={option.rounded}
						selected={pronouns === option.value}
						onclick={() => (pronouns = option.value)}
					>
						{option.label}
					</StyledButton>
				{/each}
			</div>

			{#if form?.pronounsErr}
				<p class="mt-2 text-red-500">{form.pronounsErr}</p>
			{/if}
		</CharacterCreationSection>

		<StyledButton type="submit" class="mt-4">Create</StyledButton>
	</form>
{:else}
	<div class="m-auto w-fit">
		<p class="hover:text-brand mb-4 cursor-crosshair text-xl font-bold select-none hover:italic">httpunk</p>
		<button
			class="focus:bg-brand group hover:border-brand mb-4 flex h-14 cursor-pointer items-center gap-x-4 border border-transparent bg-neutral-900 px-4 hover:bg-neutral-800 focus:border-neutral-950 focus:**:text-neutral-950"
			onclick={async () => {
				await authClient.signIn.social({ provider: 'discord', callbackURL: '/hub' });
			}}
		>
			<img class="h-8 group-focus:invert" src="/svg/discord.svg" alt="Discord logo" />
			<div class="text-left">
				<p class="font-bold">Join game</p>
				<p class="-mt-0.5 text-xs text-neutral-500">Requires a Discord account</p>
			</div>
		</button>
	</div>
{/if}
