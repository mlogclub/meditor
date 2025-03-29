<template>
  <div class="app-container">
    <h1>Tiptap 编辑器 Demo</h1>
    <div class="editor-wrapper">
      <Editor />
    </div>
  </div>
</template>

<script setup lang="ts">
import Editor from './components/Editor.vue'
</script>

<style>
:root {
  --radius: 0.5rem;
  --ring: 240 5% 64.9%;
  --input: 240 5.9% 90%;
  --border: 240 5.9% 90%;
  --foreground: 240 10% 3.9%;
  --background: 0 0% 100%;
  --primary: 221.2 83.2% 53.3%;
  --primary-foreground: 210 40% 98%;
  --muted: 240 4.8% 95.9%;
  --muted-foreground: 240 3.8% 46.1%;
  --accent: 240 4.8% 95.9%;
  --accent-foreground: 240 5.9% 10%;
}

body {
  margin: 0;
  padding: 0;
  font-family: var(--tiptap-font-family);
  background-color: hsl(var(--background));
  color: hsl(var(--foreground));
}

.app-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

h1 {
  text-align: center;
  margin-bottom: 2rem;
}

.editor-wrapper {
  max-width: 800px;
  margin: 0 auto;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}
</style> 