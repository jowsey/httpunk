<script lang="ts">
	import { goto } from '$app/navigation';
	import { authClient } from '$lib/auth-client';
	import StyledButton from '$lib/components/StyledButton.svelte';

	const { data } = $props();
</script>

<div class="flex items-center gap-x-4">
	<img src={data.session?.user.image} alt="Profile icon" class="size-12 rounded-full" />
	<div>
		<p class="text-lg font-bold">{data.session?.user.name}</p>
		<p class="text-sm text-neutral-500">Linked to Discord.</p>
	</div>
</div>
<br />

<StyledButton
	size="compact"
	theme="danger"
	onclick={async () => {
		await authClient.signOut();
		goto('/');
	}}
>
	Log out
</StyledButton>

<p class="mt-2 text-sm text-neutral-500">Your progress will be saved.</p>
