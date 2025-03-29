<template>
  <node-view-wrapper
    class="resizable-image-wrapper"
    :class="{
      'is-selected': isSelected,
      [`align-${node.attrs.align || 'center'}`]: true,
    }"
  >
    <div
      class="image-container"
      @mouseenter="handleMouseEnter"
      @mouseleave="handleMouseLeave"
      :style="{
        width: node.attrs.width || '100%',
        height: node.attrs.height || 'auto',
      }"
    >
      <img
        :src="node.attrs.src"
        :alt="node.attrs.alt"
        :title="node.attrs.title"
        :style="{
          width: node.attrs.width || '100%',
          height: node.attrs.height || 'auto',
        }"
        @click="selectImage"
        @dblclick="handleDoubleClick"
      />
      <!-- 拖动边框和控制点 -->
      <div v-if="isHovered || isSelected" class="resize-frame">
        <div
          v-for="handle in cornerHandles"
          :key="handle.position"
          class="resize-handle"
          :class="handle.position"
          :style="{ cursor: handle.cursor }"
          @mousedown.stop="startResize($event, handle)"
        />
      </div>
      <!-- 工具栏 -->
      <div v-if="isSelected" class="image-controls">
        <div class="image-toolbar">
          <button
            class="toolbar-button"
            @click="handleAlign('left')"
            :class="{ active: node.attrs.align === 'left' }"
            title="左对齐"
          >
            <AlignLeft :size="16" />
          </button>
          <button
            class="toolbar-button"
            @click="handleAlign('center')"
            :class="{ active: node.attrs.align === 'center' }"
            title="居中"
          >
            <AlignCenter :size="16" />
          </button>
          <button
            class="toolbar-button"
            @click="handleAlign('right')"
            :class="{ active: node.attrs.align === 'right' }"
            title="右对齐"
          >
            <AlignRight :size="16" />
          </button>
          <button class="toolbar-button" @click="handleEdit" title="编辑图片">
            <Edit :size="16" />
          </button>
        </div>
      </div>
    </div>
  </node-view-wrapper>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch } from "vue";
import { NodeViewWrapper, nodeViewProps } from "@tiptap/vue-3";
import { AlignLeft, AlignCenter, AlignRight, Edit } from "lucide-vue-next";

const props = defineProps(nodeViewProps);

const isSelected = ref(props.selected);
const isHovered = ref(false);
let startX = 0;
let startY = 0;
let startWidth = 0;
let startHeight = 0;
let isResizing = false;
let currentHandle: { position: string; cursor: string } | null = null;

const cornerHandles = [
  { position: "top-left", cursor: "nw-resize" },
  { position: "top-right", cursor: "ne-resize" },
  { position: "bottom-left", cursor: "sw-resize" },
  { position: "bottom-right", cursor: "se-resize" },
];

const handleMouseEnter = () => {
  isHovered.value = true;
};

const handleMouseLeave = () => {
  if (!isResizing) {
    isHovered.value = false;
  }
};

const selectImage = () => {
  isSelected.value = true;
};

const handleDoubleClick = () => {
  handleEdit();
};

const handleEdit = () => {
  const url = window.prompt("输入新的图片URL", props.node.attrs.src);
  if (url) {
    props.updateAttributes({ src: url });
  }
};

const handleAlign = (align: "left" | "center" | "right") => {
  props.updateAttributes({ align });
};

const startResize = (
  event: MouseEvent,
  handle: { position: string; cursor: string }
) => {
  event.preventDefault();
  isResizing = true;
  currentHandle = handle;
  startX = event.clientX;
  startY = event.clientY;
  startWidth = parseInt(props.node.attrs.width || "100");
  startHeight = parseInt(props.node.attrs.height || "100");

  document.addEventListener("mousemove", handleResize);
  document.addEventListener("mouseup", stopResize);
};

const handleResize = (event: MouseEvent) => {
  if (!isResizing || !currentHandle) return;

  const deltaX = event.clientX - startX;
  const deltaY = event.clientY - startY;
  let newWidth = startWidth;
  let newHeight = startHeight;

  // 根据不同的控制点计算新的尺寸
  switch (currentHandle.position) {
    case "top-right":
      newWidth = Math.max(50, startWidth + deltaX);
      newHeight = Math.max(50, startHeight - deltaY);
      break;
    case "bottom-right":
      newWidth = Math.max(50, startWidth + deltaX);
      newHeight = Math.max(50, startHeight + deltaY);
      break;
    case "bottom-left":
      newWidth = Math.max(50, startWidth - deltaX);
      newHeight = Math.max(50, startHeight + deltaY);
      break;
    case "top-left":
      newWidth = Math.max(50, startWidth - deltaX);
      newHeight = Math.max(50, startHeight - deltaY);
      break;
  }

  props.updateAttributes({
    width: `${newWidth}px`,
    height: `${newHeight}px`,
  });
};

const stopResize = () => {
  isResizing = false;
  currentHandle = null;
  document.removeEventListener("mousemove", handleResize);
  document.removeEventListener("mouseup", stopResize);

  if (!isHovered.value) {
    isHovered.value = false;
  }
};

// 监听选中状态变化
watch(
  () => props.selected,
  (newValue) => {
    isSelected.value = newValue;
  }
);

onMounted(() => {
  document.addEventListener("click", (event) => {
    const target = event.target as HTMLElement;
    if (!target.closest(".resizable-image-wrapper")) {
      isSelected.value = false;
    }
  });
});

onBeforeUnmount(() => {
  document.removeEventListener("mousemove", handleResize);
  document.removeEventListener("mouseup", stopResize);
});
</script>

<style scoped>
.resizable-image-wrapper {
  position: relative;
  margin: 1em 0;
  display: block;
}

.resizable-image-wrapper.align-left {
  text-align: left;
}

.resizable-image-wrapper.align-center {
  text-align: center;
}

.resizable-image-wrapper.align-right {
  text-align: right;
}

.image-container {
  position: relative;
  display: block;
  max-width: 100%;
}

.image-container img {
  display: block;
  max-width: 100%;
  height: auto;
  border-radius: 4px;
  /* transition: all 0.2s; */
}

/* 拖动边框 */
.resize-frame {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border: 1px solid #3b82f6;
  pointer-events: none;
}

/* 拖动控制点 */
.resize-handle {
  position: absolute;
  width: 7px;
  height: 7px;
  background: white;
  border: 1px solid #3b82f6;
  pointer-events: auto;
}

.resize-handle.top-left {
  top: -4px;
  left: -4px;
  cursor: nw-resize;
}

.resize-handle.top-right {
  top: -4px;
  right: -4px;
  cursor: ne-resize;
}

.resize-handle.bottom-left {
  bottom: -4px;
  left: -4px;
  cursor: sw-resize;
}

.resize-handle.bottom-right {
  bottom: -4px;
  right: -4px;
  cursor: se-resize;
}

.image-controls {
  position: absolute;
  top: -40px;
  left: 50%;
  transform: translateX(-50%);
  background: white;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 4px;
  display: flex;
  gap: 4px;
  z-index: 999999;
}

.toolbar-button {
  padding: 4px;
  border: none;
  background: none;
  border-radius: 4px;
  cursor: pointer;
  color: #6b7280;
  transition: all 0.2s;
}

.toolbar-button:hover {
  background: #f3f4f6;
  color: #1f2937;
}

.toolbar-button.active {
  background: #e5e7eb;
  color: #1f2937;
}
</style>
