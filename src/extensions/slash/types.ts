import type { Component } from 'vue'
import type { Editor } from '@tiptap/core'
import {
    Heading1,
    Heading2,
    List,
    ListOrdered,
    Quote,
    Code2,
    Image as ImageIcon,
    MinusSquare,
    Table as TableIcon,
    Link as LinkIcon,
} from 'lucide-vue-next'

export interface CommandItem {
    title: string
    description: string
    icon: Component
    command: ({ editor, range }: { editor: Editor; range: { from: number; to: number } }) => void
}

export const getSuggestionItems = () => [
    {
        title: '标题1',
        description: '大标题',
        icon: Heading1,
        command: ({ editor, range }: { editor: Editor; range: { from: number; to: number } }) => {
            editor.chain().focus().deleteRange(range).setNode('heading', { level: 1 }).run()
        },
    },
    {
        title: '标题2',
        description: '二级标题',
        icon: Heading2,
        command: ({ editor, range }: { editor: Editor; range: { from: number; to: number } }) => {
            editor.chain().focus().deleteRange(range).setNode('heading', { level: 2 }).run()
        },
    },
    {
        title: '无序列表',
        description: '创建无序列表',
        icon: List,
        command: ({ editor, range }: { editor: Editor; range: { from: number; to: number } }) => {
            editor.chain().focus().deleteRange(range).toggleBulletList().run()
        },
    },
    {
        title: '有序列表',
        description: '创建有序列表',
        icon: ListOrdered,
        command: ({ editor, range }: { editor: Editor; range: { from: number; to: number } }) => {
            editor.chain().focus().deleteRange(range).toggleOrderedList().run()
        },
    },
    {
        title: '引用',
        description: '插入引用文本',
        icon: Quote,
        command: ({ editor, range }: { editor: Editor; range: { from: number; to: number } }) => {
            editor.chain().focus().deleteRange(range).toggleBlockquote().run()
        },
    },
    {
        title: '代码块',
        description: '插入代码块',
        icon: Code2,
        command: ({ editor, range }: { editor: Editor; range: { from: number; to: number } }) => {
            editor.chain().focus().deleteRange(range).toggleCodeBlock().run()
        },
    },
    {
        title: '图片',
        description: '插入图片',
        icon: ImageIcon,
        command: ({ editor, range }: { editor: Editor; range: { from: number; to: number } }) => {
            const url = window.prompt('输入图片URL')
            if (url) {
                editor.chain().focus().deleteRange(range).setImage({ src: url }).run()
            }
        },
    },
    {
        title: '链接',
        description: '插入链接',
        icon: LinkIcon,
        command: ({ editor, range }: { editor: Editor; range: { from: number; to: number } }) => {
            editor.chain().focus().deleteRange(range).openLinkDialog().run()
        },
    },
    {
        title: '分割线',
        description: '插入水平分割线',
        icon: MinusSquare,
        command: ({ editor, range }: { editor: Editor; range: { from: number; to: number } }) => {
            editor.chain().focus().deleteRange(range).setHorizontalRule().run()
        },
    },
    {
        title: '表格',
        description: '插入表格',
        icon: TableIcon,
        command: ({ editor, range }: { editor: Editor; range: { from: number; to: number } }) => {
            editor
                .chain()
                .focus()
                .deleteRange(range)
                .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
                .run()
        },
    },
]