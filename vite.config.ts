import vue from "@vitejs/plugin-vue";
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [
    vue(),
    AutoImport({
      defaultExportByFilename: true,
      include: [
        /\.[tj]sx?$/, // .ts, .tsx, .js, .jsx
        /\.vue$/,
        /\.vue\?vue/, // .vue
        /\.md$/, // .md
      ],
      // 自动导入 Vue 相关函数，如：ref, reactive, toRef 等
      imports: [
        "vue",
        "@vueuse/core",
      ],
      // 生成 `eslintrc-auto-import.json` 文件
      eslintrc: {
        enabled: true,
        filepath: "./.eslintrc-auto-import.json",
        globalsPropValue: true,
      },
      // 自动导入目录下的模块
      dirs: [
        "./src/composables",
      ],
      // 自动导入 Vue 模板中的组件
      vueTemplate: true,
      dts: "./auto-imports.d.ts",
    }),
    Components({
      // 指定组件位置，默认是src/components
      dirs: ["src/components"],
      // 组件的有效文件扩展名
      extensions: ["vue"],
      // 配置文件生成位置
      dts: "src/components.d.ts",
    }),
  ],
  server: {
    port: 8000,
    open: true,
  },
});
