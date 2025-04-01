import { Editor } from '@tiptap/core'
import { IMAGE_MAX_SIZE } from '../constants/image'

/**
 * 获取图片尺寸
 * @param file 图片文件
 * @returns Promise<{width: number, height: number}>
 */
export const getImageDimensions = (file: File): Promise<{ width: number; height: number }> => {
  return new Promise((resolve) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const img = new Image()
      img.onload = () => {
        resolve({
          width: img.naturalWidth,
          height: img.naturalHeight,
        })
      }
      img.src = e.target?.result as string
    }
    reader.readAsDataURL(file)
  })
}

/**
 * 将文件转换为Base64数据URL
 * @param file 图片文件
 * @returns Promise<string>
 */
export const fileToDataUrl = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      resolve(e.target?.result as string)
    }
    reader.onerror = (e) => {
      reject(e)
    }
    reader.readAsDataURL(file)
  })
}

/**
 * 上传图片
 * @param editor 编辑器实例
 * @param file 图片文件
 * @param position 可选的插入位置
 */
export const uploadImage = async (editor: Editor, file: File, position?: number): Promise<string> => {
  try {
    // 读取图片为DataURL
    const dataUrl = await fileToDataUrl(file)
    
    // 获取图片尺寸
    const dimensions = await getImageDimensions(file)
    
    // 计算图片宽度，确保不超过最大宽度
    const width = Math.min(dimensions.width, IMAGE_MAX_SIZE)
    
    if (position !== undefined) {
      // 在指定位置插入图片
      const imageNode = editor.view.state.schema.nodes.image.create({
        src: dataUrl,
        alt: file.name,
        title: file.name,
        width,
      });
      
      const transaction = editor.view.state.tr.insert(position, imageNode);
      editor.view.dispatch(transaction);
    } else {
      // 在当前光标位置插入图片
      editor.chain().focus().setImage({
        src: dataUrl,
        alt: file.name,
        title: file.name,
        width,
      }).run()
    }
    
    // 可以在这里添加成功提示
    console.log('图片上传成功')
    return dataUrl
  } catch (error) {
    console.error('图片上传失败:', error)
    // 可以在这里添加错误提示
    throw error
  }
}

/**
 * 从剪贴板粘贴图片
 * @param editor 编辑器实例
 * @param event 剪贴板事件
 * @returns boolean 是否成功处理了粘贴事件
 */
export const pasteImage = async (editor: Editor, event: ClipboardEvent): Promise<boolean> => {
  if (!event.clipboardData) return false
  
  const items = Array.from(event.clipboardData.items)
  const imageItem = items.find(item => /^image\//.test(item.type))
  
  if (!imageItem) return false
  
  const file = imageItem.getAsFile()
  if (!file) return false
  
  event.preventDefault()
  await uploadImage(editor, file)
  return true
} 