<script setup lang="ts">
import TiptapEditor from './components/TiptapEditor.vue'
import { ref } from 'vue'

const content = ref(`
<p>Hello World!</p>
<p>Hello World!</p>
<p>Hello World!</p>
<p>Hello World!</p>
<p>Hello World!</p>
`)
</script>

<template>
  <div class="app">
    <TiptapEditor v-model="content" />
    <div v-text="content"></div>
  </div>
</template>

<style>
</style>
