<template>
  <BubbleMenu
    v-if="editor && editor.isActive('resizableImage')"
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
          @change="updateSize"
          class="size-input"
          min="50"
        />
      </div>
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
const shouldShow = ({ editor, view, state, from }) => {
  const { doc, selection } = state
  const { empty, anchor } = selection
  
  // 只在选中图片时显示
  return editor.isActive('resizableImage')
}

// 获取当前图片的属性
const imageAttributes = computed(() => {
  if (!props.editor) return {}
  
  if (props.editor.isActive('resizableImage')) {
    return props.editor.getAttributes('resizableImage')
  }
  
  return {}
})

// 图片宽度
const imageWidth = ref<number | null>(null)
const currentAlignment = ref('center')

// 监听图片属性变化
watch(
  imageAttributes,
  (attrs) => {
    const width = attrs.width
    const alignment = attrs.alignment || 'center'
    
    // 更新宽度输入框的值
    if (width) {
      imageWidth.value = parseInt(width)
    } else {
      imageWidth.value = null
    }
    
    currentAlignment.value = alignment
  },
  { immediate: true }
)

// 更新图片尺寸
const updateSize = () => {
  if (!props.editor || !imageWidth.value) return
  
  props.editor
    .chain()
    .focus()
    .command(({ commands }) => {
      return commands.updateAttributes('resizableImage', { width: `${imageWidth.value}px` })
    })
    .run()
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
  padding: 0.5rem;
  border-radius: 4px;
  background: white;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
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
        font-size: 0.75rem;
        color: #4b5563;
      }
      
      .size-input {
        width: 3rem;
        padding: 0.15rem 0.25rem;
        border: 1px solid #e5e7eb;
        border-radius: 4px;
        font-size: 0.75rem;
      }
    }
  }
}
</style> 