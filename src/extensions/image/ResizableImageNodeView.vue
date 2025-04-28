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
    <!-- 在图片被选中时显示调整大小的边框和手柄 -->
    <template v-if="selected">
      <div class="resize-border"></div>
      <div class="resize-handles">
        <div class="resize-handle resize-handle-nw"></div>
        <div class="resize-handle resize-handle-n"></div>
        <div class="resize-handle resize-handle-ne"></div>
        <div class="resize-handle resize-handle-e"></div>
        <div class="resize-handle resize-handle-se"></div>
        <div class="resize-handle resize-handle-s"></div>
        <div class="resize-handle resize-handle-sw"></div>
        <div class="resize-handle resize-handle-w"></div>
      </div>
    </template>
  </node-view-wrapper>
</template>

<script setup lang="ts">
import { computed, onMounted, watch } from 'vue'
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

// 监听选中状态变化
watch(() => props.selected, (isSelected) => {
  console.log('图片选中状态:', isSelected)
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

.resizable-image-wrapper img {
  max-width: 100%;
  height: auto;
  user-select: none;
}

/* 选中图片时显示边框 */
.resizable-image-wrapper.selected {
  position: relative;
  z-index: 1;
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
  z-index: 2;
}

/* 调整大小的手柄容器 */
.resize-handles {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none; /* 允许点击穿透到底层 */
  z-index: 3;
}

/* 调整大小的手柄 */
.resize-handle {
  position: absolute;
  width: 12px;
  height: 12px;
  background-color: white;
  border: 2px solid #3b82f6;
  border-radius: 50%;
  pointer-events: auto; /* 手柄可以接收事件 */
  z-index: 4;
}

.resize-handle-nw {
  top: -7px;
  left: -7px;
  cursor: nwse-resize;
}

.resize-handle-n {
  top: -7px;
  left: calc(50% - 6px);
  cursor: ns-resize;
}

.resize-handle-ne {
  top: -7px;
  right: -7px;
  cursor: nesw-resize;
}

.resize-handle-e {
  right: -7px;
  top: calc(50% - 6px);
  cursor: ew-resize;
}

.resize-handle-se {
  bottom: -7px;
  right: -7px;
  cursor: nwse-resize;
}

.resize-handle-s {
  bottom: -7px;
  left: calc(50% - 6px);
  cursor: ns-resize;
}

.resize-handle-sw {
  bottom: -7px;
  left: -7px;
  cursor: nesw-resize;
}

.resize-handle-w {
  left: -7px;
  top: calc(50% - 6px);
  cursor: ew-resize;
}

/* 调整大小时的样式 */
.ProseMirror.resizing-image {
  user-select: none;
  cursor: nwse-resize;
}
</style> 