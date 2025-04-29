<template>
  <node-view-wrapper class="resizable-image-wrapper" :class="{ 'selected': selected }" :style="imageStyle">
    <img
      ref="imageRef"
      :src="node.attrs.src"
      :alt="node.attrs.alt"
      :title="node.attrs.title"
      :width="node.attrs.width"
      :height="node.attrs.height"
      :data-alignment="node.attrs.alignment"
      :data-aspect-ratio="aspectRatio"
      :style="imageStyle"
      class="resizable-image"
      v-resizable="{ editor, nodeId: node.attrs.id }"
      @load="calculateAspectRatio"
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
import { computed, onMounted, watch, ref } from 'vue'
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

const imageRef = ref<HTMLImageElement | null>(null)
const aspectRatio = ref<number | null>(null)
const originalWidth = ref<number | null>(null)
const originalHeight = ref<number | null>(null)

// 计算宽高比
const calculateAspectRatio = () => {
  const imgEl = imageRef.value
  if (!imgEl) return
  
  // 计算自然宽高比
  if (imgEl.naturalWidth && imgEl.naturalHeight) {
    aspectRatio.value = imgEl.naturalWidth / imgEl.naturalHeight
    // console.log('计算原始宽高比:', aspectRatio.value)
  } 
  // 如果已经设置了宽高
  else if (props.node.attrs.width && props.node.attrs.height) {
    const width = typeof props.node.attrs.width === 'string' 
      ? parseInt(props.node.attrs.width.replace('px', ''))
      : props.node.attrs.width
    const height = typeof props.node.attrs.height === 'string'
      ? parseInt(props.node.attrs.height.replace('px', ''))
      : props.node.attrs.height
    
    if (width && height) {
      aspectRatio.value = width / height
      // console.log('从属性计算宽高比:', aspectRatio.value)
    }
  }
  
  // 保存原始尺寸
  if (imgEl.width && imgEl.height) {
    originalWidth.value = imgEl.width
    originalHeight.value = imgEl.height
  }
  
  // 如果需要，可以更新图片节点属性
  if (aspectRatio.value && !props.node.attrs.aspectRatio) {
    props.updateAttributes({
      aspectRatio: aspectRatio.value
    })
  }
}

// 更新图片尺寸样式
const updateImageStyles = (width, height) => {
  const imgEl = imageRef.value
  if (!imgEl) return
  
  if (width) {
    imgEl.style.width = typeof width === 'string' ? width : `${width}px`
  }
  
  if (height) {
    imgEl.style.height = typeof height === 'string' ? height : `${height}px`
  }
  
  // console.log('直接更新图片样式:', width, height)
}

// 监听节点属性变化
watch(() => props.node.attrs, (newAttrs, oldAttrs) => {
  // console.log('图片属性更新:', newAttrs)
  
  // 如果宽高比存在于属性中，但本地没有
  if (newAttrs.aspectRatio && !aspectRatio.value) {
    aspectRatio.value = newAttrs.aspectRatio
  }
  
  // 检查宽度或高度是否发生变化
  const newWidth = newAttrs.width
  const oldWidth = oldAttrs?.width
  const newHeight = newAttrs.height
  const oldHeight = oldAttrs?.height
  
  if (newWidth !== oldWidth || newHeight !== oldHeight) {
    // 直接更新图片样式
    updateImageStyles(newWidth, newHeight)
  }
  
  // 更新原始尺寸记录
  if (newAttrs.width) {
    const width = typeof newAttrs.width === 'string'
      ? parseInt(newAttrs.width.replace('px', ''))
      : newAttrs.width
    
    if (width) {
      originalWidth.value = width
    }
  }
  
  if (newAttrs.height) {
    const height = typeof newAttrs.height === 'string'
      ? parseInt(newAttrs.height.replace('px', ''))
      : newAttrs.height
    
    if (height) {
      originalHeight.value = height
    }
  }
}, { deep: true })

// 组件挂载时
onMounted(() => {
  calculateAspectRatio()
  
  // 初始应用样式
  const { width, height } = props.node.attrs
  if (width || height) {
    updateImageStyles(width, height)
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
  /* max-width: 100%; */
  line-height: 0;
  display: block;
  width: max-content;
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