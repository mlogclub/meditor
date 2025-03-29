<template>
  <div class="app-container">
    <div class="editor-wrapper">
      <Editor />
    </div>
  </div>
</template>

<script setup lang="ts">
import Editor from './components/Editor.vue'
</script>

<style>
.app-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.editor-wrapper {
  max-width: 1200px;
  margin: 0 auto;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
} 
</style> 