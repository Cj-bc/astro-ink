<script>
    import type { Snippet } from 'svelte';
</script>
<div class="tab-list">
    {@render children()}
</div>

<style>
	.tab-list {
        @apply border-b border-solid border-gray-500;
	}
</style>
