import { Node } from '@tiptap/core'
import { VueNodeViewRenderer } from '@tiptap/vue-3'
import TableComponent from './TableComponent.vue'

export const NotionTable = Node.create({
  name: 'notionTable',
  
  group: 'block',
  
  content: 'inline*',
  
  parseHTML() {
    return [
      {
        tag: 'div.notion-table-wrapper',
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', { class: 'notion-table-wrapper' }, 0]
  },

  addNodeView() {
    return VueNodeViewRenderer(TableComponent)
  },
})

export default NotionTable 