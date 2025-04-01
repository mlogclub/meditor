<template>
  <div 
    class="image-drop-zone"
    :class="{ 'is-active': isActive }"
    @dragover.prevent="handleDragOver"
    @dragleave.prevent="handleDragLeave"
    @drop.prevent="handleDrop"
  >
    <div class="image-drop-zone__content">
      <div v-if="isActive" class="image-drop-zone__overlay">
        <div class="image-drop-zone__message">
          <LucideImagePlus :size="48" />
          <p>释放鼠标以上传图片</p>
        </div>
      </div>
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Editor } from '@tiptap/core'
import { LucideImagePlus } from 'lucide-vue-next'
import { uploadImage } from '../utils/imageUtils'

const props = defineProps<{
  editor: Editor | null | undefined
}>()

const emit = defineEmits<{
  (e: 'image-upload-start'): void
  (e: 'image-upload-success', src: string): void
  (e: 'image-upload-error', error: Error): void
}>()

const isActive = ref(false)

const handleDragOver = (event: DragEvent) => {
  // 确保拖入的是图片文件
  if (event.dataTransfer && event.dataTransfer.items) {
    const hasImageFile = Array.from(event.dataTransfer.items).some(
      item => item.kind === 'file' && item.type.startsWith('image/')
    )
    
    if (hasImageFile) {
      isActive.value = true
    }
  }
}

const handleDragLeave = () => {
  isActive.value = false
}

const handleDrop = async (event: DragEvent) => {
  isActive.value = false
  
  if (!event.dataTransfer?.files.length || !props.editor) {
    return
  }
  
  // 检查是否拖拽到了编辑器内容区域
  const target = event.target as HTMLElement
  const proseMirror = target.closest('.ProseMirror')
  if (!proseMirror) {
    return
  }
  
  const files = Array.from(event.dataTransfer.files).filter(
    file => file.type.startsWith('image/')
  )
  
  if (files.length === 0) {
    return
  }
  
  // 获取拖放位置
  const coordinates = props.editor.view.posAtCoords({
    left: event.clientX,
    top: event.clientY,
  })
  
  if (!coordinates) {
    return
  }
  
  // 处理每个图片文件
  for (const file of files) {
    try {
      emit('image-upload-start')
      const src = await uploadImage(props.editor, file, coordinates.pos)
      
      emit('image-upload-success', src)
    } catch (error) {
      emit('image-upload-error', error instanceof Error ? error : new Error(String(error)))
    }
  }
}
</script>

<style lang="scss">
.image-drop-zone {
  position: relative;
  width: 100%;
  height: 100%;
  transition: all 0.2s ease;
  
  &.is-active {
    background-color: rgba(#f3f4f6, 0.5);
  }
  
  &__content {
    position: relative;
    width: 100%;
    height: 100%;
  }
  
  &__overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(#fff, 0.8);
    z-index: 50;
    display: flex;
    align-items: center;
    justify-content: center;
    pointer-events: none;
  }
  
  &__message {
    text-align: center;
    color: #4f46e5;
    
    p {
      margin-top: 1rem;
      font-size: 1.125rem;
      font-weight: 600;
    }
  }
}
</style> 