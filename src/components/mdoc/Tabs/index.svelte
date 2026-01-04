<script lang="ts">
	import { Tabs, TabList, TabPanel, Tab, type TabItem } from './tabs';

    type Props = {
	tabs: TabItem[];
    }
    const { tabs = [] }: Props = $props();
</script>

<Tabs>
    <TabList>
        {#each tabs as tab}
            <Tab>{tab.title}</Tab>
        {/each}
    </TabList>

    {#each tabs as tab}
        <TabPanel>
            <div class="body">{tab.body}</div>
        </TabPanel>
    {/each}
</Tabs>

<style>
	.body {
        @apply px-4 py-1;
	}
</style>
