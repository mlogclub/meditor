<template>
  <div class="slash-commands" ref="slashCommandsRef">
    <div v-if="items.length > 0" class="search-hint">
      继续输入关键词筛选菜单...
    </div>
    <button
      v-for="item in items"
      :key="item.title"
      class="slash-item"
      :class="{ 'is-selected': item === selectedItem }"
      @click="selectItem(item)"
    >
      <component :is="item.icon" class="item-icon" :size="18" />
      <div class="item-content">
        <div class="item-title">
          {{ item.title }}
          <span v-if="item.aliases && item.aliases.length > 0" class="item-aliases">
            /{{ item.aliases[0] }}
          </span>
        </div>
        <div class="item-description">
          {{ item.description }}
        </div>
      </div>
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, nextTick } from 'vue'
import type { CommandItem } from './types'

const props = defineProps<{
  items: CommandItem[]
  command: (item: CommandItem) => void
  editor: any
  range: { from: number; to: number }
  clientRect: DOMRect | null
}>()

const selectedItem = ref<CommandItem | null>(null)
const selectedIndex = ref(0)
const slashCommandsRef = ref<HTMLElement | null>(null)

// 初始化选中第一项
if (props.items.length > 0) {
  selectedItem.value = props.items[0]
}

// 监听 items 变化，当 items 为空时清除选中项
// 当 items 有值但没有选中项时，选择第一项
watch(() => props.items, (newItems) => {
  if (newItems.length === 0) {
    selectedItem.value = null;
    selectedIndex.value = 0;
  } else if (!selectedItem.value && newItems.length > 0) {
    selectedItem.value = newItems[0];
    selectedIndex.value = 0;
  }
}, { immediate: true });

// 滚动到选中项
const scrollToSelected = () => {
  nextTick(() => {
    const container = slashCommandsRef.value;
    const selectedElement = container?.querySelector('.is-selected') as HTMLElement;
    
    if (container && selectedElement) {
      // 获取容器和选中元素的位置信息
      const containerRect = container.getBoundingClientRect();
      const selectedRect = selectedElement.getBoundingClientRect();
      
      // 判断选中元素是否在容器可视区域外
      const isAbove = selectedRect.top < containerRect.top;
      const isBelow = selectedRect.bottom > containerRect.bottom;
      
      if (isAbove) {
        // 如果选中项在可视区域上方，滚动到使其显示在顶部
        container.scrollTop = selectedElement.offsetTop;
      } else if (isBelow) {
        // 如果选中项在可视区域下方，滚动到使其显示在底部
        container.scrollTop = selectedElement.offsetTop + selectedElement.offsetHeight - container.clientHeight;
      }
    }
  });
};

// 监听选中项变化，滚动到选中项
watch(() => selectedItem.value, () => {
  scrollToSelected();
});

const selectItem = (item: CommandItem) => {
  selectedItem.value = item
  props.command(item)
}

const onKeyDown = (event: KeyboardEvent): boolean => {
  // 如果没有菜单项，不处理键盘事件
  if (props.items.length === 0) {
    return false;
  }

  if (event.key === 'ArrowUp') {
    event.preventDefault()
    selectedIndex.value = (selectedIndex.value - 1 + props.items.length) % props.items.length
    selectedItem.value = props.items[selectedIndex.value]
    return true
  }

  if (event.key === 'ArrowDown') {
    event.preventDefault()
    selectedIndex.value = (selectedIndex.value + 1) % props.items.length
    selectedItem.value = props.items[selectedIndex.value]
    return true
  }

  if (event.key === 'Enter' && selectedItem.value) {
    event.preventDefault()
    selectItem(selectedItem.value)
    return true
  }

  return false
}

defineExpose({
  onKeyDown,
})
</script>

<style lang="scss">
.slash-commands {
  background: white;
  border-radius: 6px;
  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.05), 0px 10px 20px rgba(0, 0, 0, 0.1);
  padding: 0.5rem;
  width: 240px;
  max-height: 400px;
  overflow-y: auto;
  
  // 美化滚动条样式
  &::-webkit-scrollbar {
    width: 6px;
    opacity: 0;
    transition: opacity 0.3s;
  }
  
  &:hover::-webkit-scrollbar {
    opacity: 1;
  }
  
  &::-webkit-scrollbar-track {
    background: transparent;
    border-radius: 3px;
  }
  
  &::-webkit-scrollbar-thumb {
    background-color: rgba(0, 0, 0, 0.2);
    border-radius: 3px;
    transition: background-color 0.3s;
    min-height: 30px;
    max-height: 60px;
    
    &:hover {
      background-color: rgba(0, 0, 0, 0.3);
    }
  }
  
  // Firefox滚动条样式
  scrollbar-width: thin;
  scrollbar-color: transparent transparent;
  
  &:hover {
    scrollbar-color: rgba(0, 0, 0, 0.2) transparent;
  }

  /* 暗色主题滚动条 */
  .dark & {
    scrollbar-color: transparent transparent;
    
    &:hover {
      scrollbar-color: rgba(255, 255, 255, 0.2) transparent;
    }
    
    &::-webkit-scrollbar-thumb {
      background-color: rgba(255, 255, 255, 0);
      
      &:hover {
        background-color: rgba(255, 255, 255, 0.3);
      }
    }
    
    &:hover::-webkit-scrollbar-thumb {
      background-color: rgba(255, 255, 255, 0.2);
    }
  }
}

.search-hint {
  font-size: 12px;
  color: #6b7280;
  margin-bottom: 0.5rem;
  padding: 0 0.5rem;
}

.slash-item {
  display: flex;
  align-items: center;
  padding: 0.5rem;
  margin: 0;
  width: 100%;
  background: none;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  text-align: left;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #f3f4f6;
  }

  &.is-selected {
    // background-color: #e5e7eb;
    background-color: #f3f4f6;
  }

  .item-icon {
    margin-right: 0.75rem;
    color: #6b7280;
  }

  .item-content {
    flex: 1;
  }

  .item-title {
    font-size: 14px;
    // font-weight: 500;
    color: #111827;
    display: flex;
    justify-content: space-between;
    align-items: center;
    
    .item-aliases {
      font-size: 12px;
      // opacity: 0.8;
      color: #6b7280;
    }
  }

  .item-description {
    font-size: 12px;
    color: #6b7280;
  }
}

/* 暗色主题样式 */
.dark {
  .slash-commands {
    background: #1f2937;
    box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.05), 0px 10px 20px rgba(0, 0, 0, 0.2);
  }

  .slash-item {
    &:hover {
      background-color: #374151;
    }

    &.is-selected {
      background-color: #4b5563;
    }

    .item-icon {
      color: #9ca3af;
    }

    .item-title {
      color: #f9fafb;
    }

    .item-description {
      color: #9ca3af;
    }
  }
}
</style> 