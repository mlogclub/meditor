<template>
  <div class="toolbar-group">
    <ToolbarButton
      v-for="tool in miscTools"
      :key="tool.name"
      :icon="tool.icon"
      :title="tool.title"
      :active="tool.isActive ? editor?.isActive(tool.name) : false"
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

const miscTools = computed(() => [
  {
    name: 'blockquote',
    icon: 'blockquote',
    title: '引用',
    isActive: true,
    action: () => props.editor?.chain().focus().toggleBlockquote().run(),
  },
  {
    name: 'codeBlock',
    icon: 'code',
    title: '代码块',
    isActive: true,
    action: () => props.editor?.chain().focus().toggleCodeBlock().run(),
  },
  {
    name: 'horizontalRule',
    icon: 'hr',
    title: '分割线',
    isActive: false,
    action: () => props.editor?.chain().focus().setHorizontalRule().run(),
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

.toolbar-group:last-child {
  border-right: none;
}
</style> 