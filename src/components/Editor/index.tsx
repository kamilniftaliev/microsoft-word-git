import { useEffect, useMemo, useState } from 'react';
import { EditorContent, useEditor, Editor as EditorType } from '@tiptap/react';

import { MenuBar } from './MenuBar';
import { Timeline } from './Timeline';
import {
  Branch,
  Commit,
  getCommitsByBranch,
  getInitialState,
  getRandomColor,
  initialEditorProps,
  State,
} from '@/lib';
import { EditorContext } from './context';

export function Editor() {
  const [state, setState] = useState(getInitialState());
  const { commits, branches, activeBranchId, activeCommitId } = state;
  const [isTimelineVisible, setTimelineVisible] = useState(false);

  const createCommit = (
    editor: EditorType,
    props?: Partial<Commit>,
  ): Commit => ({
    id: crypto.randomUUID(),
    content: editor.getJSON(),
    time: Date.now(),
    // Storing version number intentionally so that
    // it doesn't change when a commit is removed.
    // Reason for "+ 1" is that otherwise
    // first version becomes "V0"
    version: commits.length + 1,
    previousCommitId: activeCommitId,
    ...props,
  });

  // We probably won't need it with React 19 Compiler
  const { commitsByBranch, activeCommit, activeCommitIndex } = useMemo(() => {
    const activeCommitIndex = commits.findIndex(
      (commit) => commit.id === activeCommitId,
    );

    return {
      commitsByBranch: getCommitsByBranch(branches, commits),
      activeCommitIndex,
      activeCommit: commits[activeCommitIndex],
    };
  }, [commits, branches, activeCommitId]);

  const editor = useEditor({
    ...initialEditorProps,
    // Restoring last change
    content: commits.at(-1)?.content || '',
    onUpdate({ editor }) {
      const activeBranchWithCommits = commitsByBranch.find(
        ({ id }) => id === activeBranchId,
      );
      const lastCommitOnActiveBranch =
        activeBranchWithCommits?.branchCommits.at(-1);

      const newCommit = createCommit(editor, {
        previousCommitId: lastCommitOnActiveBranch?.id,
      });
      const newState: Partial<State> = {
        // Update HEAD as Git does
        activeCommitId: newCommit.id,
        commits: commits.concat(newCommit),
      };

      if (activeBranchId) {
        // Update the last commit id in current branch
        newState.branches = branches.map((branch) =>
          branch.id === activeBranchId
            ? { ...branch, lastCommitId: newCommit.id }
            : branch,
        );
      } else {
        // If it's the first change ever,
        // create the initial branch for it
        newState.branches = [
          {
            id: crypto.randomUUID(),
            initialCommitId: newCommit.id,
            lastCommitId: newCommit.id,
            color: getRandomColor(),
          },
        ];
        newState.activeBranchId = newState.branches[0].id;
      }

      setState((prevState) => ({ ...prevState, ...newState }));
    },
  });

  useEffect(() => {
    // Don't save state literally on each change.
    // It's hurts performance if you type quickly.
    const timeout = setTimeout(() => {
      localStorage.setItem('state', JSON.stringify(state));
    }, 1000);

    return () => {
      clearTimeout(timeout);
    };
  }, [state]);

  if (!editor) return null;

  const showTimelines = () => {
    setTimelineVisible(true);
    editor.setEditable(false);
  };

  const closeTimelines = () => {
    setTimelineVisible(false);
    editor.setEditable(true);
    editor.commands.focus();
  };

  const createBranch = () => {
    const newCommit = createCommit(editor);

    const newBranch: Branch = {
      id: crypto.randomUUID(),
      initialCommitId: newCommit.id,
      lastCommitId: newCommit.id,
      color: getRandomColor(),
    };

    setState((state) => ({
      ...state,
      branches: branches.concat(newBranch),
      commits: commits.concat(newCommit),
      activeBranchId: newBranch.id,
      activeCommitId: newCommit.id,
    }));

    editor.commands.focus();
  };

  const switchToCommit = (commit: Commit) => {
    const newState: Partial<State> = {
      activeCommitId: commit.id,
    };

    const relatedBranch = commitsByBranch.find(({ branchCommits }) =>
      branchCommits.some((branchCommit) => branchCommit.id === commit.id),
    );

    if (relatedBranch && relatedBranch.id !== activeBranchId) {
      newState.activeBranchId = relatedBranch.id;
    }

    editor.commands.setContent(commit.content, false);
    setState((prevState) => ({ ...prevState, ...newState }));
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <EditorContext.Provider
        value={{
          commits,
          switchToCommit,
          commitsByBranch,
          activeCommit,
          activeCommitIndex,
          activeBranchId: activeBranchId,
        }}
      >
        <MenuBar
          editor={editor}
          showTimelines={showTimelines}
          createBranch={createBranch}
        />
        <EditorContent
          className="flex overflow-auto shadow-inner bg-slate-200 grow"
          editor={editor}
        />
        {isTimelineVisible && <Timeline onClose={closeTimelines} />}
      </EditorContext.Provider>
    </div>
  );
}
