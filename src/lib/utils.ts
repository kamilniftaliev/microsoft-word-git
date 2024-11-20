import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Branch, BranchWithCommits, Commit, State } from './types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const random = (min: number, max: number) =>
  Math.floor(min + Math.random() * (max - min));

// Generates random SATURED color for branches to look good.
// Timeline looks bad if branch colors are too dark/bright.
export function getRandomColor() {
  const h = random(1, 360);

  return `hsl(${h}, 100%, 50%)`;
}

// Restores previous state from localStorage.
// If there's nothing to restore, returns empty state
export function getInitialState() {
  let initialState: State = {
    commits: [],
    branches: [],
  };

  try {
    const localState = localStorage.getItem('state');

    if (localState) {
      initialState = JSON.parse(localState);
    }
  } catch (error) {
    console.log('error while parsing local state', error);
  }

  return initialState;
}

// Splits commits into branches so that it becomes
// easier to map through each branch's commits
export function getCommitsByBranch(branches: Branch[], commits: Commit[]) {
  // In order to find out which commit is a child of which one
  // we have to walk through all commits backwards
  const reversedCommits = commits.toReversed();

  return branches.reduce((acc, branch, branchIndex) => {
    // Commits related to this branch
    const branchCommits = reversedCommits
      .reduce((accCommits, commit) => {
        if (
          // If it's the first commit of this branch
          commit.id === branch.initialCommitId ||
          // If it's the last commit of this branch
          commit.id === branch.lastCommitId ||
          accCommits.some(
            (accCommit) =>
              // If it's the commit that comes before
              // the one that we just added to the array
              accCommit.previousCommitId === commit.id &&
              accCommit.id !== branch.initialCommitId,
          )
        ) {
          return accCommits.concat(commit);
        }

        return accCommits;
      }, [] as Commit[])
      // We have to reverse it back to make it normal again
      .toReversed();

    let leftPosition = 0;
    let parentBranchId: undefined | Branch['id'];

    // If it's not the first/main branch
    if (branchIndex > 0) {
      const branchedFromCommitId = branchCommits[0].previousCommitId;
      const parentBranch = acc.find(({ branchCommits }) =>
        branchCommits.some(({ id }) => id === branchedFromCommitId),
      );

      // Assign a left offset to it to make it appear
      // on right position in the timeline
      if (parentBranch) {
        parentBranchId = parentBranch.id;

        const branchedFromCommitIndex = parentBranch.branchCommits.findIndex(
          ({ id }) => id === branchedFromCommitId,
        );

        leftPosition = branchedFromCommitIndex + parentBranch.leftPosition;
      }
    }

    return acc.concat({
      ...branch,
      branchCommits,
      leftPosition,
      parentBranchId,
    });
  }, [] as BranchWithCommits[]);
}
