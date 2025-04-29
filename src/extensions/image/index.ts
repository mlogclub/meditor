import Image from '@tiptap/extension-image'
import { mergeAttributes, Editor } from '@tiptap/core'
import { VueNodeViewRenderer } from '@tiptap/vue-3'
import ResizableImageNodeView from './ResizableImageNodeView.vue'
import { BubbleMenu } from '@tiptap/extension-bubble-menu'
import { Plugin, PluginKey, EditorState } from 'prosemirror-state'
import ImageBubbleMenu from './ImageBubbleMenu.vue'
import { createApp } from 'vue'

export const ResizableImage = Image.extend({
  name: 'resizableImage',
  
  addOptions() {
    return {
      ...this.parent?.(),
      HTMLAttributes: {
        class: 'resizable-image',
      },
    }
  },
  
  addAttributes() {
    return {
      ...this.parent?.(),
      width: {
        default: null,
        parseHTML: element => element.getAttribute('width') || null,
        renderHTML: attributes => {
          if (!attributes.width) {
            return {}
          }
          return {
            width: attributes.width,
          }
        },
      },
      height: {
        default: null,
        parseHTML: element => element.getAttribute('height') || null,
        renderHTML: attributes => {
          if (!attributes.height) {
            return {}
          }
          return {
            height: attributes.height,
          }
        },
      },
      // 保存图片宽高比
      aspectRatio: {
        default: null,
        parseHTML: element => {
          const ratio = element.getAttribute('data-aspect-ratio')
          return ratio ? parseFloat(ratio) : null
        },
        renderHTML: attributes => {
          if (!attributes.aspectRatio) {
            return {}
          }
          return {
            'data-aspect-ratio': attributes.aspectRatio,
          }
        },
      },
      // 图片对齐方式
      alignment: {
        default: 'center',
        parseHTML: element => element.getAttribute('data-alignment') || 'center',
        renderHTML: attributes => {
          if (!attributes.alignment) {
            return {}
          }
          return {
            'data-alignment': attributes.alignment,
          }
        },
      },
      // 唯一标识符
      id: {
        default: () => `img-${Date.now()}`,
      },
    }
  },
  
  renderHTML({ HTMLAttributes }) {
    return [
      'img',
      mergeAttributes(
        this.options.HTMLAttributes,
        HTMLAttributes
      ),
    ]
  },
  
  addCommands() {
    return {
      ...this.parent?.(),
      // 设置图片大小
      setImageSize: (options) => ({ commands }) => {
        return commands.updateAttributes('resizableImage', options)
      },
      // 设置图片对齐方式
      setImageAlignment: (alignment) => ({ commands }) => {
        return commands.updateAttributes('resizableImage', { alignment })
      },
    }
  },
  
  // 添加自定义节点视图，使用Vue组件包装图片
  addNodeView() {
    return VueNodeViewRenderer(ResizableImageNodeView)
  },
})

// 处理粘贴图片
export function pasteImagePlugin(customImageUpload) {
  return new Plugin({
    key: new PluginKey('pasteImage'),
    props: {
      handlePaste: (view, event) => {
        const items = Array.from(event.clipboardData?.items || [])
        const imageItems = items.filter(item => item.type.indexOf('image') === 0)
        
        if (imageItems.length === 0) {
          return false
        }
        
        event.preventDefault()
        
        imageItems.forEach(async item => {
          const file = item.getAsFile()
          if (!file) return
          
          let imageUrl
          
          try {
            if (typeof customImageUpload === 'function') {
              imageUrl = await customImageUpload(file)
            } else {
              // 如果没有自定义上传函数，则使用本地URL
              imageUrl = URL.createObjectURL(file)
            }
            
            if (imageUrl) {
              const { schema } = view.state
              const imageNode = schema.nodes.resizableImage.create({
                src: imageUrl,
                alignment: 'center',
                id: `img-${Date.now()}`
              })
              
              const transaction = view.state.tr.replaceSelectionWith(imageNode)
              view.dispatch(transaction)
            }
          } catch (error) {
            console.error('Failed to upload pasted image:', error)
          }
        })
        
        return true
      }
    }
  })
}

// 创建图片气泡菜单扩展
export const ImageBubbleMenuExtension = BubbleMenu.extend({
  name: 'imageBubbleMenu',
  
  addOptions() {
    return {
      ...this.parent?.(),
      element: null,
      tippyOptions: {
        placement: 'top' as const,
        theme: 'light',
      },
      shouldShow: ({ editor, state }: { 
        editor: Editor, 
        state: EditorState,
        oldState?: EditorState,
        from: number,
        to: number
      }) => {
        // 检查选择是否为节点选择，以及是否选中了resizableImage节点
        const { selection } = state
        const { empty, $anchor } = selection
        
        if (!empty) return false
        
        const isResizableImage = $anchor.parent.type.name === 'resizableImage'
          || editor.isActive('resizableImage')
        
        return isResizableImage
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
      appInstance = createApp(ImageBubbleMenu, {
        editor: this.editor,
      })
      
      appInstance.mount(container)
      this.options.element = container
    }
    
    return this.parent?.()
  },
})

// 主要导出
export const ImageExtensions = [
  ResizableImage,
  ImageBubbleMenuExtension,
] 