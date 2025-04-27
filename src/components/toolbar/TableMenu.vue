<template>
  <div class="table-menu" v-if="editor && editor.isActive('table')">
    <div class="table-menu-buttons">
      <button @click="addColumnBefore" title="在前面插入列">
        <LucideColumns :size="16" />
      </button>
      <button @click="addColumnAfter" title="在后面插入列">
        <LucideColumns :size="16" />
      </button>
      <button @click="deleteColumn" title="删除列">
        <LucideDelete :size="16" />
      </button>
      <button @click="addRowBefore" title="在上方插入行">
        <LucideRows :size="16" />
      </button>
      <button @click="addRowAfter" title="在下方插入行">
        <LucideRows :size="16" />
      </button>
      <button @click="deleteRow" title="删除行">
        <LucideDelete :size="16" />
      </button>
      <button @click="toggleHeaderColumn" :class="{ active: isHeaderColumn }" title="切换标题列">
        <LucideHeading1 :size="16" />
      </button>
      <button @click="toggleHeaderRow" :class="{ active: isHeaderRow }" title="切换标题行">
        <LucideHeading :size="16" />
      </button>
      <button @click="mergeOrSplitCells" title="合并或分离单元格">
        <LucideMerge :size="16" />
      </button>
      <button @click="deleteTable" title="删除表格">
        <LucideTrash2 :size="16" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Editor } from '@tiptap/core'
import { 
  LucideColumns, 
  LucideRows, 
  LucideDelete, 
  LucideHeading1, 
  LucideHeading, 
  LucideMerge, 
  LucideTrash2 
} from 'lucide-vue-next'
import { computed } from 'vue'

const props = defineProps<{
  editor: Editor | null | undefined
}>()

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
.table-menu {
  position: absolute;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  padding: 6px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  z-index: 10;
  display: flex;
  flex-direction: column;
  gap: 6px;
  
  .table-menu-buttons {
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
    
    button {
      padding: 4px;
      background: white;
      border: 1px solid #e5e7eb;
      border-radius: 4px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #4b5563;
      
      &:hover {
        background: #f3f4f6;
        color: #1f2937;
        transform: translateY(-1px);
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
      }
      
      &.active {
        background: #e5e7eb;
        color: #1f2937;
      }
      
      &:active {
        transform: translateY(0);
        box-shadow: none;
      }
    }
  }
}
</style> 