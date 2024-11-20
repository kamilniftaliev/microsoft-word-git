import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { MdOutlineSkipNext, MdOutlineSkipPrevious } from 'react-icons/md';
import { Version } from './Version';
import { useContext } from 'react';
import { EditorContext } from '../context';

export function Linear() {
  const { commits, switchToCommit, activeCommitIndex } =
    useContext(EditorContext);
  const lastCommitIndex = commits.length - 1;

  if (typeof activeCommitIndex !== 'number') return null;

  return (
    <div className="flex items-center w-full gap-3 mt-20">
      <Button
        size="icon"
        className="shrink-0"
        onClick={() => switchToCommit(commits[activeCommitIndex - 1])}
        variant="outline"
        disabled={activeCommitIndex === 0}
      >
        <MdOutlineSkipPrevious size={32} />
      </Button>
      <Button
        size="icon"
        className="shrink-0"
        onClick={() => switchToCommit(commits[activeCommitIndex + 1])}
        variant="outline"
        disabled={activeCommitIndex === lastCommitIndex}
      >
        <MdOutlineSkipNext size={32} />
      </Button>
      <Slider
        value={[activeCommitIndex]}
        onValueChange={([index]: number[]) => switchToCommit(commits[index])}
        max={lastCommitIndex}
        step={1}
      />
      <Version />
    </div>
  );
}
