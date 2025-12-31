<script>
	import { getContext } from 'svelte';
	import type { Snippet } from 'svelte';
	import { TABS } from './Tabs.svelte';

	interface Props {
	    children: Snippet;
	}

	const panel = {};
	const { registerPanel, selectedPanel } = getContext(TABS);
	let { children }: Props = $props();

	registerPanel(panel);
</script>

{#if $selectedPanel === panel}
	{@render children()}
{/if}
