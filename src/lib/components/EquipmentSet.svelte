<script lang="ts">
	import type { SvelteHTMLElements } from 'svelte/elements';
	import EquipmentBox from './EquipmentBox.svelte';

	type DivAttributes = SvelteHTMLElements['div'];
	// interface Props extends DivAttributes {}

	let { ...attribs }: DivAttributes = $props();
</script>

<div {...attribs} class={['flex flex-col', attribs.class]}>
	<div class="flex items-center gap-x-4">
		<EquipmentBox></EquipmentBox>
		<EquipmentBox></EquipmentBox>
		<EquipmentBox></EquipmentBox>
	</div>
</div>
