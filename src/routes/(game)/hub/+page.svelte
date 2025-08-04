<script lang="ts">
	let { data } = $props();
</script>

<div class="flex">
	<p class="text-2xl font-bold">Welcome back, {data.session!.user.name}.</p>
</div>
