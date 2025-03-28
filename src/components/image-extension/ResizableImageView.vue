<template>
  <node-view-wrapper class="resizable-image-wrapper" :class="{ 'is-selected': isSelected }">
    <img
      :src="node.attrs.src"
      :alt="node.attrs.alt"
      :title="node.attrs.title"
      :style="{
        width: node.attrs.width || '100%',
        height: node.attrs.height || 'auto'
      }"
      @click="selectImage"
    />
    <div v-if="isSelected" class="resize-handles">
      <div
        v-for="(handle, index) in resizeHandles"
        :key="index"
        class="resize-handle"
        :class="handle.class"
        @mousedown.stop="startResize($event, handle)"
      />
    </div>
  </node-view-wrapper>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { NodeViewWrapper, nodeViewProps } from '@tiptap/vue-3'

const props = defineProps(nodeViewProps)

const isSelected = ref(props.selected)
const resizeHandles = [
  { class: 'top-left', cursor: 'nw-resize' },
  { class: 'top-right', cursor: 'ne-resize' },
  { class: 'bottom-left', cursor: 'sw-resize' },
  { class: 'bottom-right', cursor: 'se-resize' }
]

let startX = 0
let startY = 0
let startWidth = 0
let startHeight = 0
let isResizing = false
let activeHandle: string | null = null

const selectImage = () => {
  isSelected.value = true
}

const startResize = (event: MouseEvent, handle: { class: string }) => {
  event.preventDefault()
  isResizing = true
  activeHandle = handle.class
  startX = event.clientX
  startY = event.clientY
  startWidth = parseInt(props.node.attrs.width || '100')
  startHeight = parseInt(props.node.attrs.height || '100')
  
  document.addEventListener('mousemove', handleResize)
  document.addEventListener('mouseup', stopResize)
}

const handleResize = (event: MouseEvent) => {
  if (!isResizing || !activeHandle) return

  const deltaX = event.clientX - startX
  const deltaY = event.clientY - startY

  let newWidth = startWidth
  let newHeight = startHeight

  // 计算等比例缩放
  const aspectRatio = startWidth / startHeight

  switch (activeHandle) {
    case 'bottom-right':
      newWidth = startWidth + deltaX
      newHeight = newWidth / aspectRatio
      break
    case 'bottom-left':
      newWidth = startWidth - deltaX
      newHeight = newWidth / aspectRatio
      break
    case 'top-right':
      newWidth = startWidth + deltaX
      newHeight = newWidth / aspectRatio
      break
    case 'top-left':
      newWidth = startWidth - deltaX
      newHeight = newWidth / aspectRatio
      break
  }

  // 确保最小尺寸
  if (newWidth < 50) newWidth = 50
  if (newHeight < 50) newHeight = 50

  props.updateAttributes({
    width: `${newWidth}px`,
    height: `${newHeight}px`
  })
}

const stopResize = () => {
  isResizing = false
  activeHandle = null
  document.removeEventListener('mousemove', handleResize)
  document.removeEventListener('mouseup', stopResize)
}

onMounted(() => {
  document.addEventListener('click', (event) => {
    const target = event.target as HTMLElement
    if (!target.closest('.resizable-image-wrapper')) {
      isSelected.value = false
    }
  })
})

onBeforeUnmount(() => {
  document.removeEventListener('mousemove', handleResize)
  document.removeEventListener('mouseup', stopResize)
})
</script>

<style scoped>
.resizable-image-wrapper {
  position: relative;
  display: inline-block;
  max-width: 100%;
}

.resizable-image-wrapper img {
  display: block;
  max-width: 100%;
  height: auto;
}

.resize-handles {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
}

.resize-handle {
  position: absolute;
  width: 10px;
  height: 10px;
  background-color: #fff;
  border: 1px solid #1890ff;
  pointer-events: all;
}

.top-left {
  top: -5px;
  left: -5px;
  cursor: nw-resize;
}

.top-right {
  top: -5px;
  right: -5px;
  cursor: ne-resize;
}

.bottom-left {
  bottom: -5px;
  left: -5px;
  cursor: sw-resize;
}

.bottom-right {
  bottom: -5px;
  right: -5px;
  cursor: se-resize;
}

.is-selected img {
  outline: 1px solid #1890ff;
}
</style> 