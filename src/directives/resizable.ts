import { Directive } from 'vue'

interface ResizableHTMLElement extends HTMLElement {
  resizeObserver?: ResizeObserver
  handlePointerDown?: (e: PointerEvent) => void
  handlePointerMove?: (e: PointerEvent) => void
  handlePointerUp?: (e: PointerEvent) => void
  isResizing?: boolean
  startX?: number
  startY?: number
  startWidth?: number
  startHeight?: number
  aspectRatio?: number
  editor?: any
  imageId?: string
}

interface ResizableBinding {
  value?: {
    editor: any
    nodeId?: string
  }
}

export const vResizable: Directive = {
  // 当指令绑定到元素上时
  mounted(el: ResizableHTMLElement, binding: ResizableBinding) {
    if (!binding.value?.editor) {
      console.error('v-resizable 指令需要一个 editor 参数')
      return
    }

    const editor = binding.value.editor
    // 获取图片ID或生成一个
    const imageId = binding.value.nodeId || `img-${Date.now()}`
    el.imageId = imageId

    // 保存编辑器引用
    el.editor = editor

    // 计算并存储初始宽高比
    const computeAspectRatio = () => {
      const rect = el.getBoundingClientRect()
      el.aspectRatio = rect.width / rect.height
    }
    
    // 如果是图片，等待加载完成后计算宽高比
    if (el.tagName.toLowerCase() === 'img') {
      const imgEl = el as HTMLImageElement
      if (imgEl.complete) {
        computeAspectRatio()
      } else {
        imgEl.onload = computeAspectRatio
      }
    } else {
      computeAspectRatio()
    }

    // 设置元素样式
    const originalPosition = el.style.position
    if (!el.style.position) {
      el.style.position = 'relative'
    }

    // 开始调整大小
    el.handlePointerDown = (e: PointerEvent) => {
      const target = e.target as HTMLElement
      if (!target.classList.contains('resize-handle')) return

      e.preventDefault()
      e.stopPropagation()
      
      // 获取手柄位置标识
      const handlePos = Array.from(target.classList)
        .find(cls => cls.startsWith('resize-handle-'))
        ?.replace('resize-handle-', '') || ''
      
      if (!handlePos) return
      
      // 记录初始状态
      el.isResizing = true
      el.startX = e.clientX
      el.startY = e.clientY
      el.startWidth = el.offsetWidth
      el.startHeight = el.offsetHeight

      // 添加临时全局事件监听
      document.addEventListener('pointermove', el.handlePointerMove!)
      document.addEventListener('pointerup', el.handlePointerUp!)
      
      // 阻止编辑器的其他事件
      if (el.editor) {
        el.editor.view.dom.classList.add('resizing-image')
      }
    }

    // 调整大小过程
    el.handlePointerMove = (e: PointerEvent) => {
      if (!el.isResizing) return
      
      e.preventDefault()
      
      // 找到当前活动的调整手柄
      const handleElement = document.querySelector('.resize-handle:active') as HTMLElement
      if (!handleElement) return
      
      const handlePos = Array.from(handleElement.classList)
        .find(cls => cls.startsWith('resize-handle-'))
        ?.replace('resize-handle-', '')
      
      if (!handlePos) return
      
      // 计算变化量
      const deltaX = e.clientX - el.startX!
      const deltaY = e.clientY - el.startY!
      
      // 根据拖动手柄的位置更新尺寸
      let newWidth = el.startWidth!
      let newHeight = el.startHeight!
      
      switch (handlePos) {
        case 'se': // 右下
          newWidth = el.startWidth! + deltaX
          newHeight = el.startHeight! + deltaY
          break
        case 'ne': // 右上
          newWidth = el.startWidth! + deltaX
          newHeight = el.startHeight! - deltaY
          break
        case 'sw': // 左下
          newWidth = el.startWidth! - deltaX
          newHeight = el.startHeight! + deltaY
          break
        case 'nw': // 左上
          newWidth = el.startWidth! - deltaX
          newHeight = el.startHeight! - deltaY
          break
        case 'n': // 上
          newHeight = el.startHeight! - deltaY
          newWidth = newHeight * el.aspectRatio!
          break
        case 's': // 下
          newHeight = el.startHeight! + deltaY
          newWidth = newHeight * el.aspectRatio!
          break
        case 'e': // 右
          newWidth = el.startWidth! + deltaX
          newHeight = newWidth / el.aspectRatio!
          break
        case 'w': // 左
          newWidth = el.startWidth! - deltaX
          newHeight = newWidth / el.aspectRatio!
          break
      }
      
      // 防止尺寸过小
      if (newWidth < 30) newWidth = 30
      if (newHeight < 30) newHeight = 30
      
      // 更新元素尺寸
      el.style.width = `${newWidth}px`
      el.style.height = `${newHeight}px`
    }

    // 结束调整大小
    el.handlePointerUp = (e: PointerEvent) => {
      if (!el.isResizing) return
      
      e.preventDefault()
      
      // 移除临时事件监听
      document.removeEventListener('pointermove', el.handlePointerMove!)
      document.removeEventListener('pointerup', el.handlePointerUp!)
      
      // 恢复状态
      el.isResizing = false
      
      // 如果编辑器存在，更新图片节点的尺寸
      if (el.editor) {
        const attrs = {
          width: `${el.offsetWidth}px`,
          height: `${el.offsetHeight}px`
        }
        
        // 更新图片尺寸
        el.editor
          .chain()
          .focus()
          .command(({ commands }) => {
            return commands.updateAttributes('resizableImage', attrs)
          })
          .run()
          
        // 恢复编辑器状态
        el.editor.view.dom.classList.remove('resizing-image')
      }
    }

    // 开始监听resize手柄上的事件
    const wrapper = el.closest('.resizable-image-wrapper')
    const resizeHandles = wrapper ? wrapper.querySelectorAll('.resize-handle') : null
    
    if (resizeHandles && resizeHandles.length > 0) {
      resizeHandles.forEach(handle => {
        handle.addEventListener('pointerdown', el.handlePointerDown!)
      })
    } else {
      // 如果没有找到预定义的手柄，则为图片本身添加事件监听
      el.addEventListener('pointerdown', el.handlePointerDown!)
    }
  },

  // 当元素卸载时
  beforeUnmount(el: ResizableHTMLElement) {
    // 清理事件监听器
    if (el.handlePointerDown) {
      const wrapper = el.closest('.resizable-image-wrapper')
      const resizeHandles = wrapper ? wrapper.querySelectorAll('.resize-handle') : null
      
      if (resizeHandles && resizeHandles.length > 0) {
        resizeHandles.forEach(handle => {
          handle.removeEventListener('pointerdown', el.handlePointerDown!)
        })
      } else {
        el.removeEventListener('pointerdown', el.handlePointerDown!)
      }
      
      // 移除可能的全局事件监听
      document.removeEventListener('pointermove', el.handlePointerMove!)
      document.removeEventListener('pointerup', el.handlePointerUp!)
    }
    
    // 恢复原始样式
    if (el.style) {
      el.style.position = ''
    }
  }
} 