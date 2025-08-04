<script lang="ts">
	import '../app.css';
	let { children } = $props();
</script>

<svelte:head>
	<title>httpunk</title>
</svelte:head>

<div class="mx-auto flex min-h-dvh max-w-7xl flex-col px-6 pt-4 pb-8">
	{@render children()}
</div>
