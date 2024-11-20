import { Button as OriginalButton, ButtonProps } from '@/components/ui/button';
import { ReactNode } from 'react';

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib';

interface Props extends ButtonProps {
  tooltip: ReactNode;
}

export function Button({ children, tooltip, className, ...props }: Props) {
  return (
    <TooltipProvider>
      <Tooltip delayDuration={70}>
        <TooltipTrigger asChild>
          <OriginalButton className={cn('h-auto p-2', className)} {...props}>
            {children}
          </OriginalButton>
        </TooltipTrigger>
        <TooltipContent>{tooltip}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
