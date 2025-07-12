import { Company } from '@/types/company';
import { Badge } from './ui/Badge';

interface StatusBadgeProps {
  status: Company['status'];
}

export const StatusBadge = ({ status }: StatusBadgeProps) => {
  const getStatusConfig = (status: Company['status']) => {
    switch (status) {
      case 'Apta':
        return {
          variant: 'default' as const,
          className: 'bg-success text-white hover:bg-success/80',
          text: 'Apta',
        };
      case 'No apta':
        return {
          variant: 'destructive' as const,
          className: 'bg-red-600 text-white hover:bg-red-700',
          text: 'No apta',
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
