<script>
	import { getContext } from 'svelte';
	import type { Snippet } from 'svelte';
	import { TABS } from './Tabs.svelte';

        interface Props {
            children: Snippet;
        }
        let { children } : Snippet = $props();

	const tab = {};
	const { registerTab, selectTab, selectedTab } = getContext(TABS);

	registerTab(tab);
</script>

<style>
	button {
        @apply bg-none border-b-2 border-solid border-white m-0 text-gray-400 px-4 py-1;
	}

	.selected {
        @apply border-b-2 border-solid border-gray-700 text-gray-700;
	}
</style>

<button class:selected="{$selectedTab === tab}" onclick={() => selectTab(tab)}>
    {@render children()}
</button>
