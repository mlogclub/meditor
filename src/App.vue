<script setup lang="ts">
import MEditor from './components/MEditor.vue'
import { ref } from 'vue'

const content = ref('')

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
</script>

<template>
  <div class="app">
    <MEditor 
      v-model="content" 
      :customImageUpload="customImageUpload"
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
</style>
