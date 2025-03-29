<template>
  <div class="editor-container">
    <!-- 工具栏 -->
    <div class="editor-toolbar">
      <div class="toolbar-group">
        <!-- 文本样式 -->
        <button 
          class="toolbar-button"
          :class="{ active: editor?.isActive('bold') }"
          @click="editor?.chain().focus().toggleBold().run()"
          title="加粗"
        >
          <span class="ProseMirror-icon ProseMirror-icon-bold"></span>
        </button>
        <button 
          class="toolbar-button"
          :class="{ active: editor?.isActive('italic') }"
          @click="editor?.chain().focus().toggleItalic().run()"
          title="斜体"
        >
          <span class="ProseMirror-icon ProseMirror-icon-italic"></span>
        </button>
        <button 
          class="toolbar-button"
          :class="{ active: editor?.isActive('underline') }"
          @click="editor?.chain().focus().toggleUnderline().run()"
          title="下划线"
        >
          <span class="ProseMirror-icon ProseMirror-icon-underline"></span>
        </button>
        <button 
          class="toolbar-button"
          :class="{ active: editor?.isActive('strike') }"
          @click="editor?.chain().focus().toggleStrike().run()"
          title="删除线"
        >
          <span class="ProseMirror-icon ProseMirror-icon-strike"></span>
        </button>
      </div>

      <div class="toolbar-group">
        <!-- 标题 -->
        <button 
          class="toolbar-button"
          :class="{ active: editor?.isActive('heading', { level: 1 }) }"
          @click="editor?.chain().focus().toggleHeading({ level: 1 }).run()"
          title="标题1"
        >
          <span class="ProseMirror-icon ProseMirror-icon-h1"></span>
        </button>
        <button 
          class="toolbar-button"
          :class="{ active: editor?.isActive('heading', { level: 2 }) }"
          @click="editor?.chain().focus().toggleHeading({ level: 2 }).run()"
          title="标题2"
        >
          <span class="ProseMirror-icon ProseMirror-icon-h2"></span>
        </button>
        <button 
          class="toolbar-button"
          :class="{ active: editor?.isActive('heading', { level: 3 }) }"
          @click="editor?.chain().focus().toggleHeading({ level: 3 }).run()"
          title="标题3"
        >
          <span class="ProseMirror-icon ProseMirror-icon-h3"></span>
        </button>
      </div>

      <div class="toolbar-group">
        <!-- 列表 -->
        <button 
          class="toolbar-button"
          :class="{ active: editor?.isActive('bulletList') }"
          @click="editor?.chain().focus().toggleBulletList().run()"
          title="无序列表"
        >
          <span class="ProseMirror-icon ProseMirror-icon-ul"></span>
        </button>
        <button 
          class="toolbar-button"
          :class="{ active: editor?.isActive('orderedList') }"
          @click="editor?.chain().focus().toggleOrderedList().run()"
          title="有序列表"
        >
          <span class="ProseMirror-icon ProseMirror-icon-ol"></span>
        </button>
        <button 
          class="toolbar-button"
          :class="{ active: editor?.isActive('taskList') }"
          @click="editor?.chain().focus().toggleTaskList().run()"
          title="任务列表"
        >
          <span class="ProseMirror-icon ProseMirror-icon-tl"></span>
        </button>
      </div>

      <div class="toolbar-group">
        <!-- 对齐方式 -->
        <button 
          class="toolbar-button"
          :class="{ active: editor?.isActive({ textAlign: 'left' }) }"
          @click="editor?.chain().focus().setTextAlign('left').run()"
          title="左对齐"
        >
          <span class="ProseMirror-icon ProseMirror-icon-align-left"></span>
        </button>
        <button 
          class="toolbar-button"
          :class="{ active: editor?.isActive({ textAlign: 'center' }) }"
          @click="editor?.chain().focus().setTextAlign('center').run()"
          title="居中对齐"
        >
          <span class="ProseMirror-icon ProseMirror-icon-align-center"></span>
        </button>
        <button 
          class="toolbar-button"
          :class="{ active: editor?.isActive({ textAlign: 'right' }) }"
          @click="editor?.chain().focus().setTextAlign('right').run()"
          title="右对齐"
        >
          <span class="ProseMirror-icon ProseMirror-icon-align-right"></span>
        </button>
      </div>

      <div class="toolbar-group">
        <!-- 其他功能 -->
        <button 
          class="toolbar-button"
          :class="{ active: editor?.isActive('blockquote') }"
          @click="editor?.chain().focus().toggleBlockquote().run()"
          title="引用"
        >
          <span class="ProseMirror-icon ProseMirror-icon-blockquote"></span>
        </button>
        <button 
          class="toolbar-button"
          :class="{ active: editor?.isActive('codeBlock') }"
          @click="editor?.chain().focus().toggleCodeBlock().run()"
          title="代码块"
        >
          <span class="ProseMirror-icon ProseMirror-icon-code"></span>
        </button>
        <button 
          class="toolbar-button"
          @click="editor?.chain().focus().setHorizontalRule().run()"
          title="分割线"
        >
          <span class="ProseMirror-icon ProseMirror-icon-hr"></span>
        </button>
      </div>
    </div>

    <!-- 编辑区域 -->
    <div class="editor-content" ref="editorRef"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { Editor } from '@tiptap/core'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import TextAlign from '@tiptap/extension-text-align'
import TaskList from '@tiptap/extension-task-list'
import TaskItem from '@tiptap/extension-task-item'

const editorRef = ref<HTMLElement | null>(null)
const editor = ref<Editor | null>(null)

onMounted(() => {
  if (editorRef.value) {
    editor.value = new Editor({
      element: editorRef.value,
      extensions: [
        StarterKit,
        Underline,
        TextAlign.configure({
          types: ['heading', 'paragraph'],
        }),
        TaskList,
        TaskItem,
      ],
      content: '<p>开始编辑...</p>',
    })
  }
})

onBeforeUnmount(() => {
  editor.value?.destroy()
})
</script>

<style scoped>
.editor-container {
  border: 1px solid var(--tiptap-border);
  border-radius: var(--tiptap-radius);
  overflow: hidden;
}

.editor-toolbar {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  padding: 0.5rem;
  border-bottom: 1px solid var(--tiptap-border);
  background-color: var(--tiptap-muted-background);
}

.toolbar-group {
  display: flex;
  gap: 0.25rem;
  padding-right: 0.5rem;
  border-right: 1px solid var(--tiptap-border);
}

.toolbar-group:last-child {
  border-right: none;
}

.toolbar-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  padding: 0.25rem;
  border: 1px solid transparent;
  border-radius: 0.25rem;
  background: transparent;
  color: var(--tiptap-foreground);
  cursor: pointer;
  transition: all 0.2s;
}

.toolbar-button:hover {
  background-color: var(--tiptap-muted-background);
}

.toolbar-button.active {
  background-color: var(--tiptap-primary-background);
  color: var(--tiptap-primary-foreground);
}

.editor-content {
  padding: 1rem;
  min-height: 200px;
  outline: none;
}

.editor-content :deep(.ProseMirror) {
  min-height: 200px;
  outline: none;
}

.editor-content :deep(.ProseMirror p) {
  margin: 0.5em 0;
}

.editor-content :deep(.ProseMirror h1),
.editor-content :deep(.ProseMirror h2),
.editor-content :deep(.ProseMirror h3) {
  margin: 1em 0 0.5em;
}
</style> 