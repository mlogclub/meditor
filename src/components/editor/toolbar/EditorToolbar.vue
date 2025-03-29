<template>
  <div class="editor-toolbar">
    <TextStyleTools :editor="editor" />
    <HeadingTools :editor="editor" />
    <ListTools :editor="editor" />
    <AlignmentTools :editor="editor" />
    <MiscTools :editor="editor" />
  </div>
</template>

<script setup lang="ts">
import { Editor } from '@tiptap/core';
import TextStyleTools from './TextStyleTools.vue';
import HeadingTools from './HeadingTools.vue';
import ListTools from './ListTools.vue';
import AlignmentTools from './AlignmentTools.vue';
import MiscTools from './MiscTools.vue';

defineProps<{
  editor: Editor | null;
}>();
</script>

<style scoped>
.editor-toolbar {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  padding: 0.5rem;
  border-bottom: 1px solid var(--tiptap-border);
  background-color: var(--tiptap-muted-background);
}
</style> 