<script lang="ts">
	import { enhance } from '$app/forms';
	import StyledButton from '$lib/components/StyledButton.svelte';

	let { data } = $props();
</script>

<div class="mx-auto max-w-7xl">
	<p class="text-3xl font-bold">Character</p>

	<p class="text-xl font-bold">Name: {data.character!.name}</p>

	<form method="POST" action="?/deleteCharacters" use:enhance>
		<StyledButton theme="danger" type="submit" class="mt-4">Delete</StyledButton>
	</form>
</div>
