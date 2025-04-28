<template>
  <node-view-wrapper class="resizable-image-wrapper" :class="{ 'selected': selected }">
    <img
      :src="node.attrs.src"
      :alt="node.attrs.alt"
      :title="node.attrs.title"
      :width="node.attrs.width"
      :height="node.attrs.height"
      :data-alignment="node.attrs.alignment"
      :style="imageStyle"
      class="resizable-image"
      v-resizable="{ editor }"
    />
    <div v-if="selected" class="resize-border"></div>
    <div v-if="selected" class="resize-handles">
      <div class="resize-handle resize-handle-nw"></div>
      <div class="resize-handle resize-handle-ne"></div>
      <div class="resize-handle resize-handle-sw"></div>
      <div class="resize-handle resize-handle-se"></div>
      <div class="resize-handle resize-handle-n"></div>
      <div class="resize-handle resize-handle-s"></div>
      <div class="resize-handle resize-handle-e"></div>
      <div class="resize-handle resize-handle-w"></div>
    </div>
  </node-view-wrapper>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { NodeViewWrapper } from '@tiptap/vue-3'

const props = defineProps({
  editor: {
    type: Object,
    required: true
  },
  node: {
    type: Object,
    required: true
  },
  updateAttributes: {
    type: Function,
    required: true
  },
  selected: {
    type: Boolean,
    default: false
  }
})

// 计算图片样式
const imageStyle = computed(() => {
  const { alignment } = props.node.attrs
  
  const alignStyle = alignment 
    ? `display: block; margin: ${alignment === 'center' ? '0 auto' : alignment === 'left' ? '0 auto 0 0' : '0 0 0 auto'};`
    : ''
    
  return alignStyle
})
</script>

<style>
.resizable-image-wrapper {
  position: relative;
  display: inline-block;
  max-width: 100%;
  line-height: 0;
}

.resizable-image {
  max-width: 100%;
  height: auto;
  user-select: none;
}

/* 选中图片时显示边框 */
.resizable-image-wrapper.selected {
  position: relative;
}

/* 调整大小的边框 */
.resize-border {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border: 2px solid #3b82f6;
  pointer-events: none; /* 允许点击穿透 */
}

/* 调整大小的手柄 */
.resize-handles {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none; /* 允许点击穿透到底层 */
}

.resize-handle {
  position: absolute;
  width: 10px;
  height: 10px;
  background-color: white;
  border: 2px solid #3b82f6;
  border-radius: 50%;
  pointer-events: auto; /* 手柄可以接收事件 */
}

.resize-handle-nw {
  top: -6px;
  left: -6px;
  cursor: nwse-resize;
}

.resize-handle-ne {
  top: -6px;
  right: -6px;
  cursor: nesw-resize;
}

.resize-handle-sw {
  bottom: -6px;
  left: -6px;
  cursor: nesw-resize;
}

.resize-handle-se {
  bottom: -6px;
  right: -6px;
  cursor: nwse-resize;
}

.resize-handle-n {
  top: -6px;
  left: calc(50% - 5px);
  cursor: ns-resize;
}

.resize-handle-s {
  bottom: -6px;
  left: calc(50% - 5px);
  cursor: ns-resize;
}

.resize-handle-e {
  right: -6px;
  top: calc(50% - 5px);
  cursor: ew-resize;
}

.resize-handle-w {
  left: -6px;
  top: calc(50% - 5px);
  cursor: ew-resize;
}

/* 调整大小时的样式 */
.ProseMirror.resizing-image {
  user-select: none;
  cursor: nwse-resize;
}
</style> 