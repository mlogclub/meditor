<template>
  <div class="editor-toolbar">
    <div class="editor-toolbar-btns editor-toolbar-left">
      <!-- 基础文本格式化 -->
      <BoldButton :editor="editor" />
      <ItalicButton :editor="editor" />
      <StrikeButton :editor="editor" />
      <CodeButton :editor="editor" />
      
      <ToolbarDivider />
      
      <!-- 标题 -->
      <Heading1Button :editor="editor" />
      <Heading2Button :editor="editor" />
      
      <ToolbarDivider />
      
      <!-- 列表和块元素 -->
      <BulletListButton :editor="editor" />
      <OrderedListButton :editor="editor" />
      <CodeBlockButton :editor="editor" />
      <QuoteButton :editor="editor" />
      
      <ToolbarDivider />
      
      <!-- 插入元素 -->
      <HorizontalRuleButton :editor="editor" />
      <LinkButton :editor="editor" />
      <ImageUploadButton :editor="editor" />
      <TableButton :editor="editor" />
      
      <ToolbarDivider />
      
      <!-- 对齐 -->
      <AlignLeftButton :editor="editor" />
      <AlignCenterButton :editor="editor" />
      <AlignRightButton :editor="editor" />
      
      <ToolbarDivider />
      
      <!-- 颜色 -->
      <TextColorButton :editor="editor" />
      <BackgroundColorButton :editor="editor" />
    </div>
    
    <div class="editor-toolbar-btns editor-toolbar-right">
      <FullscreenButton :editor="editor" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { Editor } from "@tiptap/core";
import BoldButton from "./BoldButton.vue";
import ItalicButton from "./ItalicButton.vue";
import StrikeButton from "./StrikeButton.vue";
import CodeButton from "./CodeButton.vue";
import Heading1Button from "./Heading1Button.vue";
import Heading2Button from "./Heading2Button.vue";
import BulletListButton from "./BulletListButton.vue";
import OrderedListButton from "./OrderedListButton.vue";
import CodeBlockButton from "./CodeBlockButton.vue";
import QuoteButton from "./QuoteButton.vue";
import HorizontalRuleButton from "./HorizontalRuleButton.vue";
import LinkButton from "./LinkButton.vue";
import ImageUploadButton from "./ImageUploadButton.vue";
import ToolbarDivider from "./ToolbarDivider.vue";
import AlignLeftButton from "./AlignLeftButton.vue";
import AlignCenterButton from "./AlignCenterButton.vue";
import AlignRightButton from "./AlignRightButton.vue";
import TextColorButton from "./TextColorButton.vue";
import BackgroundColorButton from "./BackgroundColorButton.vue";
import TableButton from "./TableButton.vue";
import FullscreenButton from "./FullscreenButton.vue";

defineProps<{
  editor: Editor | null | undefined;
}>();
</script>

<style lang="scss">
.editor-toolbar {
  display: flex;
  justify-content: space-between;
  padding: 0.25rem 0.5rem;
  border-bottom: 1px solid var(--editor-border);
  background: var(--editor-toolbar-bg);
  overflow-x: auto; // 允许在小屏幕上水平滚动
  flex-wrap: nowrap; // 防止工具栏换行

  // 隐藏滚动条但保留功能
  &::-webkit-scrollbar {
    height: 4px;
  }
  
  &::-webkit-scrollbar-track {
    background: var(--editor-scrollbar-track);
  }
  
  &::-webkit-scrollbar-thumb {
    background: var(--editor-scrollbar-thumb);
    border-radius: 2px;
  }

  .editor-toolbar-btns {
    display: inline-flex;
    gap: 0.5rem;
    flex-wrap: nowrap; // 确保按钮组不换行
    align-items: center;
    flex-shrink: 0;
  }

  .editor-toolbar-left {
    justify-content: flex-start;
    flex: 1;
    overflow-x: auto; // 允许在小屏幕上水平滚动
    
    // 隐藏滚动条但保留功能
    &::-webkit-scrollbar {
      display: none;
    }
  }

  .editor-toolbar-right {
    justify-content: flex-end;
    margin-left: 0.5rem;
  }
}

// 响应式调整
@media (max-width: 768px) {
  .editor-toolbar {
    padding: 0.25rem;
    
    .editor-toolbar-btns {
      gap: 0.25rem;
    }
  }
}

// 超小屏幕时进一步压缩间距
@media (max-width: 480px) {
  .editor-toolbar {
    padding: 0.15rem;
    
    .editor-toolbar-btns {
      gap: 0.2rem;
    }
  }
}
</style>
