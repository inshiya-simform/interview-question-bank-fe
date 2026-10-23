import Image from '@tiptap/extension-image';
import Placeholder from '@tiptap/extension-placeholder';
import StarterKit from '@tiptap/starter-kit';
import { HEADING_LEVELS, LINK_REL, LINK_TARGET } from '@/constants';

// StarterKit's node/mark set matches the API allow-list; link and underline are bundled in it.
export function buildRichTextExtensions(placeholder: string) {
  return [
    StarterKit.configure({
      heading: { levels: [...HEADING_LEVELS] },
      link: {
        openOnClick: false,
        autolink: false,
        protocols: ['mailto'],
        HTMLAttributes: { rel: LINK_REL, target: LINK_TARGET },
      },
    }),
    // Base64 images are dropped by the API, so they are never created in the editor.
    Image.configure({ allowBase64: false }),
    Placeholder.configure({ placeholder }),
  ];
}
