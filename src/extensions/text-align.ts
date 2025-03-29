import { TextAlign as TiptapTextAlign } from '@tiptap/extension-text-align';

export const TextAlign = TiptapTextAlign.configure({
  types: ['heading', 'paragraph'],
  alignments: ['left', 'center', 'right'],
  defaultAlignment: 'left',
}); 