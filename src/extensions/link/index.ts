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
          // Get the selected text
          const { from, to } = editor.state.selection
          const selectedText = editor.state.doc.textBetween(from, to)

          // Get current link attributes if exists
          const linkAttributes = editor.getAttributes('link')
          const currentUrl = linkAttributes.href || ''
          const currentOpenInNewTab = linkAttributes.target === '_blank'

          // Create Vue renderer
          const renderer = new VueRenderer(LinkDialog, {
            props: {
              editor,
              initialText: selectedText,
              initialUrl: currentUrl,
              initialOpenInNewTab: currentOpenInNewTab,
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
            onHide: () => {
              renderer.destroy()
            },
          })

          // Handle dialog close
          renderer.element.addEventListener('close', () => {
            tippyInstance.destroy()
          })

          return true
        },
    }
  },
}) 