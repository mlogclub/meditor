<template>
  <button 
    class="toolbar-button"
    :class="{ active }"
    @click="onClick"
    :title="title"
  >
    <span :class="`ProseMirror-icon ProseMirror-icon-${icon}`"></span>
  </button>
</template>

<script setup lang="ts">
defineProps<{
  active?: boolean;
  icon: string;
  title: string;
}>();

const emit = defineEmits<{
  (e: 'click'): void;
}>();

const onClick = () => {
  emit('click');
};
</script>

<style scoped>
.toolbar-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  padding: 0.25rem;
  border: 1px solid transparent;
  border-radius: 0.25rem;
  background: transparent;
  color: var(--tiptap-foreground);
  cursor: pointer;
  transition: all 0.2s;
}

.toolbar-button:hover {
  background-color: var(--tiptap-muted-background);
}

.toolbar-button.active {
  background-color: var(--tiptap-primary-background);
  color: var(--tiptap-primary-foreground);
}
</style> 