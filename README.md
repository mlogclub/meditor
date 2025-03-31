# Meditor

基于 Vue 3 + Tiptap + PNPM 开发的一个类似 Nation 的富文本编辑器。

## 功能特点

- 基于 Tiptap 的富文本编辑能力
- 文本格式化（粗体、斜体、下划线等）
- 标题设置
- 列表（有序、无序）
- 代码块
- 引用块
- 表格支持
- 图片上传与编辑
- 链接设置
- 文本对齐
- 文本颜色与背景色
- 划重点（高亮）
- 拖拽调整图片尺寸
- 斜杠命令（Slash Commands）

## 图片上传功能

编辑器支持多种方式上传图片：

1. 工具栏上传按钮
2. 拖放上传（可直接拖拽图片到编辑区）
3. 粘贴上传（复制图片后直接粘贴到编辑区）
4. 斜杠命令（输入 `/image` 触发上传）

### 自定义图片上传

默认情况下，图片会转换为 base64 编码存储在编辑器内容中。但您可以提供自定义的上传函数，将图片上传到您的服务器：

```vue
<template>
  <TiptapEditor 
    v-model="content" 
    :customImageUpload="myUploadFunction"
    :maxImageSize="10 * 1024 * 1024"  <!-- 10MB -->
    :acceptImageTypes="['image/jpeg', 'image/png', 'image/webp']"
    @image-upload-error="handleError"
  />
</template>

<script setup>
const myUploadFunction = async (file) => {
  // 上传到您的服务器并返回URL
  const formData = new FormData()
  formData.append('file', file)
  const response = await fetch('/api/upload', {
    method: 'POST',
    body: formData
  })
  const data = await response.json()
  return data.url // 返回图片URL
}

const handleError = (error, file) => {
  console.error('上传失败', error, file)
  // 显示错误提示等
}
</script>
```

## 开发指南

### 安装依赖

```bash
pnpm install
```

### 启动开发服务器

```bash
pnpm dev
```

### 构建生产版本

```bash
pnpm build
```

## 许可证

MIT
