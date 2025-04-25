import { Node, mergeAttributes } from '@tiptap/core'
import { VueNodeViewRenderer } from '@tiptap/vue-3'
import NotionTableComponent from './NotionTableComponent.vue'

export interface NotionTableOptions {
  HTMLAttributes: Record<string, any>
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    notionTable: {
      insertNotionTable: () => ReturnType
    }
  }
}

export const NotionTable = Node.create<NotionTableOptions>({
  name: 'notionTable',

  group: 'block',

  selectable: true,

  draggable: true,

  atom: true,

  addOptions() {
    return {
      HTMLAttributes: {},
    }
  },

  addAttributes() {
    return {
      columns: {
        default: [
          { id: 'col1', title: '列 1', width: 200 },
          { id: 'col2', title: '列 2', width: 200 },
        ],
      },
      rows: {
        default: [
          { id: 'row1', col1: '', col2: '' },
        ],
      },
    }
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-type="notion-table"]',
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, { 'data-type': 'notion-table' }), 0]
  },

  addCommands() {
    return {
      insertNotionTable:
        () =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
          })
        },
    }
  },

  addNodeView() {
    return VueNodeViewRenderer(NotionTableComponent)
  },
}) 