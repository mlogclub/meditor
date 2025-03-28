<script setup lang="ts">
import TiptapEditor from './components/TiptapEditor.vue'
import { ref } from 'vue'

const content = ref('<p>Hello World!</p>')
</script>

<template>
  <div class="app">
    <h1>富文本编辑器</h1>
    <TiptapEditor v-model="content" />
  </div>
</template>

<style>
</style>
