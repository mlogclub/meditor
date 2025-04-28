<template>
  <ToolbarButton
    @click="handleOpenFileDialog"
    :isActive="editor?.isActive('resizableImage')"
    title="插入图片"
  >
    <LucideImage :size="TOOLBAR_ICON_SIZE" />
    <input
      ref="fileInputRef"
      type="file"
      @change="handleFileChange"
      style="display: none"
      accept="image/*"
    />
  </ToolbarButton>
</template>

<script setup lang="ts">
import { ref, inject } from 'vue'
import { Editor } from '@tiptap/core'
import { LucideImage } from 'lucide-vue-next'
import ToolbarButton from './ToolbarButton.vue'
import { TOOLBAR_ICON_SIZE } from '../../constants/editor'

const props = defineProps<{
  editor: Editor | null | undefined
}>()

const fileInputRef = ref<HTMLInputElement | null>(null)

// 从Vue上下文中获取自定义上传函数
const customImageUpload = inject<(file: File) => Promise<string>>('customImageUpload', null)

// 打开文件选择对话框
const handleOpenFileDialog = () => {
  fileInputRef.value?.click()
}

// 处理文件选择
const handleFileChange = (event: Event) => {
  if (!props.editor) return
  
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  
  if (file) {
    // 使用自定义上传函数或创建本地URL
    if (typeof customImageUpload === 'function') {
      customImageUpload(file)
        .then((url: string) => {
          insertImage(url)
        })
        .catch((error: Error) => {
          console.error('Image upload failed:', error)
        })
    } else {
      // 如果没有自定义上传函数，使用本地URL
      const url = URL.createObjectURL(file)
      insertImage(url)
    }
  }
  
  // 清除输入，以便可以再次选择相同的文件
  input.value = ''
}

// 插入图片到编辑器
const insertImage = (url: string) => {
  if (!props.editor) return
  
  props.editor
    .chain()
    .focus()
    .command(({ commands }) => {
      // 创建一个可调整大小的图片
      const attrs = {
        src: url,
        alignment: 'center'
      }
      return commands.insertContent({
        type: 'resizableImage',
        attrs
      })
    })
    .run()
}
</script> 