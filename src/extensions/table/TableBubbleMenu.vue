<template>
  <BubbleMenu
    v-if="editor"
    :editor="editor"
    :tippy-options="{ duration: 100 }"
    :should-show="shouldShow"
  >
    <div class="table-bubble-menu">
      <button @click="addColumnBefore" title="在前面插入列">
        <LucideColumns :size="16" />
      </button>
      <button @click="addColumnAfter" title="在后面插入列">
        <LucideColumns :size="16" />
      </button>
      <button @click="deleteColumn" title="删除列">
        <LucideDelete :size="16" />
      </button>
      <div class="divider"></div>
      <button @click="addRowBefore" title="在上方插入行">
        <LucideRows :size="16" />
      </button>
      <button @click="addRowAfter" title="在下方插入行">
        <LucideRows :size="16" />
      </button>
      <button @click="deleteRow" title="删除行">
        <LucideDelete :size="16" />
      </button>
      <div class="divider"></div>
      <button @click="toggleHeaderColumn" :class="{ active: isHeaderColumn }" title="切换标题列">
        <LucideHeading1 :size="16" />
      </button>
      <button @click="toggleHeaderRow" :class="{ active: isHeaderRow }" title="切换标题行">
        <LucideHeading :size="16" />
      </button>
      <div class="divider"></div>
      <button @click="mergeOrSplitCells" title="合并或分离单元格">
        <LucideMerge :size="16" />
      </button>
      <button @click="deleteTable" title="删除表格">
        <LucideTrash2 :size="16" />
      </button>
    </div>
  </BubbleMenu>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Editor, BubbleMenu } from '@tiptap/vue-3'
import { 
  LucideColumns, 
  LucideRows, 
  LucideDelete, 
  LucideHeading1, 
  LucideHeading, 
  LucideMerge, 
  LucideTrash2 
} from 'lucide-vue-next'

const props = defineProps<{
  editor: Editor | null
}>()

// 检查是否显示表格气泡菜单
const shouldShow = ({ editor, view, state, oldState, from, to }: any) => {
  return editor.isActive('table')
}

const isHeaderRow = computed(() => props.editor?.isActive({ row: 0 }))
const isHeaderColumn = computed(() => props.editor?.isActive('tableHeaderCell'))

// 表格操作方法
const addColumnBefore = () => {
  props.editor?.chain().focus().addColumnBefore().run()
}

const addColumnAfter = () => {
  props.editor?.chain().focus().addColumnAfter().run()
}

const deleteColumn = () => {
  props.editor?.chain().focus().deleteColumn().run()
}

const addRowBefore = () => {
  props.editor?.chain().focus().addRowBefore().run()
}

const addRowAfter = () => {
  props.editor?.chain().focus().addRowAfter().run()
}

const deleteRow = () => {
  props.editor?.chain().focus().deleteRow().run()
}

const toggleHeaderRow = () => {
  props.editor?.chain().focus().toggleHeaderRow().run()
}

const toggleHeaderColumn = () => {
  props.editor?.chain().focus().toggleHeaderColumn().run()
}

const mergeOrSplitCells = () => {
  const canMerge = props.editor?.can().mergeCells()
  
  if (canMerge) {
    props.editor?.chain().focus().mergeCells().run()
  } else {
    props.editor?.chain().focus().splitCell().run()
  }
}

const deleteTable = () => {
  props.editor?.chain().focus().deleteTable().run()
}
</script>

<style lang="scss" scoped>
.table-bubble-menu {
  display: flex;
  background-color: #fff;
  padding: 5px;
  border-radius: 6px;
  box-shadow: 0 3px 15px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
  
  button {
    width: 28px;
    height: 28px;
    border: none;
    background: none;
    border-radius: 4px;
    padding: 0;
    margin: 0 2px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    color: #4b5563;
    
    &:hover {
      background-color: #f3f4f6;
      color: #1f2937;
    }
    
    &.active {
      background-color: #e5e7eb;
      color: #1f2937;
    }
  }
  
  .divider {
    width: 1px;
    margin: 0 4px;
    background-color: #e5e7eb;
  }
}
</style> 