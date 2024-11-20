import { Line, LineChart } from 'recharts';
import { CHART_GAPS } from '@/lib';
import { ChartConfig, ChartContainer } from '@/components/ui/chart';
import { useContext, useMemo } from 'react';
import { EditorContext } from '../context';
import { MdOutlineSkipNext, MdOutlineSkipPrevious } from 'react-icons/md';
import { Button } from '@/components/ui/button';
import { Version } from './Version';

export function Branching() {
  const {
    commits,
    switchToCommit,
    activeBranchId,
    commitsByBranch,
    activeCommit,
  } = useContext(EditorContext);

  // Calculate maximum length of commits when it's splitted to branches
  // to make sure we have the exact length for the chart component below
  const totalCommitsCount = commitsByBranch.length
    ? Math.max(
        ...commitsByBranch.map(
          (branch) => branch.leftPosition + branch.branchCommits.length,
        ),
      )
    : 0;

  const chartConfig = useMemo(
    () =>
      commitsByBranch.reduce(
        (acc, { id, color }) => ({
          ...acc,
          [id]: {
            label: id,
            color,
          },
        }),
        {},
      ) satisfies ChartConfig,
    [commitsByBranch],
  );

  // Create chart data from total amount of commits
  const data = Array(totalCommitsCount)
    .fill(null)
    .map((_, commitIndex) =>
      commitsByBranch
        // Include only those branches that have commits at given position
        .filter(
          (branch) =>
            commitIndex >= branch.leftPosition &&
            commitIndex < branch.leftPosition + branch.branchCommits.length,
        )
        // Find where exactly each brand is started and map
        // it to a chart positioning number
        .map((branch) => {
          const parentBranch = commitsByBranch.find(
            ({ id }) => id === branch.parentBranchId,
          );

          const isFirstCommit = branch.leftPosition === commitIndex;
          const targetBranch =
            isFirstCommit && parentBranch ? parentBranch : branch;
          const branchChartPosition =
            commitsByBranch.length -
            Math.max(commitsByBranch.indexOf(targetBranch), 0);

          return {
            [branch.id]: branchChartPosition,
          };
        })
        // Collect them together for the chart component to render it
        .reduce(
          (acc, relatedBranch) => ({
            ...acc,
            ...relatedBranch,
          }),
          {},
        ),
    );

  const activeBranch = commitsByBranch.find(({ id }) => id === activeBranchId);

  const previousCommitOnBranch = commits.find(
    ({ id }) => id === activeCommit?.previousCommitId,
  );
  const activeBranchCommitIndex =
    activeCommit && activeBranch
      ? activeBranch.branchCommits.indexOf(activeCommit)
      : -1;
  const nextCommitOnBranch =
    typeof activeBranchCommitIndex === 'number'
      ? activeBranch?.branchCommits[activeBranchCommitIndex + 1]
      : undefined;

  return (
    <>
      <div className="flex items-center gap-2">
        <Button
          size="icon"
          className="shrink-0"
          onClick={() => {
            if (!previousCommitOnBranch) return;

            switchToCommit(previousCommitOnBranch);
          }}
          variant="outline"
          disabled={!previousCommitOnBranch}
        >
          <MdOutlineSkipPrevious size={32} />
        </Button>
        <Button
          size="icon"
          className="shrink-0"
          onClick={() => {
            if (!nextCommitOnBranch) return;

            switchToCommit(nextCommitOnBranch);
          }}
          variant="outline"
          disabled={!nextCommitOnBranch}
        >
          <MdOutlineSkipNext />
        </Button>
        <Version className="ml-auto" />
      </div>
      <div className="flex flex-col min-w-full gap-5 px-4 py-2 overflow-x-auto grow">
        <ChartContainer
          className="h-60"
          style={{ width: totalCommitsCount * 25 }}
          config={chartConfig}
        >
          <LineChart data={data} margin={CHART_GAPS}>
            {commitsByBranch.map(({ id, color }) => (
              <Line
                key={id}
                type="linear"
                dataKey={id}
                stroke={color}
                fill={color}
                connectNulls
                strokeWidth={8}
                isAnimationActive
                dot={{
                  r: 5,
                  style: {
                    cursor: 'pointer',
                  },
                  onClick({ value: branchIndex, index: commitIndex }: any) {
                    const branch =
                      commitsByBranch[commitsByBranch.length - branchIndex];

                    const branchCommit =
                      branch.branchCommits[commitIndex - branch.leftPosition];

                    if (!branchCommit) return;

                    switchToCommit(branchCommit);
                  },
                }}
              />
            ))}
          </LineChart>
        </ChartContainer>
      </div>
    </>
  );
}
