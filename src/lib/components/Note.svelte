<script lang="ts">
  import { X } from 'lucide-svelte';
  import { onMount } from 'svelte';
  
  export let id: number;
  export let text: string;
  export let x: number;
  export let y: number;
  export let color: string;
  export let onDelete: (id: number) => void;
  export let onDragStart: (event: MouseEvent | TouchEvent, id: number) => void;
  
  let isEditing = false;
  let noteElement: HTMLDivElement;
  let editableDiv: HTMLDivElement;

  function handleDoubleClick(event: MouseEvent) {
    isEditing = true;
    
    setTimeout(() => {
      if (editableDiv) {
        // Set the text content before focusing
        editableDiv.textContent = text;
        editableDiv.focus();
        
        const selection = window.getSelection();
        const range = document.caretRangeFromPoint(event.clientX, event.clientY);
        
        if (range && selection) {
          selection.removeAllRanges();
          selection.addRange(range);
        } else {
          const range = document.createRange();
          const textNode = editableDiv.firstChild || editableDiv;
          range.selectNodeContents(textNode);
          range.collapse(false);
          selection?.removeAllRanges();
          selection?.addRange(range);
        }
      }
    }, 0);
  }
  
  function handleBlur() {
    if (editableDiv) {
      text = editableDiv.textContent || '';
    }
    isEditing = false;
  }
</script>

<div
  class="{color} absolute p-4 rounded-lg shadow-lg cursor-move"
  style="left: {x}px; top: {y}px; min-width: 150px; max-width: 300px;"
  bind:this={noteElement}
  on:mousedown={(e) => onDragStart(e, id)}
  on:touchstart={(e) => onDragStart(e, id)}
  on:dblclick={handleDoubleClick}
>
  <button
    on:click={() => onDelete(id)}
    class="absolute top-1 right-1 text-gray-500 hover:text-gray-700"
  >
    <X size={16} />
  </button>
  
  {#if isEditing}
    <div
      bind:this={editableDiv}
      contenteditable="true"
      on:blur={handleBlur}
      class="outline-none min-h-[1em] text-gray-800 whitespace-pre-wrap"
    />
  {:else}
    <div class="select-none text-gray-800 whitespace-pre-wrap">{text}</div>
  {/if}
</div>