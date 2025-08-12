<script lang="ts">
	import PronounTag from '$lib/components/PronounTag.svelte';
	import StyledButton from '$lib/components/StyledButton.svelte';
	import { EXP_GOAL_FOR_LEVEL } from '$lib/constants';
	import { appState } from '$lib/client/state.svelte';
	import { enhance } from '$app/forms';
	import EquipmentSet from '$lib/components/EquipmentSet.svelte';
	import CalloutLine from '$lib/components/CalloutLine.svelte';

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
		<div class="flex items-center justify-between tabular-nums">
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

<div class="mx-auto my-16 flex w-fit">
	<!-- character image -->
	<div class="relative h-160 w-80 shrink-0">
		<img
			id="avatar"
			class="size-full object-contain brightness-125 contrast-125 saturate-125 select-none"
			src="render/avatar_glass.webp"
			alt="character"
		/>

		<div class="absolute top-12 left-40">
			<CalloutLine firstOffset={{ x: 24, y: -24 }} secondOffset={{ x: 138, y: -24 }} label="Head" />
		</div>

		<div class="absolute top-40 left-40">
			<CalloutLine firstOffset={{ x: 24, y: -24 }} secondOffset={{ x: 178, y: -24 }} label="Chest" />
		</div>

		<div class="absolute top-56 left-64">
			<CalloutLine firstOffset={{ x: 24, y: 24 }} secondOffset={{ x: 122, y: 24 }} label="Arms" />
		</div>

		<div class="absolute top-74 left-10">
			<CalloutLine firstOffset={{ x: 64, y: 64 }} secondOffset={{ x: 338, y: 64 }} label="Hands" />
		</div>

		<div class="absolute top-112 left-48">
			<CalloutLine firstOffset={{ x: 24, y: 24 }} secondOffset={{ x: 146, y: 24 }} label="Legs" />
		</div>

		<div class="absolute top-140 left-34">
			<CalloutLine firstOffset={{ x: 24, y: 24 }} secondOffset={{ x: 154, y: 24 }} label="Feet" />
		</div>
	</div>

	<!-- equipment grid -->
	<div class="flex flex-col gap-y-8">
		<EquipmentSet></EquipmentSet>
		<EquipmentSet class="ml-10"></EquipmentSet>
		<EquipmentSet class="ml-20"></EquipmentSet>
		<EquipmentSet class="ml-20"></EquipmentSet>
		<EquipmentSet class="ml-10"></EquipmentSet>
		<EquipmentSet></EquipmentSet>
	</div>
</div>

<div class="flex w-full justify-end gap-x-2">
	<StyledButton rounded="left" theme="good" size="compact" onclick={addExp}>Give 5 EXP</StyledButton>
	<!-- we technically dont need a form here but it causes svelte to reload data on submit which we'd be doing anyway since we wanna redirect to character creation -->
	<form method="POST" action="?/deleteCharacters" use:enhance>
		<StyledButton rounded="right" theme="danger" size="compact" type="submit">Delete character</StyledButton>
	</form>
</div>

<style lang="postcss">
	#avatar {
		animation: float 5s ease-in-out infinite;
	}

	@keyframes float {
		0% {
			transform: translatey(0);
		}
		50% {
			transform: translatey(-4px);
		}
		100% {
			transform: translatey(0);
		}
	}
</style>
