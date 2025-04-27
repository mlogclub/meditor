import { Extension } from '@tiptap/core'
import { Plugin, PluginKey } from 'prosemirror-state'
// import { BubbleMenu } from '@tiptap/extension-bubble-menu'
// import { setBlockType } from 'prosemirror-commands'
import Table from '@tiptap/extension-table'
import TableRow from '@tiptap/extension-table-row'
import TableHeader from '@tiptap/extension-table-header'
import TableCell from '@tiptap/extension-table-cell'

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
] 