import { Plugin, PluginKey } from "prosemirror-state";

export const PluginKeyPasteImage = new PluginKey("pasteImage");
export const PluginKeyImageDragDrop = new PluginKey("imageDragDrop");

// 处理粘贴图片
export function PluginPasteImage(customImageUpload) {
  return new Plugin({
    key: PluginKeyPasteImage,
    props: {
      handlePaste: (view, event) => {
        const items = Array.from(event.clipboardData?.items || []);
        const imageItems = items.filter(
          (item) => item.type.indexOf("image") === 0
        );

        if (imageItems.length === 0) {
          return false;
        }

        event.preventDefault();

        imageItems.forEach(async (item) => {
          const file = item.getAsFile();
          if (!file) return;

          let imageUrl;

          try {
            if (typeof customImageUpload === "function") {
              imageUrl = await customImageUpload(file);
            } else {
              // 如果没有自定义上传函数，则使用本地URL
              imageUrl = URL.createObjectURL(file);
            }

            if (imageUrl) {
              const { schema } = view.state;
              const imageNode = schema.nodes.resizableImage.create({
                src: imageUrl,
                alignment: "center",
                id: `img-${Date.now()}`,
              });

              const transaction = view.state.tr.replaceSelectionWith(imageNode);
              view.dispatch(transaction);
            }
          } catch (error) {
            console.error("Failed to upload pasted image:", error);
          }
        });

        return true;
      },
    },
  });
}

// 创建图片拖拽上传插件
export function PluginImageDragAndDrop(customImageUpload) {
  return new Plugin({
    key: PluginKeyImageDragDrop,
    props: {
      handleDrop: (view, event, slice, moved) => {
        // 如果是编辑器内部节点的移动，不拦截
        if (moved) return false
        
        // 检查是否有文件被拖拽
        const files = Array.from(event.dataTransfer?.files || [])
        const imageFiles = files.filter(file => file.type.startsWith('image/'))
        
        if (imageFiles.length === 0) {
          return false
        }
        
        // 阻止默认行为
        event.preventDefault()
        
        // 获取放置位置的坐标
        const coordinates = view.posAtCoords({ left: event.clientX, top: event.clientY })
        
        if (!coordinates) return false
        
        // 处理每个图片文件
        imageFiles.forEach(async file => {
          let imageUrl
          
          try {
            if (typeof customImageUpload === 'function') {
              imageUrl = await customImageUpload(file)
            } else {
              // 如果没有自定义上传函数，则使用本地URL
              imageUrl = URL.createObjectURL(file)
            }
            
            if (imageUrl) {
              const { schema } = view.state
              const imageNode = schema.nodes.resizableImage.create({
                src: imageUrl,
                alignment: 'center',
                id: `img-${Date.now()}`
              })
              
              // 在放置位置插入图片节点
              const transaction = view.state.tr.insert(coordinates.pos, imageNode)
              view.dispatch(transaction)
            }
          } catch (error) {
            console.error('Failed to upload dropped image:', error)
          }
        })
        
        return true
      }
    }
  })
}