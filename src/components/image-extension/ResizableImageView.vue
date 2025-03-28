<template>
  <node-view-wrapper class="resizable-image-wrapper">
    <div 
      class="resizable-image" 
      :class="{ 'is-focused': selected }"
      :style="imageWrapperStyle"
    >
      <img
        :src="node.attrs.src"
        :alt="node.attrs.alt"
        :title="node.attrs.title"
        @click="selectImage"
      />
      
      <!-- 调整大小的控制点 -->
      <div v-if="selected" class="resize-handle top-left" @mousedown="startResize($event, 'top-left')"></div>
      <div v-if="selected" class="resize-handle top-right" @mousedown="startResize($event, 'top-right')"></div>
      <div v-if="selected" class="resize-handle bottom-left" @mousedown="startResize($event, 'bottom-left')"></div>
      <div v-if="selected" class="resize-handle bottom-right" @mousedown="startResize($event, 'bottom-right')"></div>
      
      <!-- 图片选中后显示的工具栏 -->
      <div v-if="selected" class="image-toolbar">
        <div class="toolbar-group">
          <label>宽:</label>
          <input 
            type="text" 
            v-model="imageWidth" 
            @input="updateImageSize"
            @blur="validateSize"
            placeholder="宽度"
          />
        </div>
        <div class="toolbar-group">
          <label>高:</label>
          <input 
            type="text" 
            v-model="imageHeight" 
            @input="updateImageSize"
            @blur="validateSize"
            placeholder="高度"
          />
        </div>
        <button class="upload-btn" @click="openFileInput">替换</button>
        <input 
          ref="fileInput" 
          type="file" 
          accept="image/*" 
          style="display: none" 
          @change="uploadImage"
        />
      </div>
    </div>
  </node-view-wrapper>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { NodeViewWrapper, nodeViewProps } from '@tiptap/vue-3'

const props = defineProps(nodeViewProps)

// 图片尺寸和状态
const fileInput = ref<HTMLInputElement | null>(null)
const selected = ref(false)
const imageWidth = ref(props.node.attrs.width || '100%')
const imageHeight = ref(props.node.attrs.height || 'auto')
let originalWidth = 0
let originalHeight = 0
let aspectRatio = 1
let resizing = false
let resizeHandle = ''
let startX = 0
let startY = 0
let startWidth = 0
let startHeight = 0

// 自动计算图片容器样式
const imageWrapperStyle = computed(() => {
  return {
    width: imageWidth.value,
    height: imageHeight.value,
  }
})

// 选择图片
const selectImage = () => {
  selected.value = true
}

// 开始调整大小
const startResize = (event: MouseEvent, handle: string) => {
  event.preventDefault()
  event.stopPropagation()
  
  resizing = true
  resizeHandle = handle
  startX = event.clientX
  startY = event.clientY
  
  // 获取当前图片尺寸（移除单位）
  const width = imageWidth.value
  const height = imageHeight.value
  
  startWidth = width.endsWith('%') 
    ? parseFloat(width) / 100 * (event.target as HTMLElement).parentElement?.clientWidth || 0
    : parseFloat(width)
  
  startHeight = height === 'auto'
    ? (event.target as HTMLElement).parentElement?.querySelector('img')?.clientHeight || 0
    : parseFloat(height)
  
  // 计算宽高比
  aspectRatio = startWidth / startHeight
  
  // 添加全局事件监听
  document.addEventListener('mousemove', handleResize)
  document.addEventListener('mouseup', stopResize)
}

// 处理调整大小
const handleResize = (event: MouseEvent) => {
  if (!resizing) return
  
  event.preventDefault()
  
  // 计算鼠标移动距离
  const dx = event.clientX - startX
  const dy = event.clientY - startY
  
  // 根据不同调整点计算新尺寸
  let newWidth = startWidth
  let newHeight = startHeight
  
  if (resizeHandle.includes('right')) {
    newWidth = startWidth + dx
  } else if (resizeHandle.includes('left')) {
    newWidth = startWidth - dx
  }
  
  if (resizeHandle.includes('bottom')) {
    newHeight = startHeight + dy
  } else if (resizeHandle.includes('top')) {
    newHeight = startHeight - dy
  }
  
  // 确保最小尺寸
  newWidth = Math.max(20, newWidth)
  newHeight = Math.max(20, newHeight)
  
  // 更新尺寸
  imageWidth.value = `${Math.round(newWidth)}px`
  imageHeight.value = `${Math.round(newHeight)}px`
  
  // 更新节点属性
  updateNodeAttributes()
}

// 停止调整大小
const stopResize = () => {
  resizing = false
  
  // 移除全局事件监听
  document.removeEventListener('mousemove', handleResize)
  document.removeEventListener('mouseup', stopResize)
}

// 手动更新图片尺寸
const updateImageSize = () => {
  validateSize()
  updateNodeAttributes()
}

// 验证尺寸输入
const validateSize = () => {
  // 确保宽度输入有效
  if (imageWidth.value !== 'auto' && imageWidth.value !== '') {
    if (!/%$|px$|em$|rem$|vw$|vh$/.test(imageWidth.value)) {
      // 如果没有单位，默认添加px
      if (!isNaN(parseFloat(imageWidth.value))) {
        imageWidth.value = `${parseFloat(imageWidth.value)}px`
      } else {
        imageWidth.value = '100%'
      }
    }
  } else if (imageWidth.value === '') {
    imageWidth.value = '100%'
  }

  // 确保高度输入有效
  if (imageHeight.value !== 'auto' && imageHeight.value !== '') {
    if (!/%$|px$|em$|rem$|vw$|vh$/.test(imageHeight.value)) {
      // 如果没有单位，默认添加px
      if (!isNaN(parseFloat(imageHeight.value))) {
        imageHeight.value = `${parseFloat(imageHeight.value)}px`
      } else {
        imageHeight.value = 'auto'
      }
    }
  } else if (imageHeight.value === '') {
    imageHeight.value = 'auto'
  }
}

// 更新节点属性
const updateNodeAttributes = () => {
  props.updateAttributes({
    width: imageWidth.value,
    height: imageHeight.value,
  })
}

// 打开文件选择
const openFileInput = () => {
  fileInput.value?.click()
}

// 处理图片上传
const uploadImage = (event: Event) => {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  
  if (file) {
    const reader = new FileReader()
    
    reader.onload = () => {
      props.updateAttributes({
        src: reader.result as string
      })
    }
    
    reader.readAsDataURL(file)
  }
  
  // 清除文件选择，以便可以再次选择同一文件
  input.value = ''
}

// 点击外部时取消选择
const handleClickOutside = (event: MouseEvent) => {
  const target = event.target as HTMLElement
  const isImageClick = target.closest('.resizable-image-wrapper')
  
  if (!isImageClick) {
    selected.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
  document.removeEventListener('mousemove', handleResize)
  document.removeEventListener('mouseup', stopResize)
})
</script>

<style scoped>
.resizable-image-wrapper {
  display: inline-block;
  position: relative;
  max-width: 100%;
}

.resizable-image {
  position: relative;
  display: inline-block;
  max-width: 100%;
}

.resizable-image img {
  display: block;
  max-width: 100%;
  height: auto;
  cursor: pointer;
}

.resizable-image.is-focused {
  outline: 2px solid #4f46e5;
}

.resize-handle {
  position: absolute;
  width: 10px;
  height: 10px;
  background-color: #4f46e5;
  border-radius: 50%;
  border: 2px solid white;
  z-index: 10;
  cursor: nwse-resize;
}

.resize-handle.top-left {
  top: -5px;
  left: -5px;
  cursor: nwse-resize;
}

.resize-handle.top-right {
  top: -5px;
  right: -5px;
  cursor: nesw-resize;
}

.resize-handle.bottom-left {
  bottom: -5px;
  left: -5px;
  cursor: nesw-resize;
}

.resize-handle.bottom-right {
  bottom: -5px;
  right: -5px;
  cursor: nwse-resize;
}

.image-toolbar {
  position: absolute;
  top: calc(100% + 10px);
  left: 0;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 4px;
  padding: 8px;
  display: flex;
  gap: 8px;
  z-index: 10;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.toolbar-group {
  display: flex;
  align-items: center;
  gap: 4px;
}

.toolbar-group label {
  font-size: 12px;
  color: #374151;
}

.toolbar-group input {
  width: 60px;
  height: 24px;
  border: 1px solid #d1d5db;
  border-radius: 2px;
  padding: 0 4px;
  font-size: 12px;
}

.upload-btn {
  background-color: #4f46e5;
  color: white;
  border: none;
  border-radius: 2px;
  padding: 0 8px;
  height: 24px;
  font-size: 12px;
  cursor: pointer;
}

.upload-btn:hover {
  background-color: #4338ca;
}
</style> 