<template>
  <div class="image-preview">
    <div class="preview-container">
      <img
        :src="src"
        :alt="alt"
        :style="{
          width: width || '100%',
          height: height || 'auto',
          objectFit: objectFit || 'contain',
        }"
        @click="$emit('click')"
      />
      <div v-if="isHovered" class="preview-overlay">
        <div class="preview-actions">
          <button class="action-button" @click="$emit('edit')" title="编辑">
            <Edit :size="20" />
          </button>
          <button class="action-button" @click="$emit('delete')" title="删除">
            <Trash2 :size="20" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Edit, Trash2 } from 'lucide-vue-next'

defineProps<{
  src: string
  alt?: string
  width?: string
  height?: string
  objectFit?: 'contain' | 'cover'
}>()

defineEmits<{
  (e: 'click'): void
  (e: 'edit'): void
  (e: 'delete'): void
}>()

const isHovered = ref(false)
</script>

<style scoped>
.image-preview {
  width: 100%;
}

.preview-container {
  position: relative;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
}

.preview-container img {
  display: block;
  max-width: 100%;
  height: auto;
  transition: transform 0.2s;
}

.preview-container:hover img {
  transform: scale(1.02);
}

.preview-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.2s;
}

.preview-container:hover .preview-overlay {
  opacity: 1;
}

.preview-actions {
  display: flex;
  gap: 1rem;
}

.action-button {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.9);
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.action-button:hover {
  background: white;
  transform: scale(1.1);
}

.action-button:active {
  transform: scale(0.95);
}
</style> 