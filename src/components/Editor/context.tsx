import { Branch, BranchWithCommits, Commit } from '@/lib';
import { createContext } from 'react';

export const EditorContext = createContext<{
  commits: Commit[];
  activeCommitId?: Commit['id'];
  activeBranchId?: Branch['id'];
  switchToCommit: (commit: Commit) => void;
  activeCommit?: Commit;
  activeCommitIndex?: number;
  commitsByBranch: BranchWithCommits[];
}>({
  commits: [],
  commitsByBranch: [],
  switchToCommit: () => null,
});
