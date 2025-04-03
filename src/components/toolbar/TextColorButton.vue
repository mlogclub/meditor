<template>
  <div class="text-color-button">
    <ToolbarButton
      @click="toggleColorPicker"
      :isActive="hasTextColor"
      title="文字颜色"
    >
      <div class="button-content">
        <LucidePalette :size="TOOLBAR_ICON_SIZE" />
      </div>
    </ToolbarButton>
    <div class="color-indicator" :style="{ backgroundColor: textColor || 'transparent' }"></div>
    
    <div v-if="isColorPickerOpen" class="color-popup">
      <div class="color-picker-header">
        <span>标准色卡</span>
        <button class="clear-color" @click="clearColor" title="清除颜色">
          <div class="default-color">
            <LucideCheck :size="TOOLBAR_ICON_SIZE" v-if="!textColor" />
          </div>
        </button>
      </div>
      <div class="color-grid">
        <button
          v-for="color in standardColors"
          :key="color"
          class="color-option"
          :style="{ backgroundColor: color }"
          @click="applyColor(color)"
        ></button>
      </div>
      
      <div class="color-section-title">最近使用</div>
      <div class="color-grid recent">
        <button
          v-for="color in recentColors"
          :key="color"
          class="color-option"
          :style="{ backgroundColor: color }"
          @click="applyColor(color)"
        >
          <LucideCheck :size="TOOLBAR_ICON_SIZE" v-if="textColor === color" class="check-icon" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Editor } from '@tiptap/core'
import { LucidePalette, LucideCheck } from 'lucide-vue-next'
import ToolbarButton from './ToolbarButton.vue'
import { TOOLBAR_ICON_SIZE } from '../../constants/editor'
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'

const props = defineProps<{
  editor: Editor | null | undefined
}>()

const textColor = ref('')
const isColorPickerOpen = ref(false)
const recentColors = ref<string[]>([])

const standardColors = [
  '#c00000', '#ff0000', '#ffc000', '#ffff00', '#a5d610', '#00b050', '#00b0f0', '#0070c0', '#002060', '#7030a0', 
  '#ffffff', '#000000', '#eeeeee', '#525252', '#1890ff', '#ff7875', '#52c41a', '#fa8c16', '#722ed1', '#eb2f96'
]

const hasTextColor = computed(() => {
  if (!props.editor) return false
  const attrs = props.editor.getAttributes('textStyle')
  const color = attrs.color || ''
  textColor.value = color
  return !!color
})

const closeOnClickOutside = (event: MouseEvent) => {
  const target = event.target as HTMLElement
  const colorButton = document.querySelector('.text-color-button')
  
  if (colorButton && !colorButton.contains(target)) {
    isColorPickerOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', closeOnClickOutside)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', closeOnClickOutside)
})

const toggleColorPicker = (event: MouseEvent) => {
  event.stopPropagation()
  isColorPickerOpen.value = !isColorPickerOpen.value
}

const applyColor = (color: string) => {
  if (!props.editor) return
  textColor.value = color
  props.editor.chain().focus().setColor(color).run()
  
  // 添加到最近使用的颜色
  if (!recentColors.value.includes(color)) {
    recentColors.value.unshift(color)
    if (recentColors.value.length > 7) {
      recentColors.value.pop()
    }
  }
}

const clearColor = () => {
  if (!props.editor) return
  textColor.value = ''
  props.editor.chain().focus().unsetColor().run()
}
</script>

<style scoped>
.text-color-button {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.button-content {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.color-indicator {
  margin-top: -2px;
  width: 24px;
  height: 3px;
  border-radius: 1px;
}

.color-popup {
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  background: white;
  border: 1px solid #e1e1e1;
  border-radius: 8px;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
  width: 250px;
  z-index: 1000;
  padding: 12px;
}

.color-picker-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
  font-size: 14px;
  color: #333;
}

.clear-color {
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
}

.default-color {
  width: 20px;
  height: 20px;
  border-radius: 3px;
  border: 1px solid #ddd;
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
}

.check-icon {
  color: white;
}

.color-grid {
  display: grid;
  grid-template-columns: repeat(10, 1fr);
  gap: 6px;
  margin-bottom: 15px;
}

.color-grid.recent {
  grid-template-columns: repeat(7, 1fr);
}

.color-option {
  width: 20px;
  height: 20px;
  border-radius: 3px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.color-option:hover {
  transform: scale(1.15);
  transition: transform 0.2s;
}

.color-section-title {
  font-size: 14px;
  color: #333;
  margin-bottom: 8px;
}
</style> 