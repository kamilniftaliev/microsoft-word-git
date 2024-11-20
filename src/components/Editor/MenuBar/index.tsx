import { useContext } from 'react';
import { Editor } from '@tiptap/react';
import { Level } from '@tiptap/extension-heading';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  FaCodeBranch,
  FaAlignCenter,
  FaAlignJustify,
  FaAlignLeft,
  FaAlignRight,
  FaBold,
  FaCode,
  FaHighlighter,
  FaItalic,
  FaListOl,
  FaListUl,
  FaStrikethrough,
  FaUnderline,
  FaYoutube,
} from 'react-icons/fa6';
import { GrBlockQuote } from 'react-icons/gr';
import { MdInsertPhoto, MdOutlineViewTimeline } from 'react-icons/md';

import { FONTS, SELECT_TRIGGER_CLASSES, cn } from '@/lib';
import { Button } from './Button';
import { EditorContext } from '../context';

interface Props {
  editor: Editor;
  showTimelines: () => void;
  createBranch: () => void;
}

export function MenuBar({ editor, showTimelines, createBranch }: Props) {
  const { commits } = useContext(EditorContext);
  const noChangesMade = commits.length === 0;

  const addImage = () => {
    const url = prompt('Image URL');

    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  const addYoutubeVideo = () => {
    const url = prompt('Enter YouTube URL');

    if (url) {
      editor.commands.setYoutubeVideo({
        src: url,
        width: 640,
        height: 480,
      });
    }
  };

  return (
    <div
      className={cn(
        'flex flex-wrap items-center gap-1 p-1 px-3 border-t border-b border-slate-200 bg-slate-50',
        {
          'pointer-events-none opacity-20': !editor.isEditable,
        },
      )}
    >
      <Select
        onValueChange={(value) => {
          editor
            .chain()
            .focus()
            .toggleHeading({ level: +value as Level })
            .run();

          setTimeout(editor.commands.focus, 0);
        }}
      >
        <SelectTrigger className={SELECT_TRIGGER_CLASSES}>
          <SelectValue placeholder="Default Style" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="1" className="text-2xl">
            Heading 1
          </SelectItem>
          <SelectItem value="2" className="text-xl">
            Heading 2
          </SelectItem>
          <SelectItem value="3" className="text-lg">
            Heading 3
          </SelectItem>
          <SelectItem value="4" className="text-md">
            Heading 4
          </SelectItem>
          <SelectItem value="5" className="text-sm">
            Heading 5
          </SelectItem>
          <SelectItem value="6" className="text-xs">
            Heading 6
          </SelectItem>
        </SelectContent>
      </Select>
      <Select
        onValueChange={(font) => {
          editor.chain().focus().setFontFamily(font).run();
          setTimeout(editor.commands.focus, 0);
        }}
      >
        <SelectTrigger className={SELECT_TRIGGER_CLASSES}>
          <SelectValue placeholder="Font Family" />
        </SelectTrigger>
        <SelectContent>
          {FONTS.map((font) => (
            <SelectItem key={font} value={font}>
              {font}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button
        onClick={() => editor.chain().focus().toggleBold().run()}
        variant={editor.isActive('bold') ? 'default' : 'ghost'}
        tooltip="Bold"
      >
        <FaBold />
      </Button>
      <Button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        variant={editor.isActive('italic') ? 'default' : 'ghost'}
        tooltip="Italic"
      >
        <FaItalic />
      </Button>
      <Button
        onClick={() => editor.chain().focus().toggleStrike().run()}
        variant={editor.isActive('strike') ? 'default' : 'ghost'}
        tooltip="Strikethrough"
      >
        <FaStrikethrough />
      </Button>
      <Button
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        variant={editor.isActive('underline') ? 'default' : 'ghost'}
        tooltip="Underline"
      >
        <FaUnderline />
      </Button>
      <Button
        onClick={() => editor.chain().focus().toggleHighlight().run()}
        variant={editor.isActive('highlight') ? 'default' : 'ghost'}
        tooltip="Highlight"
      >
        <FaHighlighter />
      </Button>
      <Button
        onClick={() => editor.chain().focus().setTextAlign('left').run()}
        variant={editor.isActive({ textAlign: 'left' }) ? 'default' : 'ghost'}
        tooltip="Align Left"
      >
        <FaAlignLeft />
      </Button>
      <Button
        onClick={() => editor.chain().focus().setTextAlign('center').run()}
        variant={editor.isActive({ textAlign: 'center' }) ? 'default' : 'ghost'}
        tooltip="Align Center"
      >
        <FaAlignCenter />
      </Button>
      <Button
        onClick={() => editor.chain().focus().setTextAlign('right').run()}
        variant={editor.isActive({ textAlign: 'right' }) ? 'default' : 'ghost'}
        tooltip="Align Right"
      >
        <FaAlignRight />
      </Button>
      <Button
        onClick={() => editor.chain().focus().setTextAlign('justify').run()}
        variant={
          editor.isActive({ textAlign: 'justify' }) ? 'default' : 'ghost'
        }
        tooltip="Justify"
      >
        <FaAlignJustify />
      </Button>
      <Button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        variant={editor.isActive('bulletList') ? 'default' : 'ghost'}
        tooltip="Toggle Unordered List"
      >
        <FaListUl />
      </Button>
      <Button
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        variant={editor.isActive('orderedList') ? 'default' : 'ghost'}
        tooltip="Toggle Ordered List"
      >
        <FaListOl />
      </Button>
      <Button
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        variant={editor.isActive('blockquote') ? 'default' : 'ghost'}
        tooltip="Blockquote"
      >
        <GrBlockQuote />
      </Button>
      <Button
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        variant={editor.isActive('codeBlock') ? 'default' : 'ghost'}
        tooltip="Format code block"
      >
        <FaCode />
      </Button>
      <Button onClick={addImage} variant="ghost" tooltip="Add an image">
        <MdInsertPhoto />
      </Button>
      <Button
        onClick={addYoutubeVideo}
        variant="ghost"
        tooltip="Embed YouTube Video"
      >
        <FaYoutube />
      </Button>
      <Button
        className="border-2 border-black rounded-md"
        onClick={createBranch}
        variant="ghost"
        tooltip="Create new branch"
        disabled={noChangesMade}
      >
        <FaCodeBranch />
      </Button>
      <Button
        className="border-2 border-black rounded-md"
        onClick={showTimelines}
        variant="ghost"
        tooltip="Show Timelines"
        disabled={noChangesMade}
      >
        <MdOutlineViewTimeline />
      </Button>
      <span className="ml-auto text-sm text-slate-700 text-nowrap">{`${editor.storage.characterCount.words()} words`}</span>
    </div>
  );
}
