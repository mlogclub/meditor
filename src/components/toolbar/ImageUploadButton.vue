<template>
  <ToolbarButton
    @click="handleUploadClick"
    title="上传图片"
  >
    <LucideImagePlus :size="TOOLBAR_ICON_SIZE" />
  </ToolbarButton>
  <input
    ref="fileInputRef"
    type="file"
    accept="image/*"
    class="hidden"
    @change="handleFileChange"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Editor } from '@tiptap/core'
import { LucideImagePlus } from 'lucide-vue-next'
import ToolbarButton from './ToolbarButton.vue'
import { TOOLBAR_ICON_SIZE } from '../../constants/editor'
import { uploadImage } from '../../utils/imageUtils'

const props = defineProps<{
  editor: Editor | null | undefined
}>()

const fileInputRef = ref<HTMLInputElement | null>(null)

const handleUploadClick = () => {
  fileInputRef.value?.click()
}

const handleFileChange = async (event: Event) => {
  const input = event.target as HTMLInputElement
  if (!input.files?.length || !props.editor) return
  
  const file = input.files[0]
  await uploadImage(props.editor, file)
  
  // Reset the input so the same file can be selected again
  input.value = ''
}
</script>

<style scoped>
.hidden {
  display: none;
}
</style> 