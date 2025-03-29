<template>
  <div class="toolbar-group">
    <ToolbarButton
      v-for="align in alignments"
      :key="align.value"
      :icon="`align-${align.value}`"
      :title="align.title"
      :active="editor?.isActive({ textAlign: align.value })"
      @click="() => editor?.chain().focus().setTextAlign(align.value).run()"
    />
  </div>
</template>

<script setup lang="ts">
import { Editor } from '@tiptap/core';
import ToolbarButton from './ToolbarButton.vue';

defineProps<{
  editor: Editor | null;
}>();

const alignments = [
  { value: 'left', title: '左对齐' },
  { value: 'center', title: '居中对齐' },
  { value: 'right', title: '右对齐' },
] as const;
</script>

<style scoped>
.toolbar-group {
  display: flex;
  gap: 0.25rem;
  padding-right: 0.5rem;
  border-right: 1px solid var(--tiptap-border);
}
</style> 