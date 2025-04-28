<template>
  <div class="editor-container">
    <EditorToolbar :editor="editor" />
    <editor-content :editor="editor" class="editor-content" />
    <TableBubbleMenu :editor="editor" v-if="editor" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch } from "vue";
import { useEditor, EditorContent } from "@tiptap/vue-3";

import StarterKit from "@tiptap/starter-kit";
import TextAlign from "@tiptap/extension-text-align";
import TextStyle from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import { CustomLink } from "../extensions/link";
import Highlight from "@tiptap/extension-highlight";
import { Editor } from "@tiptap/core";
import { BubbleMenu } from "@tiptap/extension-bubble-menu";
import { FloatingMenu } from "@tiptap/extension-floating-menu";
import { SlashSuggestion } from "../extensions/slash";
import EditorToolbar from "./EditorToolbar.vue";
import Placeholder from "@tiptap/extension-placeholder";
import { TableExtensions } from "../extensions/table";
import TableBubbleMenu from "../extensions/table/TableBubbleMenu.vue";

import "tippy.js/dist/tippy.css";
import "../styles/scrollbar.css";

const props = defineProps<{
  modelValue: string;
  // 自定义图片上传函数，可选
  customImageUpload?: (file: File) => Promise<string>;
  // 最大允许上传的文件大小（单位：字节），默认为5MB
  maxImageSize?: number;
  // 允许的图片格式，默认为常见图片格式
  acceptImageTypes?: string[];
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: string): void;
  (e: "image-upload-error", error: Error, file?: File): void;
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
  },
  onUpdate: ({ editor }) => {
    emit("update:modelValue", editor.getHTML());
  },
});

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
  border: 1px solid #e5e7eb;
  border-radius: 2px;
  margin: 1rem;
  background: white;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  height: 600px;
  position: relative;
}

.editor-dropzone {
  display: flex;
  flex-direction: column;
  flex: 1;
}

.editor-content {
  background: white;
  border-radius: 0 0 8px 8px;
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  scrollbar-width: thin;
  scrollbar-color: #c1c1c1 #f1f1f1;
  height: 100%;

  /* 暗色主题滚动条 */
  .dark & {
    scrollbar-color: #4a4a4a #2d2d2d;
  }

  .ProseMirror {
    flex: 1;
    outline: none;
    padding: 1rem;

    /* Placeholder样式 */
    p.is-editor-empty:first-child::before {
      color: #adb5bd;
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
        outline: 2px solid #60a5fa;
        outline-offset: 2px;
      }
      
      td, th {
        border: 1px solid #e5e7eb;
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
        background-color: #f9fafb;
        font-weight: bold;
        text-align: left;
      }
      
      .selectedCell:after {
        background: rgba(200, 200, 255, 0.4);
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
      
      td, th {
        border-color: #4b5563;
      }
      
      .selectedCell:after {
        background: rgba(100, 100, 150, 0.4);
      }
      
      &.has-focus {
        outline-color: #3b82f6;
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
