<script lang="ts">
	let { children } = $props();
</script>

<div class="border-brand my-4 rounded-tr-md rounded-bl-md border p-4">
	{@render children?.()}
</div>
