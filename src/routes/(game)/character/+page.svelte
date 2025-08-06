<script lang="ts">
	import PronounTag from '$lib/components/PronounTag.svelte';
	import StyledButton from '$lib/components/StyledButton.svelte';
	import { EXP_GOAL_FOR_LEVEL } from '$lib/constants';
	import { appState } from '$lib/client/state.svelte';
	import { enhance } from '$app/forms';

	// todo temp for debugging, should be an api route ideally not a form
	const addExp = async () => {
		await fetch(`?/giveExp`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			},
			body: new URLSearchParams({
				characterId: appState.character!.id.toString(),
				exp: '5'
			})
		});
	};
</script>

<div class="grid w-full grid-cols-1 items-center lg:grid-cols-3">
	<p class="text-2xl font-bold">
		{appState.character!.name}
		<PronounTag pronoun={appState.character!.pronouns} />
	</p>
	<div class="flex flex-col lg:col-span-2">
		<div class="flex items-center justify-between">
			<p class="font-bold">Level <span class="text-brand">{appState.character!.level}</span></p>
			<p class="text-sm text-neutral-400">
				EXP: {appState.character!.exp} / {EXP_GOAL_FOR_LEVEL(appState.character!.level)}
			</p>
		</div>
		<div class="h-1 w-full bg-neutral-800">
			<div
				class="from-brand to-brand-fem h-full bg-gradient-to-r from-50% transition-all"
				style="width: {Math.min((appState.character!.exp / EXP_GOAL_FOR_LEVEL(appState.character!.level)) * 100, 100)}%"
			></div>
		</div>
	</div>
</div>

<StyledButton class="mt-4" theme="good" size="compact" onclick={addExp}>Give 5 EXP</StyledButton>

<form class="mt-4" method="POST" action="?/deleteCharacters" use:enhance>
	<StyledButton theme="danger" size="compact" type="submit">Delete character</StyledButton>
</form>
