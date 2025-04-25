<template>
  <div class="notion-table-wrapper">
    <div class="notion-table">
      <table>
        <thead>
          <tr>
            <th v-for="(col, index) in columns" 
                :key="index" 
                class="notion-table-header"
                :style="{ width: col.width + 'px' }">
              <div class="header-content">
                {{ col.title }}
              </div>
              <div class="resize-handle" 
                   @mousedown="startResize($event, index)"></div>
            </th>
            <th class="add-column" @click="addColumn">+</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(row, rowIndex) in rows" :key="rowIndex">
            <td v-for="(col, colIndex) in columns" 
                :key="colIndex"
                class="notion-table-cell">
              <div class="editor-content" contenteditable="true"
                   @input="updateCell(rowIndex, colIndex, $event)">
                {{ row[col.id] }}
              </div>
            </td>
            <td class="add-column"></td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="table-actions">
      <button class="add-row" @click="addRow">+ 添加新行</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

interface Column {
  id: string
  title: string
  width: number
}

interface Row {
  [key: string]: string
}

const columns = ref<Column[]>([
  { id: 'col1', title: '列 1', width: 200 },
  { id: 'col2', title: '列 2', width: 200 },
])

const rows = ref<Row[]>([
  { col1: '', col2: '' },
])

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
  columns.value[currentColumn].width = newWidth
}

const stopResize = () => {
  isResizing = false
  document.removeEventListener('mousemove', handleResize)
  document.removeEventListener('mouseup', stopResize)
}

// 添加行列
const addColumn = () => {
  const newId = `col${columns.value.length + 1}`
  columns.value.push({
    id: newId,
    title: `列 ${columns.value.length + 1}`,
    width: 200
  })
  
  // 为每一行添加新列
  rows.value.forEach(row => {
    row[newId] = ''
  })
}

const addRow = () => {
  const newRow: Row = {}
  columns.value.forEach(col => {
    newRow[col.id] = ''
  })
  rows.value.push(newRow)
}

const updateCell = (rowIndex: number, colIndex: number, event: Event) => {
  const target = event.target as HTMLElement
  rows.value[rowIndex][columns.value[colIndex].id] = target.innerText
}

// 清理事件监听
onUnmounted(() => {
  document.removeEventListener('mousemove', handleResize)
  document.removeEventListener('mouseup', stopResize)
})
</script>

<style scoped>
.notion-table-wrapper {
  width: 100%;
  overflow-x: auto;
  margin: 1rem 0;
}

.notion-table {
  border-collapse: collapse;
  width: 100%;
}

table {
  border-collapse: collapse;
  width: 100%;
}

.notion-table-header {
  background-color: #f5f5f5;
  font-weight: 500;
  position: relative;
  padding: 6px 8px;
  border: 1px solid #e0e0e0;
}

.header-content {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.resize-handle {
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  width: 4px;
  background-color: transparent;
  cursor: col-resize;
}

.resize-handle:hover {
  background-color: #2196f3;
}

.notion-table-cell {
  padding: 6px 8px;
  border: 1px solid #e0e0e0;
  min-width: 100px;
}

.editor-content {
  min-height: 1.5em;
  outline: none;
}

.editor-content:focus {
  background-color: #f8f9fa;
}

.add-column {
  width: 32px;
  text-align: center;
  cursor: pointer;
  color: #666;
  border: 1px solid #e0e0e0;
}

.add-column:hover {
  background-color: #f0f0f0;
}

.table-actions {
  margin-top: 8px;
}

.add-row {
  padding: 6px 12px;
  background: transparent;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  cursor: pointer;
  color: #666;
}

.add-row:hover {
  background-color: #f0f0f0;
}
</style> 