<template>
  <div class="link-dialog">
    <div class="dialog-content">
      <div class="form-group">
        <label for="text">链接文本</label>
        <input
          id="text"
          v-model="text"
          type="text"
          class="form-input"
          placeholder="输入链接文本"
        />
      </div>
      <div class="form-group">
        <label for="url">链接地址</label>
        <input
          id="url"
          v-model="url"
          type="text"
          class="form-input"
          placeholder="输入链接地址"
        />
      </div>
      <div class="form-group">
        <label class="checkbox-label">
          <input
            type="checkbox"
            v-model="openInNewTab"
            class="checkbox-input"
          />
          在新窗口打开
        </label>
      </div>
      <div class="dialog-actions">
        <button class="btn btn-cancel" @click="handleCancel">取消</button>
        <button class="btn btn-confirm" @click="handleConfirm">确定</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Editor } from '@tiptap/core'

const props = defineProps<{
  editor: Editor
  initialText?: string
  initialUrl?: string
  initialOpenInNewTab?: boolean
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

const text = ref(props.initialText || '')
const url = ref(props.initialUrl || '')
const openInNewTab = ref(props.initialOpenInNewTab || false)

const handleConfirm = () => {
  const attributes = {
    href: url.value,
    ...(openInNewTab.value ? { target: '_blank', rel: 'noopener noreferrer' } : {})
  }

  if (text.value) {
    // If there's text, replace the selection with the new text
    props.editor
      .chain()
      .focus()
      .deleteRange(props.editor.state.selection)
      .insertContent({ type: 'text', text: text.value })
      .setLink(attributes)
      .run()
  } else {
    // If no text, just set the link on the current selection
    props.editor
      .chain()
      .focus()
      .setLink(attributes)
      .run()
  }

  emit('close')
}

const handleCancel = () => {
  emit('close')
}

onMounted(() => {
  // Focus the URL input on mount
  const urlInput = document.getElementById('url') as HTMLInputElement
  if (urlInput) {
    urlInput.focus()
  }
})
</script>

<style scoped>
.link-dialog {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.dialog-content {
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  width: 100%;
  max-width: 400px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.form-group {
  margin-bottom: 1rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  color: #374151;
  font-weight: 500;
}

.form-input {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  font-size: 0.875rem;
}

.form-input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1);
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
}

.checkbox-input {
  width: 1rem;
  height: 1rem;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  cursor: pointer;
}

.dialog-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  margin-top: 1.5rem;
}

.btn {
  padding: 0.5rem 1rem;
  border-radius: 4px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-cancel {
  background: #f3f4f6;
  border: 1px solid #d1d5db;
  color: #374151;
}

.btn-cancel:hover {
  background: #e5e7eb;
}

.btn-confirm {
  background: #3b82f6;
  border: none;
  color: white;
}

.btn-confirm:hover {
  background: #2563eb;
}

/* Dark mode styles */
:root.dark .dialog-content {
  background: #1f2937;
  color: #f9fafb;
}

:root.dark label {
  color: #f9fafb;
}

:root.dark .form-input {
  background: #374151;
  border-color: #4b5563;
  color: #f9fafb;
}

:root.dark .form-input:focus {
  border-color: #3b82f6;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
}

:root.dark .btn-cancel {
  background: #374151;
  border-color: #4b5563;
  color: #f9fafb;
}

:root.dark .btn-cancel:hover {
  background: #4b5563;
}
</style> 