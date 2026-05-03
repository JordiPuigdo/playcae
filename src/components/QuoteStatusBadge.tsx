import { Badge } from "./ui/Badge";
import { QuoteStatus } from "@/types/quote";
import { useTranslation } from "@/hooks/useTranslation";

interface QuoteStatusBadgeProps {
  status: QuoteStatus;
}

export const QuoteStatusBadge = ({ status }: QuoteStatusBadgeProps) => {
  const { t } = useTranslation();

  switch (status) {
    case QuoteStatus.Draft:
      return (
        <Badge className="bg-playGrey text-brand-primary border border-playBlueLight/30">
          {t("quotes.status.draft")}
        </Badge>
      );
    case QuoteStatus.Sent:
      return (
        <Badge className="bg-playBlueLight text-white border border-playBlueLight/40">
          {t("quotes.status.sent")}
        </Badge>
      );
    case QuoteStatus.Accepted:
      return (
        <Badge className="bg-playGreen text-white border border-playGreen/40">
          {t("quotes.status.accepted")}
        </Badge>
      );
    case QuoteStatus.Rejected:
      return (
        <Badge className="bg-brand-secondary text-white border border-brand-secondary/40">
          {t("quotes.status.rejected")}
        </Badge>
      );
    case QuoteStatus.Expired:
      return (
        <Badge className="bg-playYellow text-black border border-playYellow/40">
          {t("quotes.status.expired")}
        </Badge>
      );
    default:
      return null;
  }
};
