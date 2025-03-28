<template>
  <div class="slash-commands">
    <button
      v-for="item in items"
      :key="item.title"
      class="slash-item"
      :class="{ 'is-selected': item === selectedItem }"
      @click="selectItem(item)"
    >
      <component :is="item.icon" class="item-icon" :size="18" />
      <div class="item-content">
        <div class="item-title">{{ item.title }}</div>
        <div class="item-description">{{ item.description }}</div>
      </div>
    </button>
  </div>
</template>

<script lang="ts">
import type { Component } from 'vue'
import type { Editor } from '@tiptap/core'
import {
  Heading1,
  Heading2,
  List,
  ListOrdered,
  Quote,
  Code2,
  Image as ImageIcon,
  MinusSquare,
  Table as TableIcon,
} from 'lucide-vue-next'

export interface CommandItem {
  title: string
  description: string
  icon: Component
  command: ({ editor, range }: { editor: Editor; range: { from: number; to: number } }) => void
}

export const getSuggestionItems = () => [
  {
    title: '标题1',
    description: '大标题',
    icon: Heading1,
    command: ({ editor, range }: { editor: Editor; range: { from: number; to: number } }) => {
      editor.chain().focus().deleteRange(range).setNode('heading', { level: 1 }).run()
    },
  },
  {
    title: '标题2',
    description: '二级标题',
    icon: Heading2,
    command: ({ editor, range }: { editor: Editor; range: { from: number; to: number } }) => {
      editor.chain().focus().deleteRange(range).setNode('heading', { level: 2 }).run()
    },
  },
  {
    title: '无序列表',
    description: '创建无序列表',
    icon: List,
    command: ({ editor, range }: { editor: Editor; range: { from: number; to: number } }) => {
      editor.chain().focus().deleteRange(range).toggleBulletList().run()
    },
  },
  {
    title: '有序列表',
    description: '创建有序列表',
    icon: ListOrdered,
    command: ({ editor, range }: { editor: Editor; range: { from: number; to: number } }) => {
      editor.chain().focus().deleteRange(range).toggleOrderedList().run()
    },
  },
  {
    title: '引用',
    description: '插入引用文本',
    icon: Quote,
    command: ({ editor, range }: { editor: Editor; range: { from: number; to: number } }) => {
      editor.chain().focus().deleteRange(range).toggleBlockquote().run()
    },
  },
  {
    title: '代码块',
    description: '插入代码块',
    icon: Code2,
    command: ({ editor, range }: { editor: Editor; range: { from: number; to: number } }) => {
      editor.chain().focus().deleteRange(range).toggleCodeBlock().run()
    },
  },
  {
    title: '图片',
    description: '插入图片',
    icon: ImageIcon,
    command: ({ editor, range }: { editor: Editor; range: { from: number; to: number } }) => {
      const url = window.prompt('输入图片URL')
      if (url) {
        editor.chain().focus().deleteRange(range).setImage({ src: url }).run()
      }
    },
  },
  {
    title: '分割线',
    description: '插入水平分割线',
    icon: MinusSquare,
    command: ({ editor, range }: { editor: Editor; range: { from: number; to: number } }) => {
      editor.chain().focus().deleteRange(range).setHorizontalRule().run()
    },
  },
  {
    title: '表格',
    description: '插入表格',
    icon: TableIcon,
    command: ({ editor, range }: { editor: Editor; range: { from: number; to: number } }) => {
      editor
        .chain()
        .focus()
        .deleteRange(range)
        .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
        .run()
    },
  },
]
</script>

<script setup lang="ts">
import { ref, watch } from 'vue'

const props = defineProps<{
  items: CommandItem[]
  command: (item: CommandItem) => void
  editor: any
  range: { from: number; to: number }
  clientRect: DOMRect | null
}>()

const selectedItem = ref<CommandItem | null>(null)
const selectedIndex = ref(0)

// 初始化选中第一项
if (props.items.length > 0) {
  selectedItem.value = props.items[0]
}

// 监听 items 变化，当 items 为空时清除选中项
// 当 items 有值但没有选中项时，选择第一项
watch(() => props.items, (newItems) => {
  if (newItems.length === 0) {
    selectedItem.value = null;
    selectedIndex.value = 0;
  } else if (!selectedItem.value && newItems.length > 0) {
    selectedItem.value = newItems[0];
    selectedIndex.value = 0;
  }
}, { immediate: true });

const selectItem = (item: CommandItem) => {
  selectedItem.value = item
  props.command(item)
}

const onKeyDown = (event: KeyboardEvent): boolean => {
  // 如果没有菜单项，不处理键盘事件
  if (props.items.length === 0) {
    return false;
  }

  if (event.key === 'ArrowUp') {
    event.preventDefault()
    selectedIndex.value = (selectedIndex.value - 1 + props.items.length) % props.items.length
    selectedItem.value = props.items[selectedIndex.value]
    return true
  }

  if (event.key === 'ArrowDown') {
    event.preventDefault()
    selectedIndex.value = (selectedIndex.value + 1) % props.items.length
    selectedItem.value = props.items[selectedIndex.value]
    return true
  }

  if (event.key === 'Enter' && selectedItem.value) {
    event.preventDefault()
    selectItem(selectedItem.value)
    return true
  }

  return false
}

defineExpose({
  onKeyDown,
})
</script>

<style>
.slash-commands {
  background: white;
  border-radius: 6px;
  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.05), 0px 10px 20px rgba(0, 0, 0, 0.1);
  padding: 0.5rem;
  width: 240px;
  max-height: 400px;
  overflow-y: auto;
}

.slash-item {
  display: flex;
  align-items: center;
  padding: 0.5rem;
  margin: 0;
  width: 100%;
  background: none;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  text-align: left;
}

.slash-item:hover,
.slash-item.is-selected {
  background: #f3f4f6;
}

.item-icon {
  margin-right: 0.75rem;
  color: #6b7280;
  flex-shrink: 0;
}

.item-content {
  overflow: hidden;
}

.item-title {
  font-size: 0.875rem;
  font-weight: 500;
  color: #111827;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.item-description {
  font-size: 0.75rem;
  color: #6b7280;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style> 