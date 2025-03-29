import { mergeAttributes, Node } from '@tiptap/core'
import { VueNodeViewRenderer } from '@tiptap/vue-3'
import { Plugin, PluginKey } from '@tiptap/pm/state'
import ResizableImageView from './ResizableImageView.vue'

export interface ImageOptions {
  inline: boolean,
  HTMLAttributes: Record<string, any>,
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    resizableImage: {
      /**
       * 添加图片
       */
      setResizableImage: (options: { 
        src: string, 
        alt?: string, 
        title?: string, 
        width?: string, 
        height?: string,
        align?: 'left' | 'center' | 'right'
      }) => ReturnType,
      /**
       * 更新图片属性
       */
      updateResizableImage: (options: {
        src?: string,
        alt?: string,
        title?: string,
        width?: string,
        height?: string,
        align?: 'left' | 'center' | 'right'
      }) => ReturnType,
    }
  }
}

export const ResizableImage = Node.create<ImageOptions>({
  name: 'resizableImage',

  addOptions() {
    return {
      inline: false,
      HTMLAttributes: {},
    }
  },

  inline() {
    return this.options.inline
  },

  group() {
    return this.options.inline ? 'inline' : 'block'
  },

  draggable: true,

  addAttributes() {
    return {
      src: {
        default: null,
      },
      alt: {
        default: null,
      },
      title: {
        default: null,
      },
      width: {
        default: '100%',
        parseHTML: element => element.getAttribute('width') || element.style.width,
        renderHTML: attributes => {
          if (!attributes.width) {
            return {}
          }
          return {
            width: attributes.width,
            style: `width: ${attributes.width}`,
          }
        },
      },
      height: {
        default: 'auto',
        parseHTML: element => element.getAttribute('height') || element.style.height,
        renderHTML: attributes => {
          if (!attributes.height) {
            return {}
          }
          return {
            height: attributes.height,
            style: `height: ${attributes.height}`,
          }
        },
      },
      align: {
        default: 'center',
        parseHTML: element => element.getAttribute('align') || 'center',
        renderHTML: attributes => {
          return {
            style: `text-align: ${attributes.align}`,
          }
        },
      },
    }
  },

  parseHTML() {
    return [
      {
        tag: this.options.inline ? 'img[src]:not([src^="data:"])' : 'img[src]',
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return ['img', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes)]
  },

  addNodeView() {
    return VueNodeViewRenderer(ResizableImageView)
  },

  addCommands() {
    return {
      setResizableImage: options => ({ chain }) => {
        return chain()
          .insertContent({
            type: this.name,
            attrs: options,
          })
          .run()
      },
      updateResizableImage: options => ({ chain, state, dispatch }) => {
        const { selection } = state
        const { empty } = selection

        if (empty) {
          return false
        }

        if (dispatch) {
          chain()
            .updateAttributes(this.name, options)
            .run()
        }

        return true
      },
    }
  },

  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: new PluginKey('resizableImagePlugin'),
        props: {
          handleDOMEvents: {
            // 处理图片粘贴
            paste(view, event) {
              const items = Array.from(event.clipboardData?.items || [])
              const imageItems = items.filter(item => item.type.indexOf('image') === 0)

              if (imageItems.length === 0) {
                return false
              }

              event.preventDefault()

              // 处理所有粘贴的图片
              imageItems.forEach(item => {
                const file = item.getAsFile()
                if (!file) return

                const reader = new FileReader()
                reader.onload = readerEvent => {
                  const src = readerEvent.target?.result
                  if (typeof src === 'string') {
                    view.dispatch(view.state.tr.replaceSelectionWith(
                      view.state.schema.nodes.resizableImage.create({ 
                        src,
                        width: '100%',
                        height: 'auto',
                        align: 'center'
                      })
                    ))
                  }
                }
                reader.readAsDataURL(file)
              })

              return true
            },
            // 处理拖放图片
            drop(view, event) {
              const hasFiles = event.dataTransfer?.files.length
              
              if (!hasFiles) {
                return false
              }

              const images = Array.from(event.dataTransfer.files).filter(file => 
                /image\/(jpg|jpeg|png|gif|webp|svg)/.test(file.type)
              )
              
              if (images.length === 0) {
                return false
              }

              event.preventDefault()

              const { schema } = view.state
              const coordinates = view.posAtCoords({ left: event.clientX, top: event.clientY })

              images.forEach(image => {
                const reader = new FileReader()
                reader.onload = readerEvent => {
                  const src = readerEvent.target?.result
                  if (typeof src === 'string' && coordinates) {
                    const node = schema.nodes.resizableImage.create({ 
                      src,
                      width: '100%',
                      height: 'auto',
                      align: 'center'
                    })
                    const transaction = view.state.tr.insert(coordinates.pos, node)
                    view.dispatch(transaction)
                  }
                }
                reader.readAsDataURL(image)
              })

              return true
            },
          },
        },
      }),
    ]
  },
}) 