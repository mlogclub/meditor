import { ResizableImage } from './resizable-image'
import { Editor } from '@tiptap/core'

// 打开图片上传对话框
export const addImage = (editor: Editor | null | undefined) => {
  if (!editor) return
  
  // 创建隐藏的文件输入元素
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = 'image/*'
  input.style.display = 'none'
  document.body.appendChild(input)
  
  // 监听文件选择
  input.onchange = () => {
    const file = input.files?.[0]
    
    if (file) {
      const reader = new FileReader()
      
      reader.onload = () => {
        editor.chain()
          .focus()
          .setResizableImage({ 
            src: reader.result as string,
            width: '100%',
            height: 'auto'
          })
          .run()
      }
      
      reader.readAsDataURL(file)
    }
    
    // 清理
    document.body.removeChild(input)
  }
  
  // 触发文件选择
  input.click()
}

export default ResizableImage
export { ResizableImage } 