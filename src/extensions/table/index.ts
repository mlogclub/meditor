import { Extension } from '@tiptap/core'
import { Plugin, PluginKey } from 'prosemirror-state'
import Table from '@tiptap/extension-table'
import TableRow from '@tiptap/extension-table-row'
import TableHeader from '@tiptap/extension-table-header'
import TableCell from '@tiptap/extension-table-cell'
import TableBubbleMenu from './TableBubbleMenu.vue'
import { BubbleMenu } from '@tiptap/extension-bubble-menu'
import { EditorState } from 'prosemirror-state'
import { Editor } from '@tiptap/core'
import { createApp } from 'vue'

// 表格扩展的配置选项
export interface EnhancedTableOptions {
  resizable: boolean;
  lastColumnResizable: boolean;
  cellMinWidth: number;
  tableMinWidth: number;
}

// 默认配置
const defaultOptions: EnhancedTableOptions = {
  resizable: true,
  lastColumnResizable: false,
  cellMinWidth: 100,
  tableMinWidth: 200,
}

// 创建增强的表格扩展
export const EnhancedTable = Extension.create<EnhancedTableOptions>({
  name: 'enhancedTable',

  // 为表格启用气泡菜单功能
  addOptions() {
    return {
      ...defaultOptions,
    }
  },

  // 为表格添加额外的配置和样式
  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: new PluginKey('tableBubbleMenu'),
        props: {
          // 增加表格的样式
          attributes: state => {
            // 表格元素周围添加悬停样式
            const tableActive = state.selection.$head.parent.type.name === 'table'
            if (tableActive) {
              return {
                class: 'has-focus',
              }
            }
            return {}
          },
        },
      }),
    ]
  },
})

// 创建表格气泡菜单扩展
export const TableBubbleMenuExtension = BubbleMenu.extend({
  name: 'tableBubbleMenu',
  
  addOptions() {
    return {
      ...this.parent?.(),
      element: null,
      tippyOptions: {
        placement: 'top' as const,
        offset: [0, 20] as [number, number],
        theme: 'light',
      },
      shouldShow: ({ editor, state }: { 
        editor: Editor, 
        state: EditorState,
        oldState?: EditorState,
        from: number,
        to: number
      }) => {
        // 检查选择是否在表格内
        return editor.isActive('table');
      },
    }
  },

  addProseMirrorPlugins() {
    let appInstance: ReturnType<typeof createApp> | null = null
    
    // 在编辑器销毁时清理资源
    this.editor.on('destroy', () => {
      if (this.options.element) {
        // 卸载Vue组件
        if (appInstance) {
          appInstance.unmount()
        }
        
        // 移除DOM元素
        if (this.options.element.parentNode) {
          this.options.element.parentNode.removeChild(this.options.element)
        }
      }
    })
    
    if (!this.options.element) {
      // 动态创建Vue组件并挂载到DOM
      const container = document.createElement('div')
      document.body.appendChild(container)
      
      // 保存app实例以便后续清理
      appInstance = createApp(TableBubbleMenu, {
        editor: this.editor,
      })
      
      appInstance.mount(container)
      this.options.element = container
    }
    
    return this.parent?.()
  },
})

// 组合表格相关的所有扩展
export { Table, TableRow, TableHeader, TableCell }

// 导出一个包含所有表格扩展的数组，方便引入
export const TableExtensions = [
  Table.configure({
    resizable: true,
  }),
  TableRow,
  TableHeader,
  TableCell,
  EnhancedTable,
  TableBubbleMenuExtension,
] 