<template>
  <ToolbarButton
    @click="toggleTable"
    :isActive="editor?.isActive('table')"
    title="表格"
  >
    <LucideTable :size="TOOLBAR_ICON_SIZE" />
  </ToolbarButton>
</template>

<script setup lang="ts">
import { Editor } from '@tiptap/core'
import { LucideTable } from 'lucide-vue-next'
import ToolbarButton from './ToolbarButton.vue'
import { TOOLBAR_ICON_SIZE } from '../../constants/editor'

const props = defineProps<{
  editor: Editor | null | undefined
}>()

const toggleTable = () => {
  if (!props.editor) return
  
  if (props.editor.isActive('table')) {
    // 如果当前已在表格中，不执行任何操作
    return
  }
  
  // 插入3x3的表格
  props.editor.chain().focus()
    .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
    .run()
}
</script> 