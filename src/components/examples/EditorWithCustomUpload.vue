<template>
  <div class="example-container">
    <h1>富文本编辑器示例（自定义图片上传）</h1>
    
    <TiptapEditor
      v-model="content"
      :customImageUpload="uploadImageToService"
      :maxImageSize="maxSize"
      :acceptImageTypes="acceptedTypes"
      @image-upload-error="handleUploadError"
    />
    
    <div v-if="errorMessage" class="error-message">
      {{ errorMessage }}
    </div>
    
    <div class="content-preview">
      <h2>编辑内容预览</h2>
      <div v-html="content"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import TiptapEditor from '../TiptapEditor.vue'

const content = ref('<h2>开始编辑吧！</h2><p>这是一个示例，您可以尝试上传图片。</p><p>您也可以拖拽图片到编辑区域直接上传。</p>')
const errorMessage = ref('')
const maxSize = 10 * 1024 * 1024 // 10MB
const acceptedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']

// 模拟自定义上传函数
// 在实际应用中，这个函数会调用您的API服务来上传图片
const uploadImageToService = async (file: File): Promise<string> => {
  // 清除之前的错误信息
  errorMessage.value = ''
  
  // 模拟网络延迟
  await new Promise(resolve => setTimeout(resolve, 500))
  
  // 检查文件类型
  if (!acceptedTypes.includes(file.type)) {
    throw new Error(`不支持的文件类型: ${file.type}`)
  }
  
  // 检查文件大小
  if (file.size > maxSize) {
    throw new Error(`文件过大，最大允许 ${maxSize / 1024 / 1024}MB`)
  }
  
  // 在实际应用中，这里会是上传到服务器的逻辑
  // const formData = new FormData()
  // formData.append('file', file)
  // const response = await fetch('/api/upload', {
  //   method: 'POST',
  //   body: formData
  // })
  // const data = await response.json()
  // return data.url
  
  // 这里我们只是简单地返回本地文件的URL
  // 注意：这只在示例中有效，实际应用应该上传到服务器
  return URL.createObjectURL(file)
}

// 处理上传错误
const handleUploadError = (error: Error) => {
  console.error('上传图片时出错:', error)
  errorMessage.value = error.message
  
  // 5秒后清除错误信息
  setTimeout(() => {
    errorMessage.value = ''
  }, 5000)
}
</script>

<style lang="scss" scoped>
.example-container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 2rem;
  
  h1 {
    margin-bottom: 2rem;
    font-size: 1.75rem;
    color: #111827;
  }
}

.error-message {
  margin-top: 1rem;
  padding: 0.75rem;
  background-color: #fee2e2;
  color: #b91c1c;
  border-radius: 0.375rem;
  border-left: 4px solid #ef4444;
}

.content-preview {
  margin-top: 2rem;
  padding: 1.5rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.375rem;
  
  h2 {
    margin-bottom: 1rem;
    font-size: 1.25rem;
    color: #1f2937;
  }
}
</style> 