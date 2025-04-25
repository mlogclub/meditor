<template>
  <node-view-wrapper class="notion-table-wrapper">
    <div class="notion-table">
      <!-- 表格头部工具栏 -->
      <div class="table-toolbar">
        <div class="toolbar-left">
          <button class="toolbar-btn" @click="addColumn">
            <PlusIcon class="icon" :size="16" />
            添加列
          </button>
          <button class="toolbar-btn" @click="addRow">
            <PlusIcon class="icon" :size="16" />
            添加行
          </button>
        </div>
        <div class="toolbar-right">
          <button class="toolbar-btn" @click="deleteTable">
            <Trash2Icon class="icon" :size="16" />
            删除表格
          </button>
        </div>
      </div>

      <!-- 表格主体 -->
      <div class="table-container">
        <table>
          <thead>
            <tr>
              <th v-for="(col, index) in columns" 
                  :key="col.id"
                  class="table-header"
                  :style="{ width: col.width + 'px' }">
                <div class="header-content">
                  <div class="header-text" contenteditable="true" @input="updateColumnTitle(index, $event)">
                    {{ col.title }}
                  </div>
                </div>
                <div class="resize-handle" 
                     @mousedown.prevent="startResize($event, index)"></div>
                <button class="delete-column" @click="deleteColumn(index)">
                  <XIcon class="icon" :size="14" />
                </button>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(row, rowIndex) in rows" :key="row.id">
              <td v-for="(col, colIndex) in columns" 
                  :key="col.id"
                  class="table-cell">
                <div class="cell-content" contenteditable="true" @input="updateCell(rowIndex, col.id, $event)">
                  {{ row[col.id] }}
                </div>
              </td>
              <td class="row-actions">
                <button class="delete-row" @click="deleteRow(rowIndex)">
                  <XIcon class="icon" :size="14" />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </node-view-wrapper>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { NodeViewWrapper } from '@tiptap/vue-3'
import { PlusIcon, Trash2Icon, XIcon } from 'lucide-vue-next'

interface Column {
  id: string
  title: string
  width: number
}

interface Row {
  id: string
  [key: string]: any
}

const props = defineProps<{
  node: any
  updateAttributes: (attrs: Record<string, any>) => void
  deleteNode: () => void
}>()

const columns = computed<Column[]>(() => props.node.attrs.columns)
const rows = computed<Row[]>(() => props.node.attrs.rows)

// 调整列宽相关
let isResizing = false
let currentColumn = -1
let startX = 0
let startWidth = 0

const startResize = (event: MouseEvent, columnIndex: number) => {
  isResizing = true
  currentColumn = columnIndex
  startX = event.pageX
  startWidth = columns.value[columnIndex].width

  document.addEventListener('mousemove', handleResize)
  document.addEventListener('mouseup', stopResize)
}

const handleResize = (event: MouseEvent) => {
  if (!isResizing) return
  
  const diff = event.pageX - startX
  const newWidth = Math.max(100, startWidth + diff) // 最小宽度 100px
  const newColumns = [...columns.value]
  newColumns[currentColumn].width = newWidth
  props.updateAttributes({ columns: newColumns })
}

const stopResize = () => {
  isResizing = false
  document.removeEventListener('mousemove', handleResize)
  document.removeEventListener('mouseup', stopResize)
}

// 表格操作
const addColumn = () => {
  const newId = `col${columns.value.length + 1}`
  const newColumns = [...columns.value, {
    id: newId,
    title: `列 ${columns.value.length + 1}`,
    width: 200
  }]
  
  const newRows = rows.value.map(row => ({
    ...row,
    [newId]: ''
  }))
  
  props.updateAttributes({ 
    columns: newColumns,
    rows: newRows
  })
}

const addRow = () => {
  const newRow: Row = {
    id: `row${rows.value.length + 1}`
  }
  columns.value.forEach(col => {
    newRow[col.id] = ''
  })
  
  props.updateAttributes({
    rows: [...rows.value, newRow]
  })
}

const deleteColumn = (index: number) => {
  const colId = columns.value[index].id
  const newColumns = columns.value.filter((_, i) => i !== index)
  
  const newRows = rows.value.map(row => {
    const newRow = { ...row }
    delete newRow[colId]
    return newRow
  })
  
  props.updateAttributes({
    columns: newColumns,
    rows: newRows
  })
}

const deleteRow = (index: number) => {
  const newRows = rows.value.filter((_, i) => i !== index)
  props.updateAttributes({ rows: newRows })
}

const updateColumnTitle = (index: number, event: Event) => {
  const target = event.target as HTMLElement
  const newColumns = [...columns.value]
  newColumns[index].title = target.innerText
  props.updateAttributes({ columns: newColumns })
}

const updateCell = (rowIndex: number, colId: string, event: Event) => {
  const target = event.target as HTMLElement
  const newRows = [...rows.value]
  newRows[rowIndex][colId] = target.innerText
  props.updateAttributes({ rows: newRows })
}

const deleteTable = () => {
  props.deleteNode()
}

// 清理事件监听
onUnmounted(() => {
  document.removeEventListener('mousemove', handleResize)
  document.removeEventListener('mouseup', stopResize)
})
</script>

<style lang="scss" scoped>
.notion-table-wrapper {
  margin: 1rem 0;
  background: white;
  border-radius: 4px;
  border: 1px solid #e0e0e0;
}

.table-toolbar {
  display: flex;
  justify-content: space-between;
  padding: 8px;
  border-bottom: 1px solid #e0e0e0;
  background: #f5f5f5;
}

.toolbar-btn {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  background: white;
  cursor: pointer;
  font-size: 14px;
  color: #374151;
  
  &:hover {
    background: #f3f4f6;
  }
  
  .icon {
    color: #6b7280;
  }
}

.table-container {
  overflow-x: auto;
  padding: 8px;
}

table {
  width: 100%;
  border-collapse: collapse;
}

.table-header {
  position: relative;
  padding: 8px;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  font-weight: 500;
  text-align: left;
  
  &:hover .delete-column {
    opacity: 1;
  }
}

.header-content {
  display: flex;
  align-items: center;
}

.header-text {
  flex: 1;
  outline: none;
  min-height: 1.5em;
  
  &:focus {
    background: #f3f4f6;
    border-radius: 2px;
  }
}

.resize-handle {
  position: absolute;
  right: -2px;
  top: 0;
  bottom: 0;
  width: 4px;
  background: transparent;
  cursor: col-resize;
  
  &:hover {
    background: #2563eb;
  }
}

.delete-column {
  position: absolute;
  top: 4px;
  right: 4px;
  opacity: 0;
  padding: 2px;
  border: none;
  background: white;
  border-radius: 2px;
  cursor: pointer;
  
  &:hover {
    background: #f3f4f6;
  }
  
  .icon {
    color: #ef4444;
  }
}

.table-cell {
  padding: 8px;
  border: 1px solid #e5e7eb;
  min-width: 150px;
}

.cell-content {
  outline: none;
  min-height: 1.5em;
  
  &:focus {
    background: #f3f4f6;
    border-radius: 2px;
  }
}

.row-actions {
  width: 32px;
  padding: 0 4px;
  vertical-align: middle;
}

.delete-row {
  opacity: 0;
  padding: 2px;
  border: none;
  background: white;
  border-radius: 2px;
  cursor: pointer;
  
  tr:hover & {
    opacity: 1;
  }
  
  &:hover {
    background: #f3f4f6;
  }
  
  .icon {
    color: #ef4444;
  }
}
</style> 