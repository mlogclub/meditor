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

// 主题切换
const toggleTheme = () => {
  const htmlElement = document.documentElement
  if (htmlElement.classList.contains('dark')) {
    htmlElement.classList.remove('dark')
  } else {
    htmlElement.classList.add('dark')
  }
}

</script>

<template>
  <div class="app">
    <div class="app-header">
      <button class="theme-toggle-btn" @click="toggleTheme">
        切换主题
      </button>
    </div>
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
  color: var(--editor-text);
}

.app-header {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 1rem;
}

.theme-toggle-btn {
  padding: 0.5rem 1rem;
  background: var(--editor-toolbar-bg);
  border: 1px solid var(--editor-border);
  border-radius: 4px;
  color: var(--editor-text);
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s ease;
}

.theme-toggle-btn:hover {
  background: var(--editor-hover);
}

@media (prefers-color-scheme: dark) {
  body {
    background-color: #1a1a1a;
  }
}

html.dark body {
  background-color: #1a1a1a;
}
</style>
