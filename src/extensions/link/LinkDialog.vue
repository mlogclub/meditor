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
      <button class="btn btn-cancel" @click="handleCancel">取消</button>
      <button class="btn btn-confirm" @click="handleConfirm">确定</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { Editor } from "@tiptap/core";

const props = defineProps<{
  editor: Editor;
  initialText?: string;
  initialUrl?: string;
  initialOpenInNewTab?: boolean;
}>();

const emit = defineEmits<{
  (e: "close"): void;
}>();

const text = ref(props.initialText || "");
const url = ref(props.initialUrl || "");
const openInNewTab = ref(props.initialOpenInNewTab || false);

const handleConfirm = () => {
  const attributes = {
    href: url.value,
    ...(openInNewTab.value
      ? { target: "_blank", rel: "noopener noreferrer" }
      : {}),
  };

  if (text.value) {
    // If there's text, replace the selection with the new text
    props.editor
      .chain()
      .focus()
      .deleteRange(props.editor.state.selection)
      .insertContent({ type: "text", text: text.value })
      .setLink(attributes)
      .run();
  } else {
    // If no text, just set the link on the current selection
    props.editor.chain().focus().setLink(attributes).run();
  }

  emit("close");
};

const handleCancel = () => {
  emit("close");
};

onMounted(() => {
  // Focus the URL input on mount
  const urlInput = document.getElementById("url") as HTMLInputElement;
  if (urlInput) {
    urlInput.focus();
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
