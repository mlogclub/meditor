<template>
  <ToolbarButton
    @click="handleAddImage"
    title="插入图片"
  >
    <LucideImage :size="TOOLBAR_ICON_SIZE" />
  </ToolbarButton>
</template>

<script setup lang="ts">
import { Editor } from '@tiptap/core'
import { LucideImage } from 'lucide-vue-next'
import ToolbarButton from './ToolbarButton.vue'
import { TOOLBAR_ICON_SIZE } from '../../constants/editor'
import { addImage } from '../image-extension'

const props = defineProps<{
  editor: Editor | null | undefined
}>()

const handleAddImage = () => {
  addImage(props.editor)
}
</script> 