<template>
  <ToolbarButton
    @click="handleSetLink"
    :isActive="editor?.isActive('link')"
    title="插入链接"
  >
    <LucideLink :size="TOOLBAR_ICON_SIZE" />
  </ToolbarButton>
</template>

<script setup lang="ts">
import { Editor } from '@tiptap/core'
import { LucideLink } from 'lucide-vue-next'
import ToolbarButton from './ToolbarButton.vue'
import { TOOLBAR_ICON_SIZE } from '../../constants/editor'

const props = defineProps<{
  editor: Editor | null | undefined
}>()

const handleSetLink = () => {
  if (!props.editor) return
  // props.editor.commands.openLinkDialog()
  props.editor?.chain().focus().openLinkDialog()
}
</script> 