<template>
  <div class="editor-container">
    <EditorToolbar :editor="editor" />
    <editor-content :editor="editor" class="editor-content" />
  </div>
</template>

<script setup lang="ts">
import { useEditor, EditorContent } from '@tiptap/vue-3';
import { StarterKit } from "../index";
import EditorToolbar from './editor/toolbar/EditorToolbar.vue';

const editor = useEditor({
  extensions: [
    StarterKit.configure({
    }),
  ],
  content: '<p>Hello World</p>',
});

onBeforeUnmount(() => {
  editor.value?.destroy();
});
</script>

<style scoped>
.editor-container {
  border: 1px solid var(--tiptap-border);
  border-radius: var(--tiptap-radius);
  overflow: hidden;
}

.editor-content {
  padding: 1rem;
  min-height: 200px;
  outline: none;
}

.editor-content :deep(.ProseMirror) {
  min-height: 200px;
  outline: none;
}

.editor-content :deep(.ProseMirror p) {
  margin: 0.5em 0;
}

.editor-content :deep(.ProseMirror h1),
.editor-content :deep(.ProseMirror h2),
.editor-content :deep(.ProseMirror h3) {
  margin: 1em 0 0.5em;
}
</style> 