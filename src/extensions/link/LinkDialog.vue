<template>
  <div class="link-dialog">
    <div class="form-group">
      <label for="text">链接文本</label>
      <div>
        <input
          id="text"
          v-model="text"
          type="text"
          class="form-input"
          placeholder="输入链接文本"
        />
      </div>
    </div>
    <div class="form-group">
      <label for="url">链接地址</label>
      <div>
        <input
          id="url"
          v-model="url"
          type="text"
          class="form-input"
          placeholder="输入链接地址"
        />
      </div>
    </div>
    <div class="form-group">
      <label></label>
      <div class="input">
        <label class="checkbox-label">
          <input
            type="checkbox"
            v-model="openInNewTab"
            class="checkbox-input"
          />
          在新窗口打开
        </label>
      </div>
    </div>
    <div class="dialog-actions">
      <button v-if="isEditing" class="btn btn-remove" @click="handleRemove">删除链接</button>
      <button class="btn btn-cancel" @click="handleCancel">取消</button>
      <button class="btn btn-confirm" @click="handleConfirm">确定</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed, watch } from "vue";
import { Editor } from "@tiptap/core";

const props = defineProps<{
  editor: Editor;
  initialText?: string;
  initialUrl?: string;
  initialOpenInNewTab?: boolean;
  isEditingExistingLink?: boolean;
}>();

const text = ref(props.initialText || "");
const url = ref(props.initialUrl || "");
const openInNewTab = ref(props.initialOpenInNewTab || false);
const isEditing = computed(() => props.isEditingExistingLink || false);

// 监听属性变化，更新表单值
watch(() => props.initialText, (newVal) => {
  if (newVal) {
    text.value = newVal;
  }
});

watch(() => props.initialUrl, (newVal) => {
  if (newVal) {
    url.value = newVal;
  }
});

watch(() => props.initialOpenInNewTab, (newVal) => {
  if (newVal !== undefined) {
    openInNewTab.value = newVal;
  }
});

// 创建自定义事件
const createCustomEvent = (name: string, detail?: any) => {
  const event = new CustomEvent(name, {
    bubbles: true,
    cancelable: true,
    detail
  });
  return event;
};

const handleConfirm = () => {
  // 验证URL
  if (!url.value) {
    // 如果是编辑模式且用户清空了URL，可以选择取消链接
    if (isEditing.value) {
      const removeEvent = createCustomEvent('confirm', { 
        text: text.value,
        attributes: { href: '' }, // 空链接，后续会处理为取消链接
        remove: true
      });
      document.dispatchEvent(removeEvent);
      return;
    } else {
      // 新链接必须有URL
      alert('请输入链接地址');
      return;
    }
  }

  // 确保URL格式正确
  let urlValue = url.value;
  if (!/^https?:\/\//i.test(urlValue) && !/^mailto:/i.test(urlValue)) {
    urlValue = 'http://' + urlValue;
  }

  const attributes = {
    href: urlValue,
    ...(openInNewTab.value
      ? { target: "_blank", rel: "noopener noreferrer" }
      : {}),
  };
  
  // 创建并分发确认事件
  const confirmEvent = createCustomEvent('confirm', { 
    text: text.value, 
    attributes 
  });
  document.dispatchEvent(confirmEvent);
};

const handleCancel = () => {
  // 创建并分发取消事件
  const cancelEvent = createCustomEvent('cancel');
  document.dispatchEvent(cancelEvent);
};

// 处理删除链接
const handleRemove = () => {
  props.editor.chain().focus().unsetLink().run();
  document.dispatchEvent(createCustomEvent('cancel'));
};

onMounted(() => {
  // Focus the URL input on mount
  const urlInput = document.getElementById("url") as HTMLInputElement;
  if (urlInput) {
    urlInput.focus();
  }
  
  // 如果没有初始文本，尝试从编辑器中获取选中的文本
  if (!props.initialText && props.editor) {
    const { from, to } = props.editor.state.selection;
    const selectedText = props.editor.state.doc.textBetween(from, to);
    if (selectedText) {
      text.value = selectedText;
    }
  }
});
</script>

<style lang="scss" scoped>
$primary-color: #3b82f6;
$primary-hover: #2563eb;
$border-color: #d1d5db;
$text-color: #374151;
$bg-light: #f3f4f6;
$bg-hover: #e5e7eb;

.link-dialog {
  padding: 10px;
  display: flex;
  flex-direction: column;
  gap: 15px;

  .form-group {
    display: flex;
    align-items: center;
    gap: 10px;

    & > label {
      width: 60px;
      color: $text-color;
      // font-weight: 500;
      font-size: 14px;
      text-align: right;
    }

    & > div {
      flex: 1;
      display: flex;
      width: 100%;
      .form-input {
        width: 100%;
        padding: 0.375rem 0.5rem;
        border: 1px solid $border-color;
        border-radius: 4px;
        font-size: 14px;
        line-height: 1.25;

        &:focus {
          outline: none;
          border-color: $primary-color;
          box-shadow: 0 0 0 2px rgba($primary-color, 0.1);
        }
      }

      .checkbox-label {
        display: flex;
        align-items: center;
        cursor: pointer;
        font-size: 14px;

        .checkbox-input {
          border: 1px solid $border-color;
          border-radius: 3px;
          cursor: pointer;
        }
      }
    }
  }

  .dialog-actions {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
  }

  .btn {
    padding: 2px 10px;
    border-radius: 4px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;

    &-cancel {
      background: $bg-light;
      border: 1px solid $border-color;
      color: $text-color;

      &:hover {
        background: $bg-hover;
      }
    }

    &-confirm {
      background: $primary-color;
      border: none;
      color: white;

      &:hover {
        background: $primary-hover;
      }
    }
    
    &-remove {
      margin-right: auto;
      background: #ef4444;
      border: none;
      color: white;

      &:hover {
        background: #dc2626;
      }
    }
  }
}

/* Dark mode styles */
:root.dark {
  .link-dialog {
    background: #1f2937;
    color: #f9fafb;

    label {
      color: #f9fafb;
    }

    .form-input {
      background: #374151;
      border-color: #4b5563;
      color: #f9fafb;

      &:focus {
        border-color: $primary-color;
        box-shadow: 0 0 0 2px rgba($primary-color, 0.2);
      }
    }

    .btn-cancel {
      background: #374151;
      border-color: #4b5563;
      color: #f9fafb;

      &:hover {
        background: #4b5563;
      }
    }
  }
}
</style>
