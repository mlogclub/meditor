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
import BoldButton from '@/components/toolbar/BoldButton.vue'
import ItalicButton from '@/components/toolbar/ItalicButton.vue'
import StrikeButton from '@/components/toolbar/StrikeButton.vue'
import CodeButton from '@/components/toolbar/CodeButton.vue'
import Heading1Button from '@/components/toolbar/Heading1Button.vue'
import Heading2Button from '@/components/toolbar/Heading2Button.vue'
import BulletListButton from '@/components/toolbar/BulletListButton.vue'
import OrderedListButton from '@/components/toolbar/OrderedListButton.vue'
import CodeBlockButton from '@/components/toolbar/CodeBlockButton.vue'
import QuoteButton from '@/components/toolbar/QuoteButton.vue'
import HorizontalRuleButton from '@/components/toolbar/HorizontalRuleButton.vue'
import LinkButton from '@/components/toolbar/LinkButton.vue'
import ImageUploadButton from '@/components/toolbar/ImageUploadButton.vue'
import ToolbarDivider from '@/components/toolbar/ToolbarDivider.vue'
import AlignLeftButton from '@/components/toolbar/AlignLeftButton.vue'
import AlignCenterButton from '@/components/toolbar/AlignCenterButton.vue'
import AlignRightButton from '@/components/toolbar/AlignRightButton.vue'
import TextColorButton from '@/components/toolbar/TextColorButton.vue'
import BackgroundColorButton from '@/components/toolbar/BackgroundColorButton.vue'
import TableButton from '@/components/toolbar/TableButton.vue'

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
