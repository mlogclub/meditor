<template>
  <ToolbarButton
    @click="handleUploadClick"
    title="上传图片"
  >
    <LucideImagePlus :size="TOOLBAR_ICON_SIZE" />
  </ToolbarButton>
</template>

<script setup lang="ts">
import { Editor } from '@tiptap/core'
import { LucideImagePlus } from 'lucide-vue-next'
import ToolbarButton from './ToolbarButton.vue'
import { TOOLBAR_ICON_SIZE } from '../../constants/editor'

const props = defineProps<{
  editor: Editor | null | undefined
}>()


const handleUploadClick = () => {
  props.editor?.chain().focus().openImageUpload().run()
}

</script>

<style scoped>
.hidden {
  display: none;
}
</style> 