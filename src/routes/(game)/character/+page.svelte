<script lang="ts">
	import { enhance } from '$app/forms';
	import PronounTag from '$lib/components/PronounTag.svelte';
	import StyledButton from '$lib/components/StyledButton.svelte';

	let { data } = $props();
</script>

<p class="text-3xl font-bold">Character</p>
<p class="text-xl">
	{data.character!.name}
	<PronounTag pronoun={data.character!.pronouns} />
</p>

<form method="POST" action="?/deleteCharacters" use:enhance>
	<StyledButton theme="danger" type="submit" class="mt-4">Delete character</StyledButton>
</form>
