import { Extension } from '@tiptap/core'
import { Plugin, PluginKey } from '@tiptap/pm/state'

export interface ImageUploadOptions {
  // 允许哪些MIME类型
  acceptMimeTypes: string[]
  // 上传图片的处理函数，返回图片URL
  uploadFn: (file: File) => Promise<string>
  // 是否允许拖放上传
  enableDragAndDrop: boolean
  // 最大允许上传的文件大小（单位：字节）
  maxFileSize: number
  // 错误处理函数
  onError?: (error: Error, file?: File) => void
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    imageUpload: {
      /**
       * 打开文件选择器上传图片
       */
      openImageUpload: () => ReturnType
    }
  }
}

export const ImageUpload = Extension.create<ImageUploadOptions>({
  name: 'imageUpload',

  addOptions() {
    return {
      acceptMimeTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
      uploadFn: (file: File) => {
        // 默认实现是转换为base64
        return new Promise((resolve) => {
          const reader = new FileReader()
          reader.onload = () => resolve(reader.result as string)
          reader.readAsDataURL(file)
        })
      },
      enableDragAndDrop: true,
      maxFileSize: 5 * 1024 * 1024, // 默认5MB
      onError: (error: Error) => {
        console.error('Image upload error:', error)
      },
    }
  },

  addCommands() {
    return {
      openImageUpload: () => ({ commands }) => {
        // 创建一个隐藏的文件输入
        const input = document.createElement('input')
        input.type = 'file'
        input.accept = this.options.acceptMimeTypes.join(',')
        input.style.display = 'none'
        document.body.appendChild(input)

        // 添加事件监听器
        input.addEventListener('change', async () => {
          if (input.files?.length) {
            const file = input.files[0]
            
            try {
              // 文件大小检查
              if (file.size > this.options.maxFileSize) {
                throw new Error(`File size exceeds limit (${this.options.maxFileSize / 1024 / 1024}MB)`)
              }

              // 文件类型检查
              if (!this.options.acceptMimeTypes.includes(file.type)) {
                throw new Error(`Unsupported file type: ${file.type}`)
              }
              
              // 使用提供的上传函数
              const src = await this.options.uploadFn(file)
              
              // 获取图片尺寸
              const dimensions = await new Promise<{ width: number; height: number }>((resolve) => {
                const img = new Image()
                img.onload = () => {
                  resolve({
                    width: img.naturalWidth,
                    height: img.naturalHeight,
                  })
                }
                img.src = src
              })
              
              // 使用setImage命令插入图片
              commands.setImage({
                src,
                alt: file.name,
                title: file.name,
                width: dimensions.width,
              })
            } catch (error) {
              if (error instanceof Error && this.options.onError) {
                this.options.onError(error, file)
              } else {
                console.error('图片上传失败:', error)
              }
            }
          }
          
          // 清理DOM
          document.body.removeChild(input)
        }, { once: true })
        
        // 触发文件选择器
        input.click()
        
        return true
      },
    }
  },

  addProseMirrorPlugins() {
    const extensionThis = this
    
    return [
      new Plugin({
        key: new PluginKey('imageUpload'),
        props: {
          handlePaste(view, event: ClipboardEvent) {
            if (!event.clipboardData) return false
            
            const items = Array.from(event.clipboardData.items)
            const imageItem = items.find(item => /^image\//.test(item.type))

            if (!imageItem) {
              return false
            }

            event.preventDefault()
            
            const file = imageItem.getAsFile()
            if (!file) {
              return false
            }
            
            // 检查MIME类型是否被接受
            if (!extensionThis.options.acceptMimeTypes.includes(file.type)) {
              const error = new Error(`不支持的图片类型: ${file.type}`)
              if (extensionThis.options.onError) {
                extensionThis.options.onError(error, file)
              } else {
                console.warn(error.message)
              }
              return false
            }
            
            // 检查文件大小
            if (file.size > extensionThis.options.maxFileSize) {
              const error = new Error(`文件大小超过限制 (${extensionThis.options.maxFileSize / 1024 / 1024}MB)`)
              if (extensionThis.options.onError) {
                extensionThis.options.onError(error, file)
              } else {
                console.warn(error.message)
              }
              return false
            }
            
            // 上传并插入图片
            extensionThis.options.uploadFn(file)
              .then(src => {
                // 获取图片尺寸
                const img = new Image()
                img.onload = () => {
                  view.dispatch(
                    view.state.tr.replaceSelectionWith(
                      view.state.schema.nodes.image.create({
                        src,
                        alt: file.name,
                        title: file.name,
                        width: img.naturalWidth,
                      })
                    )
                  )
                }
                img.src = src
              })
              .catch(error => {
                if (extensionThis.options.onError) {
                  extensionThis.options.onError(error instanceof Error ? error : new Error(String(error)), file)
                } else {
                  console.error('图片粘贴上传失败:', error)
                }
              })
              
            return true
          },
          
          // 添加拖放支持
          handleDrop(view, event, slice, moved) {
            if (!extensionThis.options.enableDragAndDrop || moved) {
              return false
            }
            
            if (!event.dataTransfer) {
              return false
            }
            
            // 检查是否拖拽到了编辑器内容区域
            const target = event.target as HTMLElement
            if (target.closest('.ProseMirror')) {
              return false // 让 ImageDropZone 处理这种情况
            }
            
            const files = Array.from(event.dataTransfer.files)
            const imageFiles = files.filter(file => 
              extensionThis.options.acceptMimeTypes.includes(file.type)
            )
            
            if (imageFiles.length === 0) {
              return false
            }
            
            event.preventDefault()
            
            // 获取拖放的具体位置
            const coordinates = view.posAtCoords({ left: event.clientX, top: event.clientY })
            
            if (!coordinates) {
              return false
            }
            
            // 处理每个图片文件
            imageFiles.forEach(async (file) => {
              try {
                // 检查文件大小
                if (file.size > extensionThis.options.maxFileSize) {
                  throw new Error(`文件大小超过限制 (${extensionThis.options.maxFileSize / 1024 / 1024}MB)`)
                }
                
                const src = await extensionThis.options.uploadFn(file)
                
                const img = new Image()
                img.onload = () => {
                  // 在拖放位置插入图片
                  const transaction = view.state.tr.insert(
                    coordinates.pos,
                    view.state.schema.nodes.image.create({
                      src,
                      alt: file.name,
                      title: file.name,
                      width: img.naturalWidth,
                    })
                  )
                  
                  view.dispatch(transaction)
                }
                img.src = src
              } catch (error) {
                if (extensionThis.options.onError) {
                  extensionThis.options.onError(error instanceof Error ? error : new Error(String(error)), file)
                } else {
                  console.error('图片拖放上传失败:', error)
                }
              }
            })
            
            return true
          },
        },
      }),
    ]
  },
}) 