<template>
  <div class="table-button-container">
    <button
      class="toolbar-button"
      title="插入表格"
      @click="showDropdown = !showDropdown"
      @blur="onBlur"
    >
      <span class="table-icon">
        <!-- 简单的表格图标 -->
        <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" stroke-width="2" fill="none">
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <line x1="3" y1="9" x2="21" y2="9" />
          <line x1="3" y1="15" x2="21" y2="15" />
          <line x1="9" y1="3" x2="9" y2="21" />
          <line x1="15" y1="3" x2="15" y2="21" />
        </svg>
      </span>
    </button>

    <div v-if="showDropdown" class="table-grid-dropdown">
      <div class="table-grid-container">
        <div
          v-for="row in 5"
          :key="`row-${row}`"
          class="table-grid-row"
        >
          <div
            v-for="col in 5"
            :key="`cell-${row}-${col}`"
            class="table-grid-cell"
            :class="{ active: row <= selectedRows && col <= selectedCols }"
            @mouseover="setHoverPosition(row, col)"
            @click="insertTable(row, col)"
          ></div>
        </div>
      </div>
      <div class="table-grid-size">
        {{ selectedCols }}x{{ selectedRows }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Editor } from '@tiptap/core'
import { tableCommands } from './TableCommands'

const props = defineProps<{
  editor: Editor | null | undefined
}>()

const showDropdown = ref(false)
const selectedRows = ref(0)
const selectedCols = ref(0)

// 设置当前悬停位置
const setHoverPosition = (row: number, col: number) => {
  selectedRows.value = row
  selectedCols.value = col
}

// 插入表格
const insertTable = (rows: number, cols: number) => {
  if (!props.editor) return

  props.editor
    .chain()
    .focus()
    .insertTable({ rows, cols, withHeaderRow: true })
    .run()

  showDropdown.value = false
}

// 失去焦点时关闭下拉菜单
const onBlur = (event: FocusEvent) => {
  // 检查是否点击了下拉菜单内部元素
  if (
    event.relatedTarget &&
    event.relatedTarget instanceof Node &&
    (event.currentTarget as Node).contains(event.relatedTarget)
  ) {
    return
  }
  
  // 延迟关闭，以便点击操作可以完成
  setTimeout(() => {
    showDropdown.value = false
  }, 100)
}
</script>

<style lang="scss">
.table-button-container {
  position: relative;
  
  .toolbar-button {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0.375rem;
    border: none;
    background: none;
    border-radius: 4px;
    cursor: pointer;
    color: #374151;
    transition: background-color 0.2s;

    &:hover {
      background-color: #f3f4f6;
    }
  }

  .table-icon {
    font-size: 1rem;
    width: 1.25rem;
    height: 1.25rem;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .table-grid-dropdown {
    position: absolute;
    top: 100%;
    left: 0;
    margin-top: 0.5rem;
    background-color: white;
    border-radius: 6px;
    box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.05), 0px 10px 20px rgba(0, 0, 0, 0.1);
    padding: 0.5rem;
    z-index: 30;
  }

  .table-grid-container {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .table-grid-row {
    display: flex;
    gap: 2px;
  }

  .table-grid-cell {
    width: 16px;
    height: 16px;
    border: 1px solid #e5e7eb;
    cursor: pointer;

    &.active {
      background-color: #3b82f6;
      border-color: #3b82f6;
    }
  }

  .table-grid-size {
    text-align: center;
    margin-top: 0.5rem;
    font-size: 0.75rem;
    color: #6b7280;
  }
}

/* 暗色主题样式 */
.dark .table-button-container {
  .toolbar-button {
    color: #e5e7eb;

    &:hover {
      background-color: #374151;
    }
  }

  .table-grid-dropdown {
    background-color: #1f2937;
    box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.1), 0px 10px 20px rgba(0, 0, 0, 0.25);
  }

  .table-grid-cell {
    border-color: #4b5563;

    &.active {
      background-color: #60a5fa;
      border-color: #60a5fa;
    }
  }

  .table-grid-size {
    color: #9ca3af;
  }
}
</style> 