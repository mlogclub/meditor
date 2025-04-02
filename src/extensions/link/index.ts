import { mergeAttributes } from '@tiptap/core'
import Link from '@tiptap/extension-link'
import { VueRenderer } from '@tiptap/vue-3'
import LinkDialog from './LinkDialog.vue'
import tippy from 'tippy.js'
import 'tippy.js/dist/tippy.css'
import 'tippy.js/themes/light.css'

export interface LinkOptions {
  openOnClick: boolean
  HTMLAttributes: Record<string, any>
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    customLink: {
      setLink: (attributes: { href: string; target?: string; rel?: string; class?: string }) => ReturnType
      toggleLink: (attributes: { href: string; target?: string; rel?: string; class?: string }) => ReturnType
      unsetLink: () => ReturnType
      openLinkDialog: () => ReturnType
    }
  }
}

export const CustomLink = Link.extend<LinkOptions>({
  addAttributes() {
    return {
      ...this.parent?.(),
      target: {
        default: null,
        parseHTML: element => element.getAttribute('target'),
        renderHTML: attributes => {
          if (!attributes.target) {
            return {}
          }
          return {
            target: attributes.target,
          }
        },
      },
      rel: {
        default: null,
        parseHTML: element => element.getAttribute('rel'),
        renderHTML: attributes => {
          if (!attributes.rel) {
            return {}
          }
          return {
            rel: attributes.rel,
          }
        },
      },
    }
  },

  parseHTML() {
    return [
      {
        tag: 'a[href]',
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return ['a', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes), 0]
  },

  addCommands() {
    return {
      ...this.parent?.(),
      setLink:
        attributes =>
          ({ commands }) => {
            return commands.setMark(this.name, attributes)
          },
      toggleLink:
        attributes =>
          ({ commands }) => {
            return commands.toggleMark(this.name, attributes)
          },
      unsetLink:
        () =>
          ({ commands }) => {
            return commands.unsetMark(this.name)
          },
      openLinkDialog:
        () =>
          ({ editor }) => {
            // 获取当前选区
            const { from, to } = editor.state.selection
            
            // 检查是否在链接内
            const isInLink = editor.isActive('link')
            const linkAttributes = editor.getAttributes('link')
            const currentUrl = linkAttributes.href || ''
            const currentOpenInNewTab = linkAttributes.target === '_blank'
            
            // 获取选中的文本
            let selectedText = editor.state.doc.textBetween(from, to)
            let linkStart = from
            let linkEnd = to
            
            // 如果在链接内，获取整个链接文本
            if (isInLink) {
              // 查找链接的开始和结束位置
              // 向前查找链接的开始
              for (let i = from; i > 0; i--) {
                const pos = editor.state.doc.resolve(i)
                const marks = pos.marks()
                const hasLinkMark = marks.some(mark => mark.type.name === 'link')
                
                if (!hasLinkMark) {
                  linkStart = i
                  break
                }
                
                if (i === 1) {
                  linkStart = 0
                }
              }
              
              // 向后查找链接的结束
              const docSize = editor.state.doc.content.size
              for (let i = to; i < docSize; i++) {
                const pos = editor.state.doc.resolve(i)
                const marks = pos.marks()
                const hasLinkMark = marks.some(mark => mark.type.name === 'link')
                
                if (!hasLinkMark) {
                  linkEnd = i
                  break
                }
                
                if (i === docSize - 1) {
                  linkEnd = docSize - 1
                }
              }
              
              // 获取整个链接文本
              selectedText = editor.state.doc.textBetween(linkStart, linkEnd - 1)
              
              // 选中整个链接文本
              editor.chain().setTextSelection({ from: linkStart, to: linkEnd - 1 }).run()
            }

            // 创建 Vue 渲染器
            const renderer = new VueRenderer(LinkDialog, {
              props: {
                editor,
                initialText: selectedText,
                initialUrl: currentUrl,
                initialOpenInNewTab: currentOpenInNewTab,
                isEditingExistingLink: isInLink,
              },
              editor,
            })

            // 创建 tippy 实例
            const tippyInstance = tippy(document.body, {
              getReferenceClientRect: () => {
                // 使用更新后的选区
                const { from, to } = editor.state.selection
                const start = editor.view.coordsAtPos(from)
                const end = editor.view.coordsAtPos(to)
                return new DOMRect(
                  Math.min(start.left, end.left),
                  Math.min(start.top, end.top),
                  Math.abs(end.left - start.left),
                  Math.abs(end.bottom - start.top)
                )
              },
              content: renderer.element,
              showOnCreate: true,
              interactive: true,
              trigger: 'manual',
              placement: 'bottom',
              theme: 'light',
              arrow: true,
              maxWidth: 'none',
              onCreate: (instance) => {
                instance.popper.style.width = '400px';
              },
              onHide: () => {
                renderer.destroy()
              },
              onDestroy: () => {
                cleanup()
              }
            })

            // 处理链接确认事件
            const handleConfirm = (event: CustomEvent) => {
              const { text, attributes, remove } = event.detail
              
              // 如果需要删除链接
              if (remove) {
                editor.chain().focus().unsetLink().run()
                tippyInstance.hide()
                tippyInstance.destroy()
                return
              }
              
              // 确保 URL 格式正确
              let urlValue = attributes.href;
              if (!/^https?:\/\//i.test(urlValue) && !/^mailto:/i.test(urlValue)) {
                urlValue = 'http://' + urlValue;
              }
              
              // 更新链接属性
              const updatedAttributes = {
                ...attributes,
                href: urlValue
              };
              
              // 获取当前选区
              const { from, to } = editor.state.selection;
              
              if (isInLink) {
                // 编辑现有链接
                if (text && text !== selectedText) {
                  // 文本内容有变化，需要替换
                  // 使用 insertContentAt 替换带有链接的文本
                  editor
                    .chain()
                    .focus()
                    .insertContentAt(editor.state.selection, {
                      type: 'text',
                      text,
                      marks: [{ type: 'link', attrs: updatedAttributes }]
                    })
                    .run()
                } else {
                  // 只更新链接属性
                  editor.chain().focus().setLink(updatedAttributes).run()
                }
              } else {
                // 添加新链接
                if (selectedText) {
                  // 有选中文本，直接设置为链接
                  if (text && text !== selectedText) {
                    // 替换选中内容并设置链接
                    editor
                      .chain()
                      .focus()
                      .insertContentAt(editor.state.selection, {
                        type: 'text',
                        text,
                        marks: [{ type: 'link', attrs: updatedAttributes }]
                      })
                      .run()
                  } else {
                    // 不替换选中内容，只设置链接
                    editor.chain().focus().setLink(updatedAttributes).run()
                  }
                } else if (text) {
                  // 无选中文本但有填写文本，插入并设置链接
                  editor
                    .chain()
                    .focus()
                    .insertContent({
                      type: 'text',
                      text,
                      marks: [{ type: 'link', attrs: updatedAttributes }]
                    })
                    .run()
                } else {
                  // 无选中文本也无填写文本，提示用户
                  console.warn('Cannot create link: no text provided')
                }
              }

              // 关闭弹窗
              tippyInstance.hide()
              tippyInstance.destroy()
            }

            // 处理取消事件
            const handleCancel = () => {
              // 关闭弹窗
              tippyInstance.hide()
              tippyInstance.destroy()
            }

            // 添加文档级事件监听器
            document.addEventListener('confirm', handleConfirm)
            document.addEventListener('cancel', handleCancel)

            // 在 tippy 销毁时清理事件监听器
            const cleanup = () => {
              document.removeEventListener('confirm', handleConfirm)
              document.removeEventListener('cancel', handleCancel)
            }
            return true
          },
    }
  },
}) 