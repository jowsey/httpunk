<script lang="ts">
	import '../app.css';
	import type { LayoutProps } from './$types';

	const { children, data }: LayoutProps = $props();
</script>

<svelte:head>
	<title>httpunk</title>
</svelte:head>

{@render children()}
