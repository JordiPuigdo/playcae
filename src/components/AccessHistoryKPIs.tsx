import {
  CheckCircle2,
  Clock,
  Users,
  AlertCircle,
  Building2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/Card";
import { useTranslation } from "@/hooks/useTranslation";

interface KPIData {
  validDocumentationPercentage: number;
  totalAccessesToday: number;
  hoursWorkedToday: number;
  failedAccesses: number;
  companiesOnSite: number;
  trend: "up" | "down" | "stable";
}

interface AccessHistoryKPIsProps {
  data: KPIData;
}

export const AccessHistoryKPIs = ({ data }: AccessHistoryKPIsProps) => {
  const { t } = useTranslation();

  const kpis = [
    {
      title: t("accessControl.kpis.validDocumentation"),
      value: `${data.validDocumentationPercentage}%`,
      icon: CheckCircle2,
      iconColor: "text-playGreen",
      bgColor: "bg-playGreen/10",
    },
    {
      title: t("accessControl.kpis.accessesToday"),
      value: data.totalAccessesToday.toString(),
      icon: Users,
      iconColor: "text-brand-primary",
      bgColor: "bg-playGrey",
    },
    {
      title: t("accessControl.kpis.hoursWorked"),
      value: `${data.hoursWorkedToday}h`,
      icon: Clock,
      iconColor: "text-playBlueLight",
      bgColor: "bg-playBlueLight/10",
    },
    {
      title: t("accessControl.kpis.failedAccesses"),
      value: data.failedAccesses.toString(),
      icon: AlertCircle,
      iconColor: "text-brand-secondary",
      bgColor: "bg-brand-secondary/10",
    },
    {
      title: t("accessControl.kpis.companiesOnSite"),
      value: data.companiesOnSite.toString(),
      icon: Building2,
      iconColor: "text-playYellow",
      bgColor: "bg-playYellow/10",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
      {kpis.map((kpi, index) => {
        const Icon = kpi.icon;
        return (
          <Card
            key={index}
            className="hover:shadow-md transition-shadow border border-playBlueLight/20"
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-brand-primary">
                {kpi.title}
              </CardTitle>

              <div
                className={`p-2 rounded-full border border-playBlueLight/20 ${kpi.bgColor}`}
              >
                <Icon className={`h-4 w-4 ${kpi.iconColor}`} />
              </div>
            </CardHeader>

            <CardContent>
              <div className="text-2xl font-bold text-brand-primary">
                {kpi.value}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
