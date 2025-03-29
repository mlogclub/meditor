import { ResizableImage } from './resizable-image'
import { Editor } from '@tiptap/core'

// 打开图片上传对话框
export const addImage = (editor: Editor | null | undefined) => {
  if (!editor) return
  
  // 创建隐藏的文件输入元素
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = 'image/*'
  input.multiple = true
  input.style.display = 'none'
  document.body.appendChild(input)
  
  // 监听文件选择
  input.onchange = () => {
    const files = Array.from(input.files || [])
    
    if (files.length > 0) {
      // 处理所有选中的图片
      files.forEach(file => {
        if (file.type.startsWith('image/')) {
          const reader = new FileReader()
          
          reader.onload = () => {
            editor.chain()
              .focus()
              .setResizableImage({ 
                src: reader.result as string,
                width: '100%',
                height: 'auto',
                align: 'center'
              })
              .run()
          }
          
          reader.readAsDataURL(file)
        }
      })
    }
    
    // 清理
    document.body.removeChild(input)
  }
  
  // 触发文件选择
  input.click()
}

export default ResizableImage
export { ResizableImage } 