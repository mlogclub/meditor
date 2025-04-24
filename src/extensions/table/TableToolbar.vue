<template>
  <div class="table-toolbar">
    <div class="toolbar-group">
      <button
        class="toolbar-button"
        title="添加行（上方）"
        @click="editor.chain().focus().addRowBefore().run()"
      >
        <span class="toolbar-icon">↑</span>
      </button>
      <button
        class="toolbar-button"
        title="添加行（下方）"
        @click="editor.chain().focus().addRowAfter().run()"
      >
        <span class="toolbar-icon">↓</span>
      </button>
    </div>
    <div class="toolbar-divider"></div>
    <div class="toolbar-group">
      <button
        class="toolbar-button"
        title="添加列（左侧）"
        @click="editor.chain().focus().addColumnBefore().run()"
      >
        <span class="toolbar-icon">←</span>
      </button>
      <button
        class="toolbar-button"
        title="添加列（右侧）"
        @click="editor.chain().focus().addColumnAfter().run()"
      >
        <span class="toolbar-icon">→</span>
      </button>
    </div>
    <div class="toolbar-divider"></div>
    <div class="toolbar-group">
      <button
        class="toolbar-button danger"
        title="删除行"
        @click="editor.chain().focus().deleteRow().run()"
      >
        <span class="toolbar-icon">删行</span>
      </button>
      <button
        class="toolbar-button danger"
        title="删除列"
        @click="editor.chain().focus().deleteColumn().run()"
      >
        <span class="toolbar-icon">删列</span>
      </button>
      <button
        class="toolbar-button danger"
        title="删除表格"
        @click="editor.chain().focus().deleteTable().run()"
      >
        <span class="toolbar-icon">删表</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Editor } from '@tiptap/core'
import { onMounted, onBeforeUnmount } from 'vue'

const props = defineProps<{
  editor: Editor
}>()

const handleEscape = (event: KeyboardEvent) => {
  // 当按下Escape键时隐藏工具栏
  if (event.key === 'Escape' && props.editor) {
    props.editor.commands.blur()
  }
}

// 添加键盘事件监听
onMounted(() => {
  document.addEventListener('keydown', handleEscape)
})

// 移除键盘事件监听
onBeforeUnmount(() => {
  document.removeEventListener('keydown', handleEscape)
})
</script>

<style lang="scss">
.table-toolbar {
  display: flex;
  align-items: center;
  background-color: white;
  border-radius: 6px;
  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.05), 0px 10px 20px rgba(0, 0, 0, 0.1);
  padding: 0.25rem;
  margin-top: 0.5rem;
  z-index: 20;

  .toolbar-group {
    display: flex;
    gap: 0.25rem;
  }

  .toolbar-divider {
    width: 1px;
    background-color: #e5e7eb;
    margin: 0 0.5rem;
    align-self: stretch;
  }

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

    &.danger {
      color: #b91c1c;

      &:hover {
        background-color: #fee2e2;
      }
    }
  }

  .toolbar-icon {
    font-size: 1rem;
    width: 1.25rem;
    height: 1.25rem;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}

/* 暗色主题样式 */
.dark .table-toolbar {
  background-color: #1f2937;
  box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.1), 0px 10px 20px rgba(0, 0, 0, 0.25);

  .toolbar-divider {
    background-color: #4b5563;
  }

  .toolbar-button {
    color: #e5e7eb;

    &:hover {
      background-color: #374151;
    }

    &.danger {
      color: #ef4444;

      &:hover {
        background-color: rgba(239, 68, 68, 0.2);
      }
    }
  }
}
</style> 