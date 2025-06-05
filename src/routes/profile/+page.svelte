<script lang="ts">
	import { authClient } from '$lib/auth-client';
	const session = authClient.useSession();
</script>

{#if $session.data}
	<div class="flex items-center gap-x-4">
		<img src={$session.data.user.image} alt="Profile icon" class="h-12 rounded-full" />
		<div>
			<p class="text-lg font-bold">{$session.data.user.name}</p>
			<p class="text-sm text-neutral-500">Linked to Discord.</p>
		</div>
	</div>
	<br />
	<button
		class="hover:bg-brand h-8 cursor-pointer rounded-full border border-neutral-900 px-4 transition-colors duration-75 hover:text-black"
		onclick={async () => await authClient.signOut()}>Log out</button
	>
	<p class="mt-2 text-sm text-neutral-500">Your progress will be saved.</p>
{/if}
