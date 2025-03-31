<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { Editor } from '@tiptap/core'
import ToolbarButton from './ToolbarButton.vue'

const props = defineProps<{
  editor: Editor
}>()

const fileInput = ref<HTMLInputElement | null>(null)

const handleFileSelect = (event: Event) => {
  const input = event.target as HTMLInputElement
  if (input.files?.length) {
    const file = input.files[0]
    if (file.type.startsWith('image/')) {
      handleImageFile(file)
    }
  }
}

const handleImageFile = (file: File) => {
  const reader = new FileReader()
  reader.onload = (e) => {
    const base64 = e.target?.result as string
    props.editor.commands.setImage({ src: base64 })
  }
  reader.readAsDataURL(file)
}

const handlePaste = (event: ClipboardEvent) => {
  const items = event.clipboardData?.items
  if (!items) return

  for (const item of items) {
    if (item.type.startsWith('image/')) {
      event.preventDefault()
      const file = item.getAsFile()
      if (file) {
        handleImageFile(file)
      }
      break
    }
  }
}

onMounted(() => {
  props.editor.view.dom.addEventListener('paste', handlePaste)
})

onBeforeUnmount(() => {
  props.editor.view.dom.removeEventListener('paste', handlePaste)
})
</script>

<template>
  <div class="image-button">
    <input
      ref="fileInput"
      type="file"
      accept="image/*"
      class="hidden"
      @change="handleFileSelect"
    />
    <ToolbarButton
      title="上传图片"
      @click="fileInput?.click()"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-5 w-5"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          fill-rule="evenodd"
          d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
          clip-rule="evenodd"
        />
      </svg>
    </ToolbarButton>
  </div>
</template>

<style lang="scss" scoped>
.image-button {
  display: inline-flex;
  align-items: center;
}
</style> 