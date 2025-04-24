import { Table as TiptapTable } from '@tiptap/extension-table'
import { Editor } from '@tiptap/core'
import { Node as ProseMirrorNode } from '@tiptap/pm/model'
import { Plugin, PluginKey } from '@tiptap/pm/state'
import { Decoration, DecorationSet } from '@tiptap/pm/view'

export interface TableOptions {
  /**
   * 表格HTML属性
   */
  HTMLAttributes: Record<string, any>
  /**
   * 设置列宽是否可调整，默认为true
   */
  resizable: boolean
  /**
   * 表格最小宽度（像素）
   */
  minWidth: number
  /**
   * 列最小宽度（像素）
   */
  cellMinWidth: number
  /**
   * 是否启用表格工具栏，默认为true
   */
  enableTableToolbar: boolean
}

export const TablePluginKey = new PluginKey('custom-table')

export const CustomTable = TiptapTable.extend<TableOptions>({
  name: 'table',

  addOptions() {
    return {
      ...this.parent?.(),
      resizable: true,
      minWidth: 200,
      cellMinWidth: 40,
      enableTableToolbar: true,
    }
  },

  addAttributes() {
    return {
      ...this.parent?.(),
      // 存储列宽信息的属性
      'data-column-widths': {
        default: null,
        parseHTML: element => element.getAttribute('data-column-widths'),
        renderHTML: attributes => {
          if (!attributes['data-column-widths']) {
            return {}
          }
          return {
            'data-column-widths': attributes['data-column-widths']
          }
        }
      }
    }
  },

  // 添加命令
  addCommands() {
    return {
      ...this.parent?.(),
    }
  },

  addProseMirrorPlugins() {
    const plugins = []

    if (this.options.enableTableToolbar) {
      // 添加表格工具栏插件
      plugins.push(
        new Plugin({
          key: TablePluginKey,
          props: {
            decorations: (state) => {
              // 查找表格
              const { doc, selection } = state
              const decorations: Decoration[] = []
              const decorationSet = DecorationSet.create(doc, decorations)
              
              return decorationSet
            }
          }
        })
      )
    }

    return [...this.parent?.() || [], ...plugins]
  }
}) 