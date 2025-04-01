<template>
  <div class="slash-commands" ref="slashCommandsRef">
    <button
      v-for="item in items"
      :key="item.title"
      class="slash-item"
      :class="{ 'is-selected': item === selectedItem }"
      @click="selectItem(item)"
    >
      <component :is="item.icon" class="item-icon" :size="18" />
      <div class="item-content">
        <div class="item-title">{{ item.title }}</div>
        <div class="item-description">{{ item.description }}</div>
      </div>
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, nextTick } from 'vue'

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

<style>
.slash-commands {
  background: white;
  border-radius: 6px;
  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.05), 0px 10px 20px rgba(0, 0, 0, 0.1);
  padding: 0.5rem;
  width: 240px;
  max-height: 400px;
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: #c1c1c1 #f1f1f1;
}

/* 暗色主题滚动条 */
.dark .slash-commands {
  scrollbar-color: #4a4a4a #2d2d2d;
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
}

.slash-item:hover {
  background-color: #f3f4f6;
}

.slash-item.is-selected {
  background-color: #e5e7eb;
}

.item-icon {
  margin-right: 0.75rem;
  color: #6b7280;
}

.item-content {
  flex: 1;
}

.item-title {
  font-weight: 500;
  color: #111827;
}

.item-description {
  font-size: 0.875rem;
  color: #6b7280;
}

/* 暗色主题样式 */
.dark .slash-commands {
  background: #1f2937;
  box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.05), 0px 10px 20px rgba(0, 0, 0, 0.2);
}

.dark .slash-item:hover {
  background-color: #374151;
}

.dark .slash-item.is-selected {
  background-color: #4b5563;
}

.dark .item-icon {
  color: #9ca3af;
}

.dark .item-title {
  color: #f9fafb;
}

.dark .item-description {
  color: #9ca3af;
}
</style> 