<template>
  <div class="color-picker" v-click-outside="close">
    <button class="color-button" @click="togglePicker" :style="buttonStyle">
      <span class="color-preview" :style="{ backgroundColor: modelValue || 'transparent' }"></span>
      <lucide-chevron-down v-if="!isOpen" class="icon" :size="14" />
      <lucide-chevron-up v-else class="icon" :size="14" />
    </button>
    <div v-if="isOpen" class="color-panel">
      <div class="color-section">
        <div class="color-row">
          <button class="color-item no-color" @click="selectColor('')">
            <lucide-slash class="slash-icon" :size="16" />
          </button>
          <button
            v-for="color in standardColors"
            :key="color"
            class="color-item"
            :style="{ backgroundColor: color }"
            @click="selectColor(color)"
          ></button>
        </div>
      </div>
      <div class="color-section">
        <div class="section-title">最近使用</div>
        <div class="color-row">
          <button
            v-for="color in recentColors"
            :key="color"
            class="color-item"
            :style="{ backgroundColor: color }"
            @click="selectColor(color)"
          ></button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { LucideChevronDown, LucideChevronUp, LucideSlash } from 'lucide-vue-next'
import { vClickOutside } from '@/directives/click-outside'

const props = defineProps<{
  modelValue: string
  type?: 'text' | 'background'
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

const isOpen = ref(false)
const recentColors = ref<string[]>([])

const standardColors = [
  '#EF4444', // Red
  '#FF5722', // Deep Orange
  '#FFA000', // Amber
  '#FFEB3B', // Yellow
  '#8BC34A', // Light Green
  '#4CAF50', // Green
  '#03A9F4', // Light Blue
  '#2196F3', // Blue
  '#1A237E', // Dark Blue
  '#9C27B0', // Purple
  '#000000', // Black
  '#FFFFFF', // White
  '#607D8B', // Blue Grey
  '#3F51B5', // Indigo
  '#FF9800', // Orange
  '#9E9E9E', // Grey
  '#FFCA28', // Amber
  '#4FC3F7', // Light Blue
  '#66BB6A', // Light Green
]

const buttonStyle = computed(() => ({
  border: props.modelValue ? `1px solid ${props.modelValue}` : '1px solid #ddd',
}))

const togglePicker = () => {
  isOpen.value = !isOpen.value
}

const close = () => {
  isOpen.value = false
}

const selectColor = (color: string) => {
  emit('update:modelValue', color)
  if (color && !recentColors.value.includes(color)) {
    recentColors.value.unshift(color)
    if (recentColors.value.length > 6) {
      recentColors.value.pop()
    }
  }
  close()
}
</script>

<style scoped>
.color-picker {
  position: relative;
  display: inline-block;
}

.color-button {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  border-radius: 4px;
  background: white;
  cursor: pointer;
}

.color-preview {
  width: 16px;
  height: 16px;
  border-radius: 2px;
  border: 1px solid #ddd;
}

.color-panel {
  position: absolute;
  top: 100%;
  left: 0;
  margin-top: 4px;
  background: white;
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  min-width: 200px;
}

.color-section {
  margin-bottom: 8px;
}

.section-title {
  font-size: 12px;
  color: #666;
  margin-bottom: 4px;
}

.color-row {
  display: grid;
  grid-template-columns: repeat(10, 1fr);
  gap: 4px;
}

.color-item {
  width: 20px;
  height: 20px;
  border-radius: 2px;
  border: 1px solid #ddd;
  cursor: pointer;
  padding: 0;
}

.color-item:hover {
  transform: scale(1.1);
}

.no-color {
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
}

.slash-icon {
  color: #666;
}

.icon {
  color: #666;
}
</style> 