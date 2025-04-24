import { Table as TiptapTable } from '@tiptap/extension-table'
import { Plugin, PluginKey } from '@tiptap/pm/state'
import { Decoration, DecorationSet } from '@tiptap/pm/view'
import { VueRenderer } from '@tiptap/vue-3'
import TableToolbar from './TableToolbar.vue'
import tippy, { Instance as TippyInstance } from 'tippy.js'
import 'tippy.js/dist/tippy.css'
import { isInTable } from './TableCommands'

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
export const TableToolbarPluginKey = new PluginKey('tableToolbar')

// 辅助方法：显示表格工具栏
function showBubbleMenu(editorView: any, tippyInstance: TippyInstance) {
  tippyInstance.setProps({
    getReferenceClientRect: () => {
      const { from } = editorView.state.selection
      const start = editorView.coordsAtPos(from)
      return new DOMRect(
        start.left,
        start.top,
        0,
        0
      )
    },
  })
  
  tippyInstance.show()
}

// 辅助方法：隐藏表格工具栏
function hideBubbleMenu(tippyInstance: TippyInstance | null) {
  if (tippyInstance) {
    tippyInstance.hide()
  }
}

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
    const { enableTableToolbar } = this.options
    const editor = this.editor

    // 添加表格浮动工具栏
    if (enableTableToolbar) {
      plugins.push(
        new Plugin({
          key: TableToolbarPluginKey,
          view: () => {
            let view: HTMLElement | null = null
            let tippyInstance: TippyInstance | null = null
            let renderer: VueRenderer | null = null
            
            return {
              update: (editorView, prevState) => {
                const { state, composing } = editorView
                const { doc, selection } = state
                
                // 不在输入时更新工具栏
                if (composing) {
                  return
                }
                
                // 检查是否在表格内
                const isTableActive = isInTable(editor)
                
                // 如果不在表格内，隐藏工具栏
                if (!isTableActive) {
                  hideBubbleMenu(tippyInstance)
                  return
                }
                
                // 如果已经有工具栏，更新位置
                if (tippyInstance && view) {
                  showBubbleMenu(editorView, tippyInstance)
                  return
                }
                
                // 如果不存在工具栏实例，创建一个
                if (!tippyInstance) {
                  renderer = new VueRenderer(TableToolbar, {
                    props: {
                      editor
                    },
                    editor
                  })
                  
                  view = renderer.element as HTMLElement
                  
                  // 创建tippy实例
                  tippyInstance = tippy(document.body, {
                    getReferenceClientRect: () => {
                      const { from } = editorView.state.selection
                      const start = editorView.coordsAtPos(from)
                      return new DOMRect(
                        start.left,
                        start.top,
                        0,
                        0
                      )
                    },
                    content: view,
                    showOnCreate: true,
                    interactive: true,
                    trigger: 'manual',
                    placement: 'top-start',
                    theme: 'light',
                    arrow: true,
                    animation: 'scale',
                  })
                }
                
                // 显示工具栏
                showBubbleMenu(editorView, tippyInstance)
              },
              
              destroy: () => {
                if (tippyInstance) {
                  tippyInstance.destroy()
                }
                
                if (renderer) {
                  renderer.destroy()
                }
              }
            }
          },
        })
      )
    }

    // 基本的表格插件
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

    return [...this.parent?.() || [], ...plugins]
  }
}) 