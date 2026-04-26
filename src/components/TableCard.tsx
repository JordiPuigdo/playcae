import { Card, CardContent, CardHeader, CardTitle } from "./ui/Card";

interface TableCardProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}

export const TableCard = ({ title, subtitle, children }: TableCardProps) => (
  <Card className="bg-white">
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        {title}
        {subtitle && (
          <span className="text-sm font-normal text-muted-foreground">
            {subtitle}
          </span>
        )}
      </CardTitle>
    </CardHeader>
    <CardContent>
      <div className="overflow-x-auto">{children}</div>
    </CardContent>
  </Card>
);
