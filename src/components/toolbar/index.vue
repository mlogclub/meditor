<template>
  <div class="editor-toolbar">
    <div class="editor-toolbar-btns editor-toolbar-left">
      <BoldButton :editor="editor" />
      <ItalicButton :editor="editor" />
      <StrikeButton :editor="editor" />
      <CodeButton :editor="editor" />
      <ToolbarDivider />
      <Heading1Button :editor="editor" />
      <Heading2Button :editor="editor" />
      <ToolbarDivider />
      <BulletListButton :editor="editor" />
      <OrderedListButton :editor="editor" />
      <CodeBlockButton :editor="editor" />
      <QuoteButton :editor="editor" />
      <ToolbarDivider />
      <HorizontalRuleButton :editor="editor" />
      <LinkButton :editor="editor" />
      <ImageUploadButton :editor="editor" />
      <TableButton :editor="editor" />
      <ToolbarDivider />
      <AlignLeftButton :editor="editor" />
      <AlignCenterButton :editor="editor" />
      <AlignRightButton :editor="editor" />
      <ToolbarDivider />
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

  .editor-toolbar-btns {
    display: inline-flex;
    gap: 0.5rem;
    flex-wrap: wrap;
    align-items: center;
    flex-shrink: 0;
  }

  .editor-toolbar-left {
    justify-content: flex-start;
  }

  .editor-toolbar-right {
    justify-content: flex-end;
  }
}
</style>
