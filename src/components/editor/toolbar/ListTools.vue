<template>
  <div class="toolbar-group">
    <ToolbarButton
      v-for="tool in listTools"
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

const listTools = computed(() => [
  {
    name: 'bulletList',
    icon: 'ul',
    title: '无序列表',
    action: () => props.editor?.chain().focus().toggleBulletList().run(),
  },
  {
    name: 'orderedList',
    icon: 'ol',
    title: '有序列表',
    action: () => props.editor?.chain().focus().toggleOrderedList().run(),
  },
  {
    name: 'taskList',
    icon: 'tl',
    title: '任务列表',
    action: () => props.editor?.chain().focus().toggleTaskList().run(),
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