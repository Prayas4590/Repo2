import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

type FabReportButtonProps = {
  onClick?: () => void;
  title?: string;
};

export default function FabReportButton({ onClick, title }: FabReportButtonProps) {
  return (
    <Button className="fab bg-primary text-primary-foreground hover:bg-primary/90" onClick={onClick} title={title}>
      <Plus className="h-6 w-6" />
    </Button>
  );
}
