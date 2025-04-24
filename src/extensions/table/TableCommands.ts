import { Editor } from '@tiptap/core'

// 判断编辑器当前位置是否在表格内
export function isInTable(editor: Editor): boolean {
  return editor.isActive('table')
}

// 获取当前单元格的位置（行和列）
export function getCurrentCellPosition(editor: Editor): { row: number, col: number } | null {
  if (!isInTable(editor)) {
    return null
  }

  // 尝试通过DOM找到当前单元格
  const { view, state } = editor
  const { selection } = state
  const $pos = selection.$anchor

  // 遍历父节点，查找表格相关节点
  let tableNode = null
  let tableRow = null
  let tableCell = null
  let depth = $pos.depth

  while (depth > 0) {
    const node = $pos.node(depth)
    if (node.type.name === 'table') {
      tableNode = node
    } else if (node.type.name === 'tableRow') {
      tableRow = node
    } else if (node.type.name === 'tableCell' || node.type.name === 'tableHeader') {
      tableCell = node
    }
    depth--
  }

  if (!tableNode || !tableRow || !tableCell) {
    return null
  }

  // 找到行索引
  let rowIndex = -1
  for (let i = 0; i < tableNode.childCount; i++) {
    if (tableNode.child(i) === tableRow) {
      rowIndex = i
      break
    }
  }

  // 找到列索引
  let colIndex = -1
  for (let i = 0; i < tableRow.childCount; i++) {
    if (tableRow.child(i) === tableCell) {
      colIndex = i
      break
    }
  }

  if (rowIndex < 0 || colIndex < 0) {
    return null
  }

  return { row: rowIndex, col: colIndex }
}

// 计算表格尺寸
export function getTableSize(editor: Editor): { rows: number, cols: number } | null {
  if (!isInTable(editor)) {
    return null
  }

  // 查找表格节点
  const { state } = editor
  const { selection } = state
  const $pos = selection.$anchor

  let tableNode = null
  let depth = $pos.depth

  while (depth > 0) {
    const node = $pos.node(depth)
    if (node.type.name === 'table') {
      tableNode = node
      break
    }
    depth--
  }

  if (!tableNode) {
    return null
  }

  // 计算行数
  const rows = tableNode.childCount

  // 计算列数（假设所有行的列数相同，使用第一行的列数）
  const firstRow = tableNode.firstChild
  const cols = firstRow ? firstRow.childCount : 0

  return { rows, cols }
}

// 表格操作命令辅助函数
export const tableCommands = {
  // 插入表格
  insertTable: (editor: Editor, rows: number = 3, cols: number = 3) => {
    return editor.chain().focus().insertTable({ rows, cols, withHeaderRow: true }).run()
  },
  
  // 删除表格
  deleteTable: (editor: Editor) => {
    return editor.chain().focus().deleteTable().run()
  },
  
  // 添加行
  addRow: (editor: Editor, position: 'before' | 'after' = 'after') => {
    if (position === 'before') {
      return editor.chain().focus().addRowBefore().run()
    } else {
      return editor.chain().focus().addRowAfter().run()
    }
  },
  
  // 删除行
  deleteRow: (editor: Editor) => {
    return editor.chain().focus().deleteRow().run()
  },
  
  // 添加列
  addColumn: (editor: Editor, position: 'before' | 'after' = 'after') => {
    if (position === 'before') {
      return editor.chain().focus().addColumnBefore().run()
    } else {
      return editor.chain().focus().addColumnAfter().run()
    }
  },
  
  // 删除列
  deleteColumn: (editor: Editor) => {
    return editor.chain().focus().deleteColumn().run()
  },
} 