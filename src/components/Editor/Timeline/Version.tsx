import { Badge, BadgeProps } from '@/components/ui/badge';
import { cn } from '@/lib';
import moment from 'moment';
import { useContext } from 'react';
import { EditorContext } from '../context';

export function Version({ className }: BadgeProps) {
  const { activeCommit } = useContext(EditorContext);

  if (!activeCommit) return null;

  return (
    <Badge
      className={cn('flex gap-1.5 p-2 text-nowrap', className)}
      variant="outline"
    >
      <span>V {activeCommit.version}</span>-
      <span className="font-medium">{moment(activeCommit.time).fromNow()}</span>
    </Badge>
  );
}
