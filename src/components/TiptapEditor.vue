<template>
  <div class="editor-container">
    <EditorToolbar :editor="editor" />
    <editor-content :editor="editor" class="editor-content" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch } from "vue";
import { useEditor, EditorContent } from "@tiptap/vue-3";

import StarterKit from "@tiptap/starter-kit";
import TextAlign from "@tiptap/extension-text-align";
import TextStyle from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import Link from "@tiptap/extension-link";
import Table from "@tiptap/extension-table";
import TableRow from "@tiptap/extension-table-row";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import { Editor } from "@tiptap/core";
import { BubbleMenu } from "@tiptap/extension-bubble-menu";
import { FloatingMenu } from "@tiptap/extension-floating-menu";
import { suggestion } from "./slash-commands";
import EditorToolbar from "./EditorToolbar.vue";
import { ResizableImage } from "./image-extension";

import "tippy.js/dist/tippy.css";
import "../styles/scrollbar.css";

const props = defineProps<{
  modelValue: string;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: string): void;
}>();

const editorRef = ref<Editor | null>(null);
const showSlashCommands = ref(false);
const slashCommandRange = ref<{ from: number; to: number } | null>(null);

const editor = useEditor({
  content: props.modelValue,
  extensions: [
    StarterKit,
    TextAlign.configure({
      types: ["heading", "paragraph"],
    }),
    TextStyle,
    Color.configure({
      types: ["textStyle"],
    }),
    ResizableImage.configure({
      inline: true,
      HTMLAttributes: {
        class: "resizable-image",
      },
    }),
    Link.configure({
      openOnClick: false,
      HTMLAttributes: {
        rel: "noopener noreferrer",
        class: "text-blue-500",
      },
    }),
    Table.configure({
      resizable: true,
      HTMLAttributes: {
        class: "border-collapse table-fixed w-full",
      },
    }),
    TableRow,
    TableHeader,
    TableCell,
    suggestion,
    BubbleMenu,
    FloatingMenu,
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

<style>
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

.editor-content {
  background: white;
  border-radius: 0 0 8px 8px;
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  scrollbar-width: thin;
  scrollbar-color: #c1c1c1 #f1f1f1;
}

/* 暗色主题滚动条 */
.dark .editor-content {
  scrollbar-color: #4a4a4a #2d2d2d;
}

.editor-content .ProseMirror {
  flex: 1;
  /* height: 100%;
  width: 100%; */
  outline: none;
  padding: 1rem;
}

/* 调整可调整大小图片样式 */
.editor-content .node-resizableImage {
  margin: 1em 0;
  display: inline-block;
  max-width: 100%;
}

/* 确保图片不会超出容器 */
.editor-content .resizable-image-wrapper {
  max-width: 100%;
}

.editor-content p {
  margin: 0.5em 0;
  line-height: 1.5;
}

.editor-content ul,
.editor-content ol {
  padding: 0 1.5rem;
  margin: 0.75em 0;
}

.editor-content pre {
  background: #1f2937;
  color: #fff;
  padding: 1rem;
  border-radius: 6px;
  margin: 1em 0;
  overflow-x: auto;
}

.editor-content pre code {
  color: inherit;
  padding: 0;
  background: none;
  font-size: 0.9rem;
  font-family: "Fira Code", monospace;
}

.editor-content img {
  max-width: 100%;
  height: auto;
  border-radius: 6px;
  margin: 1em 0;
}

.editor-content blockquote {
  padding: 0.5rem 1rem;
  border-left: 3px solid #e5e7eb;
  margin: 1em 0;
  color: #6b7280;
  background: #f9fafb;
  border-radius: 0 6px 6px 0;
}

.editor-content h1 {
  font-size: 2em;
  margin: 1em 0 0.5em;
  color: #111827;
}

.editor-content h2 {
  font-size: 1.5em;
  margin: 0.75em 0 0.5em;
  color: #1f2937;
}

.editor-content code {
  background: #f3f4f6;
  padding: 0.2em 0.4em;
  border-radius: 4px;
  font-size: 0.9em;
  color: #1f2937;
}
</style>
