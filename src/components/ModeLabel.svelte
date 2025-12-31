<script lang="ts">
    import ModeSensitive from './ModeSensitive.svelte'
</script>
<ModeSensitive>
    {#snippet dark()}
    (dark)
    {/snippet}

    {#snippet light()}
    (light)
    {/snippet}
</ModeSensitive>
