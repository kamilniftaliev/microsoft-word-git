import { JSONContent } from '@tiptap/react';

export type Commit = {
  id: string;
  // Store reference to the previous commit
  previousCommitId?: string;
  content: JSONContent;
  time: number;
  version: number;
};

export type Branch = {
  id: string;
  initialCommitId: string;
  lastCommitId: string;
  color: string;
};

export type BranchWithCommits = Branch & {
  branchCommits: Commit[];
  leftPosition: number;
  parentBranchId?: Branch['id'];
};

export type State = {
  commits: Commit[];
  branches: Branch[];
  activeBranchId?: Branch['id'];
  activeCommitId?: Commit['id'];
};

export type TimeMethods =
  | 'years'
  | 'months'
  | 'days'
  | 'hours'
  | 'minutes'
  | 'seconds';
