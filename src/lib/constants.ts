import StarterKit from '@tiptap/starter-kit';
import Color from '@tiptap/extension-color';
import Underline from '@tiptap/extension-underline';
import TextStyle from '@tiptap/extension-text-style';
import TextAlign from '@tiptap/extension-text-align';
import CodeBlock from '@tiptap/extension-code-block';
import Image from '@tiptap/extension-image';
import Youtube from '@tiptap/extension-youtube';
import Highlight from '@tiptap/extension-highlight';
import FontFamily from '@tiptap/extension-font-family';
import CharacterCount from '@tiptap/extension-character-count';
import Placeholder from '@tiptap/extension-placeholder';

export const FONTS = [
  'Arial',
  'Inter',
  'Comic Sans MS, Comic Sans',
  'serif',
  'monospace',
  'cursive',
];

// Storing it here because it's static and
// takes too much space in the Editor component file
export const initialEditorProps = {
  extensions: [
    StarterKit,
    TextAlign.configure({
      types: ['heading', 'paragraph'],
    }),
    TextStyle,
    Color,
    Underline,
    Highlight,
    CodeBlock,
    Image,
    Youtube,
    FontFamily,
    CharacterCount,
    Placeholder.configure({
      placeholder: 'Write something …',
    }),
  ],
  autofocus: true,
  editorProps: {
    attributes: {
      class:
        'max-w-full bg-white prose-full h-fit min-h-full grow prose prose-sm sm:prose-base shadow-lg py-10 px-16 sm:mt-5 sm:mb-8 sm:mx-8 md:mx-20 lg:mx-40 focus:outline-none',
    },
  },
};

export const SELECT_TRIGGER_CLASSES = 'border-0 shadow-none max-w-32';
export const CHART_GAPS = {
  top: 10,
  right: 10,
  left: 10,
  bottom: 10,
};
