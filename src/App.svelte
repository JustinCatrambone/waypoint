<script lang="ts">
  import Canvas from './lib/components/Canvas.svelte';
</script>

<main class="w-full h-screen bg-red-500">
  <Canvas />
</main>

<style>
  :global(body) {
    margin: 0;
    padding: 0;
    overflow: hidden;
  }
</style>