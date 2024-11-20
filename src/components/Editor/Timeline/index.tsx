import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { CgClose } from 'react-icons/cg';
import { Branching } from './Branching';
import { Linear } from './Linear';

interface Props {
  onClose: () => void;
}

export function Timeline({ onClose }: Props) {
  return (
    <Tabs
      defaultValue="branching"
      className="px-6 py-4 transition-all bg-white shadow-2xl animate-up h-96 shrink-0"
    >
      <div className="flex justify-between">
        <TabsList className="mx-auto">
          <TabsTrigger value="linear">Linear Timeline View</TabsTrigger>
          <TabsTrigger value="branching">Branching Timeline View</TabsTrigger>
        </TabsList>
        <Button
          className="flex items-center gap-1 px-2 py-1"
          variant="outline"
          onClick={onClose}
        >
          <CgClose />
          <span>Close</span>
        </Button>
      </div>
      <TabsContent value="linear">
        <Linear />
      </TabsContent>
      <TabsContent value="branching">
        <Branching />
      </TabsContent>
    </Tabs>
  );
}
