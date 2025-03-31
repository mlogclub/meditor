import { mergeAttributes } from '@tiptap/core'
import { VueNodeViewRenderer } from '@tiptap/vue-3'
import TiptapImage from '@tiptap/extension-image'
import ImageView from './ImageView.vue'

export interface SetImageAttrsOptions {
  src?: string
  /** The alternative text for the image. */
  alt?: string
  /** The title of the image. */
  title?: string
  /** The width of the image. */
  width?: number | string | null
  /** image FlipX */
  flipX?: boolean
  /** image FlipY */
  flipY?: boolean
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    imageResize: {
      /**
       * Add an image
       */
      setImage: (options: Partial<SetImageAttrsOptions>) => ReturnType
      /**
       * Update an image
       */
      updateImage: (options: Partial<SetImageAttrsOptions>) => ReturnType
    }
  }
}

export const Image = TiptapImage.extend({
  group: 'block',
  defining: true,
  isolating: true,
  addAttributes() {
    return {
      ...this.parent?.(),
      flipX: {
        default: false,
      },
      flipY: {
        default: false,
      },
      originWidth: {
        default: null,
      },
      originHeight: {
        default: null,
      },
      width: {
        default: '100%',
        parseHTML: element => {
          const width = element.style.width || element.getAttribute('width') || null
          if (width && width.endsWith('%')) {
            return width
          }
          return width == null ? null : parseInt(width, 10)
        },
        renderHTML: attributes => {
          return {
            width: attributes.width,
          }
        },
      },
    }
  },

  addOptions() {
    return {
      ...this.parent?.(),
    }
  },

  addNodeView() {
    return VueNodeViewRenderer(ImageView)
  },

  addCommands() {
    return {
      ...this.parent?.(),
      updateImage:
        options =>
        ({ commands, editor }) => {
          return commands.updateAttributes(this.name, options)
        },
    }
  },

  renderHTML({ node, HTMLAttributes }) {
    const { textAlign, flipX, flipY } = node.attrs
    const textAlignStyle =
      {
        left: 'margin-right: auto;',
        right: 'margin-left: auto;',
        center: 'margin-left: auto; margin-right: auto;',
      }[textAlign] || ''
    const transformStyle =
      flipX || flipY ? `transform: rotateX(${flipX ? '180' : '0'}deg) rotateY(${flipY ? '180' : '0'}deg);` : ''
    const style = `${textAlignStyle} ${transformStyle}`
    return [
      'img',
      mergeAttributes(
        {
          height: 'auto',
          style,
        },
        this.options.HTMLAttributes,
        HTMLAttributes
      ),
    ]
  },

  parseHTML() {
    return [
      {
        tag: 'img[src]',
      },
    ]
  },
})

export default Image 