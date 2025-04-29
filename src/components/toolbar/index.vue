<template>
  <div class="editor-toolbar">
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
</template>

<script setup lang="ts">
import { Editor } from '@tiptap/core'
import BoldButton from './toolbar/BoldButton.vue'
import ItalicButton from './toolbar/ItalicButton.vue'
import StrikeButton from './toolbar/StrikeButton.vue'
import CodeButton from './toolbar/CodeButton.vue'
import Heading1Button from './toolbar/Heading1Button.vue'
import Heading2Button from './toolbar/Heading2Button.vue'
import BulletListButton from './toolbar/BulletListButton.vue'
import OrderedListButton from './toolbar/OrderedListButton.vue'
import CodeBlockButton from './toolbar/CodeBlockButton.vue'
import QuoteButton from './toolbar/QuoteButton.vue'
import HorizontalRuleButton from './toolbar/HorizontalRuleButton.vue'
import LinkButton from './toolbar/LinkButton.vue'
import ImageUploadButton from './toolbar/ImageUploadButton.vue'
import ToolbarDivider from './toolbar/ToolbarDivider.vue'
import AlignLeftButton from './toolbar/AlignLeftButton.vue'
import AlignCenterButton from './toolbar/AlignCenterButton.vue'
import AlignRightButton from './toolbar/AlignRightButton.vue'
import TextColorButton from './toolbar/TextColorButton.vue'
import BackgroundColorButton from './toolbar/BackgroundColorButton.vue'
import TableButton from './toolbar/TableButton.vue'
import '../styles/toolbar.css'

defineProps<{
  editor: Editor | null | undefined
}>()
</script>

<style lang="scss">
.editor-toolbar {
  padding: 0.25rem 0.5rem;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  align-items: center;
  flex-shrink: 0;
}
</style>
