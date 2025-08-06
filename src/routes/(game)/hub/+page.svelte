<script lang="ts">
	let { data } = $props();
</script>

<div class="flex items-center justify-between">
	<p class="text-2xl font-bold">Welcome back, {data.session!.user.name}.</p>
	<!-- <p class="flex gap-x-4 tabular-nums">
		<span>{worldState.time?.format('YYYY-MM-DD')}</span><span>{worldState.time?.format('HH:mm')}</span>
	</p> -->
</div>
