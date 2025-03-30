<template>
  <div class="image-upload">
    <div class="upload-area" @click="triggerFileInput" @drop.prevent="handleDrop" @dragover.prevent>
      <input
        ref="fileInput"
        type="file"
        accept="image/*"
        class="hidden"
        @change="handleFileChange"
      />
      <div class="upload-content">
        <svg
          class="upload-icon"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="17 8 12 3 7 8" />
          <line x1="12" y1="3" x2="12" y2="15" />
        </svg>
        <div class="upload-text">
          <p>点击或拖拽图片到此处上传</p>
          <p class="upload-tip">支持 jpg、png、gif 格式</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const emit = defineEmits<{
  (e: 'upload', file: File): void
}>()

const fileInput = ref<HTMLInputElement | null>(null)

const triggerFileInput = () => {
  fileInput.value?.click()
}

const handleFileChange = (event: Event) => {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (file && file.type.startsWith('image/')) {
    emit('upload', file)
  }
}

const handleDrop = (event: DragEvent) => {
  const file = event.dataTransfer?.files[0]
  if (file && file.type.startsWith('image/')) {
    emit('upload', file)
  }
}
</script>

<style scoped>
.image-upload {
  width: 100%;
}

.upload-area {
  border: 2px dashed #e5e7eb;
  border-radius: 8px;
  padding: 2rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s;
  background: #f9fafb;
}

.upload-area:hover {
  border-color: #3b82f6;
  background: #f3f4f6;
}

.upload-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.upload-icon {
  width: 48px;
  height: 48px;
  color: #6b7280;
}

.upload-text {
  color: #374151;
}

.upload-tip {
  font-size: 0.875rem;
  color: #6b7280;
  margin-top: 0.5rem;
}

.hidden {
  display: none;
}

/* 暗色主题 */
.dark .upload-area {
  border-color: #374151;
  background: #1f2937;
}

.dark .upload-area:hover {
  border-color: #60a5fa;
  background: #374151;
}

.dark .upload-icon {
  color: #9ca3af;
}

.dark .upload-text {
  color: #f3f4f6;
}

.dark .upload-tip {
  color: #9ca3af;
}
</style> 