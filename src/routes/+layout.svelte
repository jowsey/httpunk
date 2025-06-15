<script lang="ts">
	import '../app.css';
	const { children } = $props();
</script>

<svelte:head>
	<title>httpunk</title>
</svelte:head>

{@render children()}
