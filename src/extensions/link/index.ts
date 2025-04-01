import { mergeAttributes } from '@tiptap/core'
import Link from '@tiptap/extension-link'
import { VueRenderer } from '@tiptap/vue-3'
import LinkDialog from './LinkDialog.vue'

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

          // Create dialog container
          const container = document.createElement('div')
          container.style.position = 'fixed'
          container.style.zIndex = '1000'
          document.body.appendChild(container)

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

          // Mount dialog
          container.appendChild(renderer.element)

          // Handle dialog close
          const handleClose = () => {
            renderer.destroy()
          }

          // Add close event listener
          renderer.element.addEventListener('close', handleClose)

          return true
        },
    }
  },
}) 