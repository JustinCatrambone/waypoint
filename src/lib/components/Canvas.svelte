<script lang="ts">
  import { onMount } from 'svelte';
  import Note from './Note.svelte';
  import { Plus } from 'lucide-svelte';
  
  interface NoteData {
    id: number;
    text: string;
    x: number;
    y: number;
    color: string;
  }
  
  let notes: NoteData[] = [
    { id: 1, text: "Drag me around!", x: 100, y: 100, color: 'bg-yellow-200' },
    { id: 2, text: "Double click to edit", x: 300, y: 150, color: 'bg-pink-200' },
    { id: 3, text: "Pinch to zoom (on mobile)", x: 200, y: 300, color: 'bg-blue-200' }
  ];
  
  let scale = 1;
  let isDragging = false;
  let draggedNoteId: number | null = null;
  let startPos = { x: 0, y: 0 };
  let container: HTMLDivElement;
  
  const colors = ['bg-yellow-200', 'bg-pink-200', 'bg-blue-200', 'bg-green-200', 'bg-purple-200'];
  
  function handleNoteMouseDown(event: MouseEvent | TouchEvent, noteId: number) {
    event.preventDefault();
    isDragging = true;
    draggedNoteId = noteId;
    
    const clientX = event instanceof MouseEvent ? event.clientX : event.touches[0].clientX;
    const clientY = event instanceof MouseEvent ? event.clientY : event.touches[0].clientY;
    
    const note = notes.find(n => n.id === noteId);
    if (note) {
      startPos = {
        x: clientX - note.x,
        y: clientY - note.y
      };
    }
  }
  
  function handleMouseMove(event: MouseEvent | TouchEvent) {
    if (isDragging && draggedNoteId !== null) {
      const clientX = event instanceof MouseEvent ? event.clientX : event.touches[0].clientX;
      const clientY = event instanceof MouseEvent ? event.clientY : event.touches[0].clientY;
      
      notes = notes.map(note => {
        if (note.id === draggedNoteId) {
          return {
            ...note,
            x: clientX - startPos.x,
            y: clientY - startPos.y
          };
        }
        return note;
      });
    }
  }
  
  function handleMouseUp() {
    isDragging = false;
    draggedNoteId = null;
  }
  
  function addNote() {
    const newNote = {
      id: Date.now(),
      text: "New note",
      x: Math.random() * 200 + 100,
      y: Math.random() * 200 + 100,
      color: `${colors[Math.floor(Math.random() * colors.length)]}`
    };
    notes = [...notes, newNote];
  }
  
  function deleteNote(id: number) {
    notes = notes.filter(note => note.id !== id);
  }
  
  function handleWheel(event: WheelEvent) {
    if (event.ctrlKey) {
      event.preventDefault();
      const newScale = scale - (event.deltaY * 0.001);
      scale = Math.min(Math.max(0.5, newScale), 2);
    }
  }
  
  onMount(() => {
    // Load notes from localStorage if available
    const savedNotes = localStorage.getItem('spatialNotes');
    if (savedNotes) {
      notes = JSON.parse(savedNotes);
    }
  });

  $: {
    // Save notes whenever they change
    if (notes) {
      localStorage.setItem('spatialNotes', JSON.stringify(notes));
    }
  }
</script>

<div
  class="w-full h-screen bg-gray-100 overflow-hidden"
  bind:this={container}
  on:wheel={handleWheel}
  on:mousemove={handleMouseMove}
  on:touchmove={handleMouseMove}
  on:mouseup={handleMouseUp}
  on:touchend={handleMouseUp}
  on:mouseleave={handleMouseUp}
>
  <div class="fixed bottom-4 right-4 z-50">
    <button 
      on:click={addNote}
      class="bg-blue-500 text-white rounded-full w-12 h-12 flex items-center justify-center shadow-lg hover:bg-blue-600"
    >
      <Plus size={24} />
    </button>
  </div>
  
  <div 
    class="relative w-full h-full"
    style="transform: scale({scale}); transform-origin: 50% 50%;"
  >
    {#each notes as note (note.id)}
      <Note
        {...note}
        onDelete={deleteNote}
        onDragStart={handleNoteMouseDown}
      />
    {/each}
  </div>
</div>