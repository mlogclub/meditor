import Image from '@tiptap/extension-image'
import { mergeAttributes } from '@tiptap/core'
import { VueNodeViewRenderer } from '@tiptap/vue-3'
import ResizableImageNodeView from './ResizableImageNodeView.vue'

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
            'style': `display: block; margin: ${attributes.alignment === 'center' ? '0 auto' : attributes.alignment === 'left' ? '0 auto 0 0' : '0 0 0 auto'};`,
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
    const { alignment } = HTMLAttributes
    
    // 根据对齐方式设置样式
    const style = alignment
      ? `display: block; margin: ${alignment === 'center' ? '0 auto' : alignment === 'left' ? '0 auto 0 0' : '0 0 0 auto'};`
      : ''
    
    return [
      'img',
      mergeAttributes(
        this.options.HTMLAttributes,
        HTMLAttributes,
        { style }
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
import { Plugin, PluginKey } from 'prosemirror-state'

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

// 主要导出
export const ImageExtensions = [
  ResizableImage,
] 