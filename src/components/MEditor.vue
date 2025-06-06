<template>
  <div class="editor-container">
    <EditorToolbar :editor="editor" />
    <editor-content :editor="editor" class="editor-content" />
  </div>
</template>

<script setup lang="ts">
import "tippy.js/dist/tippy.css";
import "../styles/scrollbar.css";
import "../styles/resizable.css";
import "../styles/theme.css";

import { ref, onMounted, onBeforeUnmount, watch } from "vue";
import { useEditor, EditorContent } from "@tiptap/vue-3";

import { Editor } from "@tiptap/core";
import StarterKit from "@tiptap/starter-kit";
import TextAlign from "@tiptap/extension-text-align";
import TextStyle from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import Highlight from "@tiptap/extension-highlight";
import { BubbleMenu } from "@tiptap/extension-bubble-menu";
import { FloatingMenu } from "@tiptap/extension-floating-menu";
import Placeholder from "@tiptap/extension-placeholder";

import { CustomLink } from "../extensions/link";
import { SlashSuggestion } from "../extensions/slash";
import { TableExtensions } from "../extensions/table";
import { ImageExtensions } from "../extensions/image";

import EditorToolbar from "./toolbar/index.vue";

import {
  PluginPasteImage,
  PluginImageDragAndDrop,
  PluginKeyPasteImage,
  PluginKeyImageDragDrop,
} from "../plugins/image";

const props = defineProps<{
  modelValue: string;
  // 最大允许上传的文件大小（单位：字节），默认为5MB
  maxImageSize?: number;
  // 允许的图片格式，默认为常见图片格式
  acceptImageTypes?: string[];
  // 自定义图片上传函数，可选
  customImageUpload?: (file: File) => Promise<string>;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: string): void;
}>();

const editorRef = ref<Editor | null>(null);

const editor = useEditor({
  content: props.modelValue,
  extensions: [
    StarterKit,
    TextAlign.configure({
      types: ["heading", "paragraph"],
    }),
    TextStyle,
    Color,
    CustomLink.configure({
      openOnClick: false,
      HTMLAttributes: {
        rel: "noopener noreferrer",
      },
    }),
    ...TableExtensions,
    ...ImageExtensions,
    SlashSuggestion,
    BubbleMenu,
    FloatingMenu,
    Highlight.configure({
      multicolor: true,
    }),
    Placeholder.configure({
      placeholder: "输入 / 插入内容",
    }),
  ],
  onCreate: ({ editor }) => {
    editorRef.value = editor;
    registerPlugins();
  },
  onUpdate: ({ editor }) => {
    emit("update:modelValue", editor.getHTML());
  },
});

const registerPlugins = () => {
  if (!editorRef.value) {
    return;
  }
  editorRef.value.registerPlugin(PluginPasteImage(props.customImageUpload));
  editorRef.value.registerPlugin(
    PluginImageDragAndDrop(props.customImageUpload)
  );
};

const unregisterPlugins = () => {
  if (!editorRef.value) {
    return;
  }
  editorRef.value.unregisterPlugin(PluginKeyPasteImage);
  editorRef.value.unregisterPlugin(PluginKeyImageDragDrop);
};

// 监听自定义图片上传函数的变化
watch(
  () => props.customImageUpload,
  (newValue) => {
    unregisterPlugins();
    registerPlugins();
  }
);

watch(
  () => props.modelValue,
  (newValue) => {
    const isSame = newValue === editor.value?.getHTML();
    if (editor.value && !isSame) {
      editor.value.commands.setContent(newValue, false);
    }
  }
);

onMounted(() => {
  editorRef.value = editor.value;
});

onBeforeUnmount(() => {
  editor.value?.destroy();
});
</script>

<style lang="scss">
.editor-container {
  border-radius: 2px;
  background: var(--editor-bg);
  border: 1px solid var(--editor-border);
  // box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  height: 600px;
}

.editor-dropzone {
  display: flex;
  flex-direction: column;
  flex: 1;
}

.editor-content {
  background: var(--editor-bg);
  border-radius: 0 0 8px 8px;
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  scrollbar-width: thin;
  scrollbar-color: var(--editor-scrollbar-thumb) var(--editor-scrollbar-track);
  height: 100%;

  .ProseMirror {
    flex: 1;
    outline: none;
    padding: 1rem;
    color: var(--editor-text);

    /* Placeholder样式 */
    p.is-editor-empty:first-child::before {
      color: var(--editor-placeholder);
      content: attr(data-placeholder);
      float: left;
      height: 0;
      pointer-events: none;
    }

    /* 表格样式 */
    table {
      border-collapse: collapse;
      margin: 1em 0;
      overflow: hidden;
      width: 100%;
      table-layout: fixed;
      border-radius: 4px;

      &.has-focus {
        outline: 2px solid var(--editor-focus);
        outline-offset: 2px;
      }

      td,
      th {
        border: 1px solid var(--editor-table-border);
        box-sizing: border-box;
        min-width: 1em;
        padding: 0.5em;
        position: relative;
        vertical-align: top;

        > * {
          margin-bottom: 0;
        }
      }

      th {
        background-color: var(--editor-table-header);
        font-weight: bold;
        text-align: left;
      }

      .selectedCell:after {
        background: var(--editor-selection);
        content: "";
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        pointer-events: none;
        position: absolute;
        z-index: 2;
      }
    }

    /* 可调整大小的图片样式 */
    .resizable-image {
      position: relative;
      max-width: 100%;
      display: inline-block;

      &:hover {
        &::after {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          border: 2px solid var(--editor-focus);
          pointer-events: none;
        }
      }

      /* 对齐方式样式 */
      &[data-alignment="center"] {
        display: block;
        margin: 0 auto;
      }

      &[data-alignment="left"] {
        display: block;
        margin: 0 auto 0 0;
      }

      &[data-alignment="right"] {
        display: block;
        margin: 0 0 0 auto;
      }
    }
  }

  /* 暗色主题的表格样式 */
  .dark .ProseMirror {
    /* 暗色主题的Placeholder样式 */
    p.is-editor-empty:first-child::before {
      color: #6b7280;
    }

    /* 暗色主题的表格样式 */
    table {
      th {
        background-color: #374151;
      }

      td,
      th {
        border-color: #4b5563;
      }

      .selectedCell:after {
        background: rgba(100, 100, 150, 0.4);
      }

      &.has-focus {
        outline-color: #3b82f6;
      }
    }

    /* 暗色主题下的可调整大小图片样式 */
    .resizable-image {
      &:hover {
        &::after {
          border-color: #3b82f6;
        }
      }
    }
  }

  /* 调整可调整大小图片样式 */
  .node-resizableImage {
    margin: 1em 0;
    display: inline-block;
    max-width: 100%;
  }

  /* 确保图片不会超出容器 */
  .resizable-image-wrapper {
    max-width: 100%;
  }

  p {
    margin: 0.5em 0;
    line-height: 1.5;
  }

  ul,
  ol {
    padding: 0 1.5rem;
    margin: 0.75em 0;
  }

  pre {
    background: #1f2937;
    color: #fff;
    padding: 1rem;
    border-radius: 6px;
    margin: 1em 0;
    overflow-x: auto;

    code {
      color: inherit;
      padding: 0;
      background: none;
      font-size: 0.9rem;
      font-family: "Fira Code", monospace;
    }
  }

  img {
    max-width: 100%;
    height: auto;
    // border-radius: 6px;
    margin: 1em 0;
  }

  blockquote {
    padding: 0.5rem 1rem;
    border-left: 3px solid #e5e7eb;
    margin: 1em 0;
    color: #6b7280;
    background: #f9fafb;
    border-radius: 0 6px 6px 0;
  }

  h1 {
    font-size: 2em;
    margin: 1em 0 0.5em;
    color: #111827;
  }

  h2 {
    font-size: 1.5em;
    margin: 0.75em 0 0.5em;
    color: #1f2937;
  }

  code {
    background: #f3f4f6;
    padding: 0.2em 0.4em;
    border-radius: 4px;
    font-size: 0.9em;
    color: #1f2937;
  }
}
</style>
