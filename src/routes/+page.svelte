<script lang="ts">
	import { authClient } from '$lib/auth-client';
</script>

<div class="mx-auto px-4 py-32 w-fit">
	<p class="hover:text-brand cursor-crosshair text-xl font-bold select-none hover:italic">
		httpunk
	</p>

	<button
		class="border-brand focus:bg-brand my-4 flex h-14 cursor-pointer items-center gap-x-4 bg-neutral-900 px-4 hover:border hover:bg-neutral-800 focus:border-black focus:**:text-black"
		onclick={async () => {
			await authClient.signIn.social({ provider: 'discord', callbackURL: '/home' });
		}}
	>
		<img class="h-8 group-hover:invert" src="/svg/discord.svg" alt="Discord logo" />
		<div class="text-left">
			<p class="font-bold">Join game</p>
			<p class="-mt-0.5 text-xs text-neutral-500">Requires a Discord account</p>
		</div>
	</button>

	<p class="text-neutral-500">An as-yet-undescribed game.</p>
</div>