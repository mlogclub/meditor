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
  currentHandle?: string // 记录当前活动的手柄位置
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
      
      console.log("开始拖动:", target.className)
      
      // 获取手柄位置标识
      const handlePos = Array.from(target.classList)
        .find(cls => cls.startsWith('resize-handle-'))
        ?.replace('resize-handle-', '') || ''
      
      if (!handlePos) return
      
      // 记录当前活动的手柄
      el.currentHandle = handlePos
      
      // 记录初始状态
      el.isResizing = true
      el.startX = e.clientX
      el.startY = e.clientY
      el.startWidth = el.offsetWidth
      el.startHeight = el.offsetHeight
      
      // 确保宽高比已计算
      if (!el.aspectRatio || el.aspectRatio <= 0) {
        computeAspectRatio()
      }
      
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
      if (!el.isResizing || !el.currentHandle) return
      
      e.preventDefault()
      
      // 使用之前保存的手柄位置
      const handlePos = el.currentHandle
      
      // 计算变化量
      const deltaX = e.clientX - el.startX!
      const deltaY = e.clientY - el.startY!
      
      // 根据拖动手柄的位置更新尺寸
      let newWidth = el.startWidth!
      let newHeight = el.startHeight!
      
      // 确保宽高比
      const aspectRatio = el.aspectRatio || el.startWidth! / el.startHeight!
      
      // 根据拖动方向确定主导维度
      switch (handlePos) {
        case 'se': // 右下 - 以宽度为主导
          newWidth = el.startWidth! + deltaX
          newHeight = newWidth / aspectRatio
          break
        case 'ne': // 右上 - 以宽度为主导
          newWidth = el.startWidth! + deltaX
          newHeight = newWidth / aspectRatio
          break
        case 'sw': // 左下 - 以宽度为主导
          newWidth = el.startWidth! - deltaX
          newHeight = newWidth / aspectRatio
          break
        case 'nw': // 左上 - 以宽度为主导
          newWidth = el.startWidth! - deltaX
          newHeight = newWidth / aspectRatio
          break
        case 'n': // 上 - 以高度为主导
          newHeight = el.startHeight! - deltaY
          newWidth = newHeight * aspectRatio
          break
        case 's': // 下 - 以高度为主导
          newHeight = el.startHeight! + deltaY
          newWidth = newHeight * aspectRatio
          break
        case 'e': // 右 - 以宽度为主导
          newWidth = el.startWidth! + deltaX
          newHeight = newWidth / aspectRatio
          break
        case 'w': // 左 - 以宽度为主导
          newWidth = el.startWidth! - deltaX
          newHeight = newWidth / aspectRatio
          break
      }
      
      // 防止尺寸过小
      if (newWidth < 30) {
        newWidth = 30
        newHeight = newWidth / aspectRatio
      }
      if (newHeight < 30) {
        newHeight = 30
        newWidth = newHeight * aspectRatio
      }
      
      // 更新元素尺寸
      el.style.width = `${newWidth}px`
      el.style.height = `${newHeight}px`
      
      console.log("调整大小:", newWidth, newHeight, "宽高比:", aspectRatio)
    }

    // 结束调整大小
    el.handlePointerUp = (e: PointerEvent) => {
      if (!el.isResizing) return
      
      e.preventDefault()
      
      console.log("结束拖动")
      
      // 移除临时事件监听
      document.removeEventListener('pointermove', el.handlePointerMove!)
      document.removeEventListener('pointerup', el.handlePointerUp!)
      
      // 恢复状态
      el.isResizing = false
      el.currentHandle = undefined
      
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

    // 为所有可能的调整手柄添加事件监听
    const handler = (event: Event) => {
      // 等待Vue组件完全渲染后绑定事件
      setTimeout(() => {
        const wrapper = el.closest('.resizable-image-wrapper')
        const resizeHandles = wrapper ? wrapper.querySelectorAll('.resize-handle') : null
        
        if (resizeHandles && resizeHandles.length > 0) {
          console.log("找到 resize 手柄:", resizeHandles.length)
          resizeHandles.forEach(handle => {
            handle.removeEventListener('pointerdown', el.handlePointerDown!)
            handle.addEventListener('pointerdown', el.handlePointerDown!)
          })
        } else {
          console.log("未找到 resize 手柄")
        }
      }, 100)
    }
    
    // 监听选中状态变化
    const wrapper = el.closest('.resizable-image-wrapper')
    if (wrapper) {
      // 使用 MutationObserver 监听类变化
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
            handler(new Event('classchange'))
          }
        })
      })
      
      observer.observe(wrapper, { attributes: true })
      
      // 初始运行一次
      handler(new Event('init'))
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