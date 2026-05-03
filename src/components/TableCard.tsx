import { Card, CardContent, CardHeader, CardTitle } from "./ui/Card";

interface TableCardProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}

export const TableCard = ({ title, subtitle, action, children }: TableCardProps) => (
  <Card className="bg-white">
    <CardHeader>
      <div className="flex items-center justify-between gap-2">
        <CardTitle className="flex items-center gap-2">
          {title}
          {subtitle && (
            <span className="text-sm font-normal text-muted-foreground">
              {subtitle}
            </span>
          )}
        </CardTitle>
        {action && <div className="shrink-0">{action}</div>}
      </div>
    </CardHeader>
    <CardContent>
      <div className="overflow-x-auto">{children}</div>
    </CardContent>
  </Card>
);
