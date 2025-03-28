// 批量更新工具栏按钮组件，替换硬编码的图标大小为常量

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// 获取当前文件的目录
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const toolbarDir = path.join(__dirname, 'src/components/toolbar');

// 获取所有的工具栏按钮组件文件
const buttonFiles = fs.readdirSync(toolbarDir)
  .filter(file => file.endsWith('Button.vue'));

// 修改每个文件
for (const file of buttonFiles) {
  const filePath = path.join(toolbarDir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  
  // 替换图标大小
  content = content.replace(/:size="16"/g, ':size="TOOLBAR_ICON_SIZE"');
  
  // 添加导入语句
  if (!content.includes('import { TOOLBAR_ICON_SIZE }')) {
    content = content.replace(
      "import ToolbarButton from './ToolbarButton.vue'",
      "import ToolbarButton from './ToolbarButton.vue'\nimport { TOOLBAR_ICON_SIZE } from '../../constants/editor'"
    );
  }
  
  // 写回文件
  fs.writeFileSync(filePath, content);
  console.log(`Updated ${file}`);
}

console.log('All toolbar button components updated!'); 