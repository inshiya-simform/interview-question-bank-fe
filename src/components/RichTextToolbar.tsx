import type { Editor } from '@tiptap/react';
import { RICH_TEXT_COPY } from '@/constants';
import { useRichTextToolbar } from './useRichTextToolbar';

interface RichTextToolbarProps {
  editor: Editor;
  onPickImage: () => void;
}

export function RichTextToolbar({ editor, onPickImage }: RichTextToolbarProps) {
  const groups = useRichTextToolbar(editor, onPickImage);

  return (
    <div className="rte__toolbar" role="toolbar" aria-label={RICH_TEXT_COPY.TOOLBAR_LABEL}>
      {groups.map((group) => (
        <div key={group[0].key} className="rte__group">
          {group.map(({ key, label, text, isActive, isDisabled, run }) => (
            <button
              key={key}
              type="button"
              className="rte__button"
              aria-label={label}
              title={label}
              aria-pressed={isActive === undefined ? undefined : isActive}
              disabled={isDisabled}
              // Keep the editor selection when a toolbar button is pressed.
              onMouseDown={(event) => event.preventDefault()}
              onClick={run}
            >
              {text}
            </button>
          ))}
        </div>
      ))}
    </div>
  );
}
