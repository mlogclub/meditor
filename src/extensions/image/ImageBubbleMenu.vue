<template>
  <BubbleMenu
    v-if="editor"
    :tippy-options="{
      placement: 'top',
      theme: 'light',
    }"
    :editor="editor"
    :should-show="shouldShow"
    class="image-bubble-menu"
  >
    <div class="image-controls">
      <button
        class="control-button align-left"
        :class="{ active: currentAlignment === 'left' }"
        @click="setAlignment('left')"
        title="左对齐"
      >
        <LucideAlignLeft :size="16" />
      </button>
      <button
        class="control-button align-center"
        :class="{ active: currentAlignment === 'center' }"
        @click="setAlignment('center')"
        title="居中对齐"
      >
        <LucideAlignCenter :size="16" />
      </button>
      <button
        class="control-button align-right"
        :class="{ active: currentAlignment === 'right' }"
        @click="setAlignment('right')"
        title="右对齐"
      >
        <LucideAlignRight :size="16" />
      </button>
      <div class="size-controls">
        <span>宽度:</span>
        <input
          type="number"
          v-model="imageWidth"
          @change="(e) => updateSize('width', (e.target as HTMLInputElement).value)"
          class="size-input"
          min="50"
        />
      </div>
      <!-- <div class="size-controls">
        <span>高度:</span>
        <input
          type="number"
          v-model="imageHeight"
          @change="(e) => updateSize('height', (e.target as HTMLInputElement).value)"
          class="size-input"
          min="50"
        />
      </div> -->
    </div>
  </BubbleMenu>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { BubbleMenu } from '@tiptap/vue-3'
import { Editor, isNodeSelection } from '@tiptap/core'
import { LucideAlignLeft, LucideAlignCenter, LucideAlignRight } from 'lucide-vue-next'

const props = defineProps<{
  editor: Editor | null
}>()

// 判断菜单是否应该显示
const shouldShow = ({ editor, view, state }) => {
  const { selection } = state
  
  // 检查是否为节点选择
  if (!isNodeSelection(selection)) {
    return false
  }
  
  // 获取选中的节点
  const nodeType = selection.node.type.name
  
  // 只有当选择的是 resizableImage 节点时才显示
  return nodeType === 'resizableImage'
}

// 获取当前图片的属性
const imageAttributes = computed(() => {
  if (!props.editor) return {}
  
  if (props.editor.isActive('resizableImage')) {
    return props.editor.getAttributes('resizableImage')
  }
  
  return {}
})

// 图片宽度和原始宽高比
const imageWidth = ref<string | number | null>(null)
const imageHeight = ref<string | number | null>(null)
const currentAlignment = ref('center')
const aspectRatio = ref<number | null>(null)
const originalWidth = ref<number | null>(null)
const originalHeight = ref<number | null>(null)
const nodeId = ref<string | null>(null)

// 监听图片属性变化
watch(
  imageAttributes,
  (attrs) => {
    console.log('图片属性变化:', attrs)
    const width = attrs.width
    const height = attrs.height
    const alignment = attrs.alignment || 'center'
    
    // 更新宽度输入框的值
    if (width) {
      const widthValue = typeof width === 'string' 
        ? parseInt(width.replace('px', '')) 
        : typeof width === 'number' ? width : null
        
      if (widthValue) {
        imageWidth.value = widthValue
        originalWidth.value = widthValue
      }
    } else {
      imageWidth.value = null
      originalWidth.value = null
    }
    
    // 保存高度值
    if (height) {
      const heightValue = typeof height === 'string'
        ? parseInt(height.replace('px', ''))
        : typeof height === 'number' ? height : null
        
      if (heightValue) {
        originalHeight.value = heightValue
      }
    } else {
      originalHeight.value = null
    }
    
    // 计算宽高比
    if (originalWidth.value && originalHeight.value) {
      aspectRatio.value = originalWidth.value / originalHeight.value
    }
    
    currentAlignment.value = alignment
  },
  { immediate: true }
)

// 更新图片尺寸（保持宽高比）
const updateSize = (type: 'width' | 'height', value: string) => {
  const numValue = parseInt(value)
  if (!numValue || numValue <= 0) return

  // 获取当前宽高
  const currentWidth = typeof imageWidth.value === 'string' 
    ? parseInt(imageWidth.value.replace(/px$/, '')) 
    : imageWidth.value
  const currentHeight = typeof imageHeight.value === 'string'
    ? parseInt(imageHeight.value.replace(/px$/, ''))
    : imageHeight.value
  
  // 保存宽高比，如果尚未设置
  if (!aspectRatio.value && currentWidth && currentHeight) {
    aspectRatio.value = currentWidth / currentHeight
  }

  let newWidth: number | null = null
  let newHeight: number | null = null

  // 根据用户输入类型和宽高比计算另一个维度
  if (type === 'width') {
    newWidth = numValue
    
    // 如果有宽高比，根据宽度计算高度
    if (aspectRatio.value) {
      newHeight = Math.round(numValue / aspectRatio.value)
    } else {
      // 如果没有宽高比，保持原来的高度
      newHeight = currentHeight
    }
  } else {
    newHeight = numValue
    
    // 如果有宽高比，根据高度计算宽度
    if (aspectRatio.value) {
      newWidth = Math.round(numValue * aspectRatio.value)
    } else {
      // 如果没有宽高比，保持原来的宽度
      newWidth = currentWidth
    }
  }

  // 更新编辑器中的图片节点属性
  props.editor
    .chain()
    .focus()
    .updateAttributes('resizableImage', {
      width: newWidth ? `${newWidth}px` : undefined,
      height: newHeight ? `${newHeight}px` : undefined,
    })
    .run()

  // 更新本地状态，确保UI显示一致
  imageWidth.value = newWidth ? newWidth : null
  imageHeight.value = newHeight ? newHeight : null
  
  // 在下一个事件循环中触发图片重绘
  setTimeout(() => {
    const imgNode = document.querySelector(`img[data-node-id="${nodeId.value}"]`)
    if (imgNode) {
      console.log('触发图片重绘', newWidth, newHeight)
      // 触发强制重绘
      ;(imgNode as HTMLElement).style.width = newWidth ? `${newWidth}px` : ''
      ;(imgNode as HTMLElement).style.height = newHeight ? `${newHeight}px` : ''
    }
  }, 0)
}

// 设置图片对齐方式
const setAlignment = (alignment: string) => {
  if (!props.editor) return
  
  props.editor
    .chain()
    .focus()
    .command(({ commands }) => {
      return commands.updateAttributes('resizableImage', { alignment })
    })
    .run()
    
  currentAlignment.value = alignment
}
</script>

<style lang="scss">
.image-bubble-menu {
  display: flex;
  z-index: 100;
  
  .image-controls {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    
    .control-button {
      padding: 0.25rem;
      border: 1px solid #e5e7eb;
      border-radius: 4px;
      background: white;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #4b5563;
      
      &:hover {
        background: #f3f4f6;
        border-color: #d1d5db;
        color: #1f2937;
      }
      
      &.active {
        background: #e5e7eb;
        border-color: #d1d5db;
        color: #1f2937;
      }
    }
    
    .size-controls {
      display: flex;
      align-items: center;
      gap: 0.25rem;
      margin-left: 0.5rem;
      
      span {
        font-size: 0.8rem;
        color: #4b5563;
      }
      
      .size-input {
        width: 3rem;
        padding: 0.15rem 0.25rem;
        border: 1px solid #e5e7eb;
        border-radius: 4px;
        font-size: 0.8rem;
      }
    }
  }
}
</style> 