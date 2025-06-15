<script lang="ts">
	import { goto } from '$app/navigation';
	import { authClient } from '$lib/auth-client';
	
	const { data } = $props();
</script>

<div class="flex items-center gap-x-4">
	<img src={data.user.image} alt="Profile icon" class="h-12 rounded-full" />
	<div>
		<p class="text-lg font-bold">{data.user.name}</p>
		<p class="text-sm text-neutral-500">Linked to Discord.</p>
	</div>
</div>
<br />
<button
	class="hover:bg-brand h-8 cursor-pointer rounded-full border border-neutral-900 px-4 transition-colors duration-75 hover:text-black"
	onclick={async () => {
		await authClient.signOut();
		goto('/');
	}}>Log out</button
>
<p class="mt-2 text-sm text-neutral-500">Your progress will be saved.</p>
