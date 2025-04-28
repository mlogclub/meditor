import { App } from 'vue'
import { vResizable } from './resizable'

export default {
  install(app: App) {
    app.directive('resizable', vResizable)
  }
} 