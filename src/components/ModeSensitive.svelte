<script lang="ts">
    import { theme } from '../store/theme'
    import type { Snippet } from 'svelte';
    type Props = {
	dark: Snippet;
	light: Snippet;
    }

    let { dark, light }: Props = $props();
</script>
{#if $theme === 'dark'}
     {@render dark()}
{:else}
    {@render light()}
{/if}
