import { suggestion } from './suggestion'
import SlashCommandsList from './SlashCommandsList.vue'
import { getSuggestionItems } from './SlashCommandsList.vue'
import type { CommandItem } from './SlashCommandsList.vue'

export {
  suggestion,
  SlashCommandsList,
  getSuggestionItems
}

// 导出类型
export type { CommandItem }

// 导出默认插件，方便在TiptapEditor中使用
export default suggestion 