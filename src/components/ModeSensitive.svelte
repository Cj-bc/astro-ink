<script lang="ts">
    import { theme } from '../store/theme'
</script>
{#if $theme === 'dark'}
     {@render dark()}
{:else}
    {@render light()}
{/if}
