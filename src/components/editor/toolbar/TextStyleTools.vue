<template>
  <div class="toolbar-group">
    <ToolbarButton
      v-for="tool in textTools"
      :key="tool.name"
      :icon="tool.icon"
      :title="tool.title"
      :active="editor?.isActive(tool.name)"
      @click="tool.action"
    />
  </div>
</template>

<script setup lang="ts">
import { Editor } from '@tiptap/core';
import ToolbarButton from './ToolbarButton.vue';

const props = defineProps<{
  editor: Editor | null;
}>();

const textTools = computed(() => [
  {
    name: 'bold',
    icon: 'bold',
    title: '加粗',
    action: () => props.editor?.chain().focus().toggleBold().run(),
  },
  {
    name: 'italic',
    icon: 'italic',
    title: '斜体',
    action: () => props.editor?.chain().focus().toggleItalic().run(),
  },
  {
    name: 'underline',
    icon: 'underline',
    title: '下划线',
    action: () => props.editor?.chain().focus().toggleUnderline().run(),
  },
  {
    name: 'strike',
    icon: 'strike',
    title: '删除线',
    action: () => props.editor?.chain().focus().toggleStrike().run(),
  },
  {
    name: 'highlight',
    icon: 'highlight',
    title: '高亮',
    action: () => props.editor?.chain().focus().toggleHighlight().run(),
  },
]);
</script>

<style scoped>
.toolbar-group {
  display: flex;
  gap: 0.25rem;
  padding-right: 0.5rem;
  border-right: 1px solid var(--tiptap-border);
}
</style> 