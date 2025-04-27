<template>
  <div class="table-button-container">
    <ToolbarButton
      @click="showSelector = !showSelector"
      :isActive="editor?.isActive('table')"
      title="表格"
    >
      <LucideTable :size="TOOLBAR_ICON_SIZE" />
    </ToolbarButton>

    <div v-if="showSelector" class="table-selector">
      <div class="table-size-display">{{ selectedRows }} × {{ selectedCols }}</div>
      <div class="table-grid" @click="insertTable">
        <div 
          v-for="row in 10" 
          :key="`row-${row}`" 
          class="table-grid-row"
        >
          <div 
            v-for="col in 10" 
            :key="`cell-${row}-${col}`" 
            class="table-grid-cell"
            :class="{ 'is-selected': isSelected(row, col) }"
            @mouseover="updateSelection(row, col)"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Editor } from '@tiptap/core'
import { LucideTable } from 'lucide-vue-next'
import ToolbarButton from './ToolbarButton.vue'
import { TOOLBAR_ICON_SIZE } from '../../constants/editor'
import { ref, onMounted, onBeforeUnmount } from 'vue'

const props = defineProps<{
  editor: Editor | null | undefined
}>()

const showSelector = ref(false)
const selectedRows = ref(3)
const selectedCols = ref(4)

const updateSelection = (row: number, col: number) => {
  selectedRows.value = row
  selectedCols.value = col
}

const isSelected = (row: number, col: number) => {
  return row <= selectedRows.value && col <= selectedCols.value
}

const insertTable = () => {
  if (!props.editor) return
  
  props.editor.chain().focus()
    .insertTable({ 
      rows: selectedRows.value, 
      cols: selectedCols.value, 
      withHeaderRow: true 
    })
    .run()
    
  showSelector.value = false
}

// 点击外部时关闭选择器
const handleClickOutside = (event: MouseEvent) => {
  const target = event.target as HTMLElement
  const container = document.querySelector('.table-button-container')
  if (container && !container.contains(target)) {
    showSelector.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.table-button-container {
  position: relative;
}

.table-selector {
  position: absolute;
  top: 100%;
  left: 0;
  margin-top: 8px;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 12px;
  z-index: 100;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.table-size-display {
  text-align: center;
  margin-bottom: 5px;
  font-size: 14px;
  color: #4b5563;
}

.table-grid {
  display: flex;
  flex-direction: column;
  gap: 2px;
  cursor: pointer;
}

.table-grid-row {
  display: flex;
  gap: 2px;
}

.table-grid-cell {
  width: 12px;
  height: 12px;
  background-color: #e5e7eb;
  border-radius: 1px;
}

.table-grid-cell.is-selected {
  background-color: #3b82f6;
}
</style> 