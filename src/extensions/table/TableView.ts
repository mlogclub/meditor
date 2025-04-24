import { Editor } from '@tiptap/core'
import { Node as ProseMirrorNode } from '@tiptap/pm/model'
import { EditorView, NodeView } from '@tiptap/pm/view'

interface TableViewOptions {
  editor: Editor
  node: ProseMirrorNode
  getPos: () => number
  cellMinWidth: number
  minWidth: number
}

export class TableView implements NodeView {
  dom: HTMLElement
  contentDOM: HTMLElement
  editor: Editor
  node: ProseMirrorNode
  getPos: () => number
  cellMinWidth: number
  minWidth: number
  table: HTMLTableElement
  colgroup: HTMLTableColElement

  constructor({ editor, node, getPos, cellMinWidth, minWidth }: TableViewOptions) {
    this.editor = editor
    this.node = node
    this.getPos = getPos
    this.cellMinWidth = cellMinWidth
    this.minWidth = minWidth

    // 创建表格DOM
    this.dom = document.createElement('div')
    this.dom.classList.add('table-wrapper')

    this.table = document.createElement('table')
    this.table.classList.add('resizable-table')
    this.dom.appendChild(this.table)

    // 创建colgroup用于列宽控制
    this.colgroup = document.createElement('colgroup')
    this.table.appendChild(this.colgroup)

    // 创建表格内容容器
    this.contentDOM = document.createElement('tbody')
    this.table.appendChild(this.contentDOM)

    // 设置表格初始样式
    this.initTableStyles()

    // 初始化列宽
    this.initColWidths()
  }

  // 初始化表格样式
  private initTableStyles() {
    this.table.style.width = '100%'
    this.table.style.borderCollapse = 'collapse'
    this.table.style.tableLayout = 'fixed'
    this.dom.style.position = 'relative'
    this.dom.style.overflow = 'auto'
  }

  // 初始化列宽
  private initColWidths() {
    // 获取已保存的列宽数据
    const savedWidths = this.node.attrs['data-column-widths']
      ? JSON.parse(this.node.attrs['data-column-widths'])
      : null

    // 计算列数
    const firstRow = this.node.firstChild
    const colCount = firstRow ? firstRow.childCount : 0

    if (colCount === 0) return

    // 清空现有的col元素
    this.colgroup.innerHTML = ''

    // 计算默认列宽
    const defaultWidth = Math.max(this.minWidth / colCount, this.cellMinWidth)

    // 创建col元素
    for (let i = 0; i < colCount; i++) {
      const col = document.createElement('col')
      
      // 使用保存的宽度或默认宽度
      if (savedWidths && savedWidths[i]) {
        col.style.width = `${savedWidths[i]}px`
      } else {
        col.style.width = `${defaultWidth}px`
      }
      
      this.colgroup.appendChild(col)
    }
  }

  // 更新视图
  update(node: ProseMirrorNode) {
    if (node.type !== this.node.type) return false
    
    this.node = node
    
    // 重新初始化列宽
    this.initColWidths()
    
    return true
  }

  // 销毁视图
  destroy() {
    // 清理工作
  }
} 