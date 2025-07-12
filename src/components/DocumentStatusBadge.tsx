import { Document } from '@/types/document';
import { Badge } from './ui/Badge';

interface DocumentStatusBadgeProps {
  status: Document['status'];
}

export const DocumentStatusBadge = ({ status }: DocumentStatusBadgeProps) => {
  const getStatusConfig = (status: Document['status']) => {
    switch (status) {
      case 'Validado':
        return {
          variant: 'default' as const,
          className: 'bg-success text-white hover:bg-success/80',
          text: 'Validado',
        };
      case 'Rechazado':
        return {
          variant: 'destructive' as const,
          className: '',
          text: 'Rechazado',
        };
      case 'Pendiente':
      default:
        return {
          variant: 'secondary' as const,
          className: 'bg-pending text-white hover:bg-pending/80',
          text: 'Pendiente',
        };
    }
  };

  const config = getStatusConfig(status);

  return (
    <Badge variant={config.variant} className={config.className}>
      {config.text}
    </Badge>
  );
};
