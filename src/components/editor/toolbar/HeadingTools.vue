<template>
  <div class="toolbar-group">
    <ToolbarButton
      v-for="level in levels"
      :key="level"
      :icon="`h${level}`"
      :title="`标题${level}`"
      :active="editor?.isActive('heading', { level })"
      @click="() => editor?.chain().focus().toggleHeading({ level }).run()"
    />
  </div>
</template>

<script setup lang="ts">
import { Editor } from '@tiptap/core';
import { Level } from '@tiptap/extension-heading';
import ToolbarButton from './ToolbarButton.vue';

defineProps<{
  editor: Editor | null;
}>();

const levels: Level[] = [1, 2, 3];
</script>

<style scoped>
.toolbar-group {
  display: flex;
  gap: 0.25rem;
  padding-right: 0.5rem;
  border-right: 1px solid var(--tiptap-border);
}
</style> 