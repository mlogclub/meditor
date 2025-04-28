<script setup lang="ts">
import TiptapEditor from './components/TiptapEditor.vue'
import { ref, provide } from 'vue'

const content = ref('')
const uploadError = ref<string | null>(null)

// 模拟自定义图片上传函数
const customImageUpload = async (file: File): Promise<string> => {
  // 检查文件大小和类型
  if (file.size > 5 * 1024 * 1024) {
    throw new Error('图片大小不能超过5MB')
  }
  
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
  if (!allowedTypes.includes(file.type)) {
    throw new Error('只支持 JPG、PNG、GIF 和 WebP 格式的图片')
  }
  
  // 模拟上传
  return new Promise((resolve) => {
    // 这里只是模拟上传，实际项目中应该发送请求到服务器
    setTimeout(() => {
      // 使用本地URL模拟上传成功
      const url = URL.createObjectURL(file)
      console.log('图片上传成功:', url)
      resolve(url)
    }, 500)
  })
}

// 提供自定义上传函数给所有子组件
provide('customImageUpload', customImageUpload)

// 处理图片上传错误
const handleImageUploadError = (error: Error, file?: File) => {
  uploadError.value = error.message
  
  // 3秒后自动清除错误
  setTimeout(() => {
    uploadError.value = null
  }, 3000)
}
</script>

<template>
  <div class="app">
    <!-- 显示错误消息 -->
    <div class="upload-error" v-if="uploadError">
      {{ uploadError }}
    </div>
    
    <TiptapEditor 
      v-model="content" 
      :customImageUpload="customImageUpload"
      @image-upload-error="handleImageUploadError"
    />
    <div v-text="content"></div>
  </div>
</template>

<style>
.app {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem;
  position: relative;
}

.upload-error {
  position: fixed;
  top: 1rem;
  right: 1rem;
  background: #ef4444;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  z-index: 1000;
  animation: fade-in 0.3s ease;
}

@keyframes fade-in {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
