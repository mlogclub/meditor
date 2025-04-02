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
            // Get current link attributes if exists
            let linkMark = editor.isActive('link')
            let linkAttributes = editor.getAttributes('link')
            let currentUrl = linkAttributes.href || ''
            let currentOpenInNewTab = linkAttributes.target === '_blank'
            
            let selectedText = ''
            
            // Get the selected text or entire link text
            const { from, to } = editor.state.selection
            
            if (linkMark) {
              // 如果光标在链接内，获取整个链接文本
              const resolvedPos = editor.state.doc.resolve(from)
              const marks = resolvedPos.marks()
              const linkMarkObj = marks.find(mark => mark.type.name === 'link')
              
              if (linkMarkObj) {
                // 查找链接的开始和结束位置
                let linkStart = from
                let linkEnd = to
                
                // 向前查找链接的开始
                for (let i = from; i > 0; i--) {
                  const pos = editor.state.doc.resolve(i)
                  const marks = pos.marks()
                  const hasLinkMark = marks.some(mark => mark.type.name === 'link' && mark.attrs.href === linkAttributes.href)
                  
                  if (!hasLinkMark) {
                    linkStart = i + 1
                    break
                  }
                  
                  if (i === 1) {
                    linkStart = 1
                  }
                }
                
                // 向后查找链接的结束
                const docSize = editor.state.doc.content.size
                for (let i = to; i <= docSize; i++) {
                  if (i === docSize) {
                    linkEnd = i
                    break
                  }
                  
                  const pos = editor.state.doc.resolve(i)
                  const marks = pos.marks()
                  const hasLinkMark = marks.some(mark => mark.type.name === 'link' && mark.attrs.href === linkAttributes.href)
                  
                  if (!hasLinkMark) {
                    linkEnd = i
                    break
                  }
                }
                
                // 获取整个链接文本
                selectedText = editor.state.doc.textBetween(linkStart, linkEnd)
                
                // 选中整个链接文本
                editor.chain().setTextSelection({ from: linkStart, to: linkEnd }).run()
              }
            } else {
              // 检查光标是否在链接内（即使没有选中）
              const resolvedPos = editor.state.doc.resolve(from)
              const marks = resolvedPos.marks()
              const linkMarkObj = marks.find(mark => mark.type.name === 'link')
              
              if (linkMarkObj) {
                // 光标在链接内但没有选中，查找整个链接
                let linkStart = from
                let linkEnd = from
                
                // 向前查找链接的开始
                for (let i = from; i > 0; i--) {
                  const pos = editor.state.doc.resolve(i)
                  const marks = pos.marks()
                  const hasLinkMark = marks.some(mark => mark.type.name === 'link' && mark.attrs.href === linkMarkObj.attrs.href)
                  
                  if (!hasLinkMark) {
                    linkStart = i + 1
                    break
                  }
                  
                  if (i === 1) {
                    linkStart = 1
                  }
                }
                
                // 向后查找链接的结束
                const docSize = editor.state.doc.content.size
                for (let i = from; i <= docSize; i++) {
                  if (i === docSize) {
                    linkEnd = i
                    break
                  }
                  
                  const pos = editor.state.doc.resolve(i)
                  const marks = pos.marks()
                  const hasLinkMark = marks.some(mark => mark.type.name === 'link' && mark.attrs.href === linkMarkObj.attrs.href)
                  
                  if (!hasLinkMark) {
                    linkEnd = i
                    break
                  }
                }
                
                // 获取整个链接文本
                selectedText = editor.state.doc.textBetween(linkStart, linkEnd)
                
                // 选中整个链接文本
                editor.chain().setTextSelection({ from: linkStart, to: linkEnd }).run()
                
                // 更新链接状态
                linkMark = true
                linkAttributes = linkMarkObj.attrs
                currentUrl = linkAttributes.href || ''
                currentOpenInNewTab = linkAttributes.target === '_blank'
              }
            }
            
            // 如果没有获取到链接文本，使用普通的选中文本
            if (!selectedText) {
              selectedText = editor.state.doc.textBetween(from, to)
            }

            // Create Vue renderer
            const renderer = new VueRenderer(LinkDialog, {
              props: {
                editor,
                initialText: selectedText,
                initialUrl: currentUrl,
                initialOpenInNewTab: currentOpenInNewTab,
                isEditingExistingLink: linkMark,
              },
              editor,
            })

            // Create tippy instance
            const tippyInstance = tippy(document.body, {
              getReferenceClientRect: () => {
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
              
              // 确保URL格式正确
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
              
              if (linkMark) {
                // 编辑现有链接
                if (text && text !== selectedText) {
                  // 文本内容有变化，需要替换
                  editor
                    .chain()
                    .focus()
                    .deleteRange(editor.state.selection)
                    .insertContent({ type: 'text', text })
                    .setLink(updatedAttributes)
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
                      .deleteRange(editor.state.selection)
                      .insertContent({ type: 'text', text })
                      .setLink(updatedAttributes)
                      .run()
                  } else {
                    // 不替换选中内容，只设置链接
                    editor.chain().focus().setLink(updatedAttributes).run()
                  }
                } else if (text) {
                  // 无选中文本但有填写文本，插入并设置链接
                  // 先插入文本，然后选中插入的文本，最后设置链接
                  const insertPos = editor.state.selection.from;
                  editor
                    .chain()
                    .focus()
                    .insertContent({ type: 'text', text })
                    .run();
                  
                  // 选中刚刚插入的文本
                  editor
                    .chain()
                    .focus()
                    .setTextSelection({ from: insertPos, to: insertPos + text.length })
                    .setLink(updatedAttributes)
                    .run();
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

            // 在tippy销毁时清理事件监听器
            const cleanup = () => {
              document.removeEventListener('confirm', handleConfirm)
              document.removeEventListener('cancel', handleCancel)
            }
            return true
          },
    }
  },
}) 