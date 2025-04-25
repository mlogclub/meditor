import { TableView } from './TableView'
import { Editor } from '@tiptap/core'
import { Node as ProseMirrorNode } from '@tiptap/pm/model'
import { NodeView } from '@tiptap/pm/view'

interface TableViewOptions {
  editor: Editor
  node: ProseMirrorNode
  getPos: () => number
  cellMinWidth: number
  minWidth: number
}

export class EnhancedTableView extends TableView {
  // 存储调整手柄元素
  private resizeHandles: HTMLElement[] = []
  // 当前拖动的列索引
  private draggingColumnIndex: number | null = null
  // 拖动起始位置
  private startX: number = 0
  // 拖动起始宽度
  private startWidth: number = 0
  // 下一列起始宽度
  private nextColumnStartWidth: number = 0
  // 鼠标移动处理函数
  private mouseMoveHandler: ((e: MouseEvent) => void) | null = null
  // 鼠标抬起处理函数
  private mouseUpHandler: ((e: MouseEvent) => void) | null = null
  // 表格总宽度
  private tableWidth: number = 0

  constructor(options: TableViewOptions) {
    super(options)
    // 初始化可调整大小功能
    this.initResizable()
  }

  // 初始化可调整大小功能
  private initResizable() {
    // 创建调整手柄
    this.createResizeHandles()
    // 绑定事件
    this.bindDragEvents()
    // 更新手柄位置
    this.updateHandlePositions()

    // 监听窗口大小变化，更新手柄位置
    window.addEventListener('resize', this.updateHandlePositions.bind(this))
    
    // 监听表格变化
    const observer = new MutationObserver(() => {
      this.updateHandlePositions()
    })
    
    observer.observe(this.table, {
      attributes: true,
      childList: true,
      subtree: true
    })
  }

  // 创建调整手柄
  private createResizeHandles() {
    // 清除现有的调整手柄
    this.resizeHandles.forEach(handle => handle.remove())
    this.resizeHandles = []

    // 计算列数
    const colElements = this.colgroup.querySelectorAll('col')
    const colCount = colElements.length

    // 为每列创建一个调整手柄（最后一列不需要）
    for (let i = 0; i < colCount - 1; i++) {
      const handle = document.createElement('div')
      handle.classList.add('column-resize-handle')
      handle.style.position = 'absolute'
      handle.style.top = '0'
      handle.style.bottom = '0'
      handle.style.width = '5px'
      handle.style.cursor = 'col-resize'
      handle.style.zIndex = '1'
      handle.style.background = 'transparent'
      handle.style.transition = 'background 0.2s ease'
      handle.dataset.index = i.toString()

      // 鼠标悬停时显示
      handle.addEventListener('mouseenter', () => {
        handle.style.background = 'rgba(0, 100, 255, 0.3)'
      })
      
      handle.addEventListener('mouseleave', () => {
        if (this.draggingColumnIndex === null) {
          handle.style.background = 'transparent'
        }
      })

      this.dom.appendChild(handle)
      this.resizeHandles.push(handle)
    }
  }

  // 绑定拖动事件
  private bindDragEvents() {
    this.resizeHandles.forEach(handle => {
      handle.addEventListener('mousedown', this.handleMouseDown.bind(this))
    })
  }

  // 处理鼠标按下事件
  private handleMouseDown(e: MouseEvent) {
    e.preventDefault()
    e.stopPropagation()

    const handle = e.target as HTMLElement
    this.draggingColumnIndex = parseInt(handle.dataset.index || '0')
    
    // 设置起始位置和宽度
    this.startX = e.clientX
    
    const colElements = this.colgroup.querySelectorAll('col')
    this.startWidth = colElements[this.draggingColumnIndex].getBoundingClientRect().width
    this.nextColumnStartWidth = colElements[this.draggingColumnIndex + 1].getBoundingClientRect().width
    this.tableWidth = this.table.getBoundingClientRect().width
    
    // 添加鼠标移动和抬起事件处理
    this.mouseMoveHandler = this.handleMouseMove.bind(this)
    this.mouseUpHandler = this.handleMouseUp.bind(this)
    
    document.addEventListener('mousemove', this.mouseMoveHandler)
    document.addEventListener('mouseup', this.mouseUpHandler)
    
    // 高亮当前调整手柄
    handle.style.background = 'rgba(0, 100, 255, 0.5)'
  }

  // 处理鼠标移动事件
  private handleMouseMove(e: MouseEvent) {
    if (this.draggingColumnIndex === null) return
    
    e.preventDefault()
    e.stopPropagation()
    
    const colElements = this.colgroup.querySelectorAll('col')
    const currentCol = colElements[this.draggingColumnIndex]
    const nextCol = colElements[this.draggingColumnIndex + 1]
    
    // 计算移动距离
    const deltaX = e.clientX - this.startX
    
    // 计算新宽度
    let newWidth = Math.max(this.startWidth + deltaX, this.cellMinWidth)
    let newNextWidth = Math.max(this.nextColumnStartWidth - deltaX, this.cellMinWidth)
    
    // 确保总宽度不变
    if (newWidth + newNextWidth > this.startWidth + this.nextColumnStartWidth) {
      if (deltaX > 0) {
        newNextWidth = this.nextColumnStartWidth - deltaX
      } else {
        newWidth = this.startWidth + deltaX
      }
    }
    
    // 更新列宽
    currentCol.style.width = `${newWidth}px`
    nextCol.style.width = `${newNextWidth}px`
    
    // 更新手柄位置
    this.updateHandlePositions()
  }

  // 处理鼠标抬起事件
  private handleMouseUp(e: MouseEvent) {
    if (this.draggingColumnIndex === null) return
    
    e.preventDefault()
    e.stopPropagation()
    
    // 恢复手柄样式
    const handle = this.resizeHandles[this.draggingColumnIndex]
    handle.style.background = 'transparent'
    
    // 保存列宽
    this.saveColumnWidths()
    
    // 移除事件监听
    if (this.mouseMoveHandler) {
      document.removeEventListener('mousemove', this.mouseMoveHandler)
      this.mouseMoveHandler = null
    }
    
    if (this.mouseUpHandler) {
      document.removeEventListener('mouseup', this.mouseUpHandler)
      this.mouseUpHandler = null
    }
    
    this.draggingColumnIndex = null
  }

  // 更新调整手柄位置
  private updateHandlePositions() {
    const colElements = this.colgroup.querySelectorAll('col')
    let leftOffset = 0
    
    this.resizeHandles.forEach((handle, index) => {
      // 计算到当前列右边的位置
      const colWidth = colElements[index].getBoundingClientRect().width
      leftOffset += colWidth
      
      // 设置手柄位置
      handle.style.left = `${leftOffset}px`
    })
  }

  // 保存列宽到节点属性
  private saveColumnWidths() {
    const colElements = this.colgroup.querySelectorAll('col')
    const widths = Array.from(colElements).map(col => 
      parseInt(window.getComputedStyle(col).width)
    )
    
    // 通过 dispatch 更新节点属性
    const { state, dispatch } = this.editor.view
    const { tr } = state
    const pos = this.getPos()
    
    tr.setNodeMarkup(pos, undefined, {
      ...this.node.attrs,
      'data-column-widths': JSON.stringify(widths)
    })
    
    dispatch(tr)
  }

  // 重写销毁方法，清理资源
  destroy() {
    // 移除拖动手柄
    this.resizeHandles.forEach(handle => handle.remove())
    
    // 移除事件监听
    if (this.mouseMoveHandler) {
      document.removeEventListener('mousemove', this.mouseMoveHandler)
    }
    
    if (this.mouseUpHandler) {
      document.removeEventListener('mouseup', this.mouseUpHandler)
    }
    
    // 移除窗口大小变化监听
    window.removeEventListener('resize', this.updateHandlePositions.bind(this))
    
    // 调用父类销毁方法
    super.destroy()
  }
} 