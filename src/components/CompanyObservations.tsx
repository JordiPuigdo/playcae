import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/TextArea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { MessageSquare, Plus } from "lucide-react";
import { CompanyObservation } from "@/types/document";
import { UserRole } from "@/types/user";
import { useTranslation } from "@/hooks/useTranslation";

interface CompanyObservationsProps {
  observations: CompanyObservation[];
  userRole: UserRole;
  onAddObservation: (observation: string) => void;
}

export const CompanyObservations = ({
  observations,
  userRole,
  onAddObservation,
}: CompanyObservationsProps) => {
  const { t } = useTranslation();
  const [newObservation, setNewObservation] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  const canAddObservations = true;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!newObservation.trim()) return;

    onAddObservation(newObservation);
    setNewObservation("");
    setIsAdding(false);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("es-ES");
  };

  return (
    <Card className="bg-white">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            {t("companies.observations.title")}
          </CardTitle>
          {canAddObservations && !isAdding && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsAdding(true)}
              className="gap-2"
            >
              <Plus className="h-4 w-4" />
              {t("companies.observations.add")}
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {isAdding && (
          <form
            onSubmit={handleSubmit}
            className="space-y-3 p-4 border rounded-lg bg-muted/30"
          >
            <Textarea
              value={newObservation}
              onChange={(e) => setNewObservation(e.target.value)}
              placeholder={t("companies.observations.placeholder")}
              required
            />
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  setIsAdding(false);
                  setNewObservation("");
                }}
              >
                {t("common.cancel")}
              </Button>
              <Button type="submit" size="sm">
                {t("companies.observations.save")}
              </Button>
            </div>
          </form>
        )}

        {observations.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            {t("companies.observations.empty")}
          </div>
        ) : (
          <div className="space-y-3">
            {observations.map((observation) => (
              <div
                key={observation.id}
                className="p-4 border rounded-lg bg-background"
              >
                <div className="text-sm mb-2">{observation.observation}</div>
                <div className="text-xs text-muted-foreground">
                  {t("companies.observations.by")} {observation.createdBy} {t("companies.observations.on")}{" "}
                  {formatDate(observation.createdAt)}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
