import type { Editor } from '@tiptap/react';
import { useEditorState } from '@tiptap/react';
import { HEADING_LEVELS, LINK_PROTOCOLS, RICH_TEXT_COPY } from '@/constants';
import { toast } from 'react-toastify';

export interface ToolbarAction {
  key: string;
  label: string;
  text: string;
  isActive?: boolean;
  isDisabled?: boolean;
  run: () => void;
}

const isAllowedLink = (value: string) => {
  try {
    return LINK_PROTOCOLS.some((protocol) => protocol === new URL(value).protocol);
  } catch {
    return false;
  }
};

export function useRichTextToolbar(editor: Editor, openFilePicker: () => void): ToolbarAction[][] {
  // The editor doesn't re-render React on selection changes, so active states are subscribed to.
  const state = useEditorState({
    editor,
    selector: ({ editor: current }) => ({
      bold: current.isActive('bold'),
      italic: current.isActive('italic'),
      underline: current.isActive('underline'),
      strike: current.isActive('strike'),
      headings: HEADING_LEVELS.map((level) => current.isActive('heading', { level })),
      bulletList: current.isActive('bulletList'),
      orderedList: current.isActive('orderedList'),
      blockquote: current.isActive('blockquote'),
      code: current.isActive('code'),
      codeBlock: current.isActive('codeBlock'),
      link: current.isActive('link'),
      canUndo: current.can().undo(),
      canRedo: current.can().redo(),
    }),
  });
  const chain = () => editor.chain().focus();

  const setLink = () => {
    const previous = editor.getAttributes('link').href;
    const url = window.prompt(
      RICH_TEXT_COPY.LINK_PROMPT,
      typeof previous === 'string' ? previous : '',
    );
    if (url === null) return;
    if (url.trim() === '') {
      chain().extendMarkRange('link').unsetLink().run();
      return;
    }
    if (!isAllowedLink(url.trim())) {
      toast.error(RICH_TEXT_COPY.LINK_INVALID);
      return;
    }
    chain().extendMarkRange('link').setLink({ href: url.trim() }).run();
  };

  return [
    [
      {
        key: 'bold',
        label: RICH_TEXT_COPY.BOLD,
        text: 'B',
        isActive: state.bold,
        run: () => chain().toggleBold().run(),
      },
      {
        key: 'italic',
        label: RICH_TEXT_COPY.ITALIC,
        text: 'I',
        isActive: state.italic,
        run: () => chain().toggleItalic().run(),
      },
      {
        key: 'underline',
        label: RICH_TEXT_COPY.UNDERLINE,
        text: 'U',
        isActive: state.underline,
        run: () => chain().toggleUnderline().run(),
      },
      {
        key: 'strike',
        label: RICH_TEXT_COPY.STRIKE,
        text: 'S',
        isActive: state.strike,
        run: () => chain().toggleStrike().run(),
      },
    ],
    HEADING_LEVELS.map((level, index) => ({
      key: `h${level}`,
      label: RICH_TEXT_COPY.HEADING(level),
      text: `H${level}`,
      isActive: state.headings[index],
      run: () => chain().toggleHeading({ level }).run(),
    })),
    [
      {
        key: 'bullet',
        label: RICH_TEXT_COPY.BULLET_LIST,
        text: '•',
        isActive: state.bulletList,
        run: () => chain().toggleBulletList().run(),
      },
      {
        key: 'ordered',
        label: RICH_TEXT_COPY.ORDERED_LIST,
        text: '1.',
        isActive: state.orderedList,
        run: () => chain().toggleOrderedList().run(),
      },
      {
        key: 'quote',
        label: RICH_TEXT_COPY.BLOCKQUOTE,
        text: '“',
        isActive: state.blockquote,
        run: () => chain().toggleBlockquote().run(),
      },
      {
        key: 'code',
        label: RICH_TEXT_COPY.CODE,
        text: '</>',
        isActive: state.code,
        run: () => chain().toggleCode().run(),
      },
      {
        key: 'codeBlock',
        label: RICH_TEXT_COPY.CODE_BLOCK,
        text: '{ }',
        isActive: state.codeBlock,
        run: () => chain().toggleCodeBlock().run(),
      },
    ],
    [
      {
        key: 'link',
        label: state.link ? RICH_TEXT_COPY.UNLINK : RICH_TEXT_COPY.LINK,
        text: 'Link',
        isActive: state.link,
        run: state.link ? () => chain().extendMarkRange('link').unsetLink().run() : setLink,
      },
      { key: 'image', label: RICH_TEXT_COPY.IMAGE, text: 'Img', run: openFilePicker },
      {
        key: 'rule',
        label: RICH_TEXT_COPY.RULE,
        text: '—',
        run: () => chain().setHorizontalRule().run(),
      },
    ],
    [
      {
        key: 'undo',
        label: RICH_TEXT_COPY.UNDO,
        text: '↶',
        isDisabled: !state.canUndo,
        run: () => chain().undo().run(),
      },
      {
        key: 'redo',
        label: RICH_TEXT_COPY.REDO,
        text: '↷',
        isDisabled: !state.canRedo,
        run: () => chain().redo().run(),
      },
    ],
  ];
}
