"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, Plus, Trash2 } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import {
  CreateQuoteWorkerProfileDocumentSpecRequest,
  CreateQuoteWorkerProfileSpecRequest,
  Quote,
  QuoteWorkerProfileSpec,
  UpdateQuoteWorkerProfileSpecRequest,
} from "@/types/quote";
import { TableCard } from "./TableCard";
import { Button } from "./ui/Button";
import { Input } from "./ui/Input";
import { Card, CardContent } from "./ui/Card";

interface Props {
  quote: Quote;
  readOnly: boolean;
  onAddProfile: (data: CreateQuoteWorkerProfileSpecRequest) => Promise<void>;
  onUpdateProfile: (specId: string, data: UpdateQuoteWorkerProfileSpecRequest) => Promise<void>;
  onRemoveProfile: (specId: string) => Promise<void>;
  onAddDoc: (specId: string, data: CreateQuoteWorkerProfileDocumentSpecRequest) => Promise<void>;
  onRemoveDoc: (specId: string, docId: string) => Promise<void>;
}

export const QuoteProfilesPanel = ({
  quote,
  readOnly,
  onAddProfile,
  onUpdateProfile,
  onRemoveProfile,
  onAddDoc,
  onRemoveDoc,
}: Props) => {
  const { t } = useTranslation();
  const [newName, setNewName] = useState("");
  const [busy, setBusy] = useState(false);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const sorted = [...quote.workerProfileSpecs].sort((a, b) => a.sortOrder - b.sortOrder);

  const handleAddProfile = async () => {
    if (!newName.trim()) return;
    setBusy(true);
    try {
      await onAddProfile({
        name: newName.trim(),
        description: null,
        workerCount: 1,
        sortOrder: sorted.length,
        documents: [],
      });
      setNewName("");
    } finally {
      setBusy(false);
    }
  };

  return (
    <TableCard
      title={t("quotes.profiles.title", { count: sorted.length })}
      subtitle={t("quotes.profiles.subtitle")}
    >
      <div className="p-4 space-y-3">
        {sorted.length === 0 && (
          <Card className="border-dashed border-playBlueLight/30">
            <CardContent className="p-6 text-center text-muted-foreground">
              {t("quotes.profiles.empty")}
            </CardContent>
          </Card>
        )}

        {sorted.map((profile) => (
          <ProfileSpecRow
            key={profile.id}
            profile={profile}
            expanded={!!expanded[profile.id!]}
            readOnly={readOnly}
            onToggle={() =>
              setExpanded((prev) => ({ ...prev, [profile.id!]: !prev[profile.id!] }))
            }
            onUpdate={(data) => onUpdateProfile(profile.id!, data)}
            onRemove={() => onRemoveProfile(profile.id!)}
            onAddDoc={(data) => onAddDoc(profile.id!, data)}
            onRemoveDoc={(docId) => onRemoveDoc(profile.id!, docId)}
          />
        ))}

        {!readOnly && (
          <div className="flex gap-3 items-end pt-2">
            <div className="flex-1">
              <label className="text-sm font-medium text-brand-primary block mb-2">
                {t("quotes.profiles.newProfileLabel")}
              </label>
              <Input
                uppercase={false}
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder={t("quotes.profiles.newProfilePlaceholder")}
                className="border-playBlueLight bg-white"
              />
            </div>
            <Button
              onClick={handleAddProfile}
              disabled={!newName.trim() || busy}
              className="bg-brand-primary hover:bg-brand-primary/90 text-white"
            >
              <Plus className="h-4 w-4 mr-1" />
              {t("quotes.profiles.addProfile")}
            </Button>
          </div>
        )}
      </div>
    </TableCard>
  );
};

interface ProfileSpecRowProps {
  profile: QuoteWorkerProfileSpec;
  expanded: boolean;
  readOnly: boolean;
  onToggle: () => void;
  onUpdate: (data: UpdateQuoteWorkerProfileSpecRequest) => Promise<void>;
  onRemove: () => Promise<void>;
  onAddDoc: (data: CreateQuoteWorkerProfileDocumentSpecRequest) => Promise<void>;
  onRemoveDoc: (docId: string) => Promise<void>;
}

const ProfileSpecRow = ({
  profile,
  expanded,
  readOnly,
  onToggle,
  onUpdate,
  onRemove,
  onAddDoc,
  onRemoveDoc,
}: ProfileSpecRowProps) => {
  const { t } = useTranslation();
  const [docName, setDocName] = useState("");

  const handleAddDoc = async () => {
    if (!docName.trim()) return;
    await onAddDoc({
      documentTypeId: null,
      customName: docName.trim(),
      sortOrder: profile.documents.length,
    });
    setDocName("");
  };

  return (
    <Card className="border border-playBlueLight/30">
      <CardContent className="p-4 space-y-3">
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={onToggle}>
            {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-3">
            {readOnly ? (
              <div className="font-medium text-brand-primary">{profile.name}</div>
            ) : (
              <Input
                uppercase={false}
                defaultValue={profile.name}
                onBlur={(e) => {
                  if (e.target.value !== profile.name) onUpdate({ name: e.target.value });
                }}
                className="border-playBlueLight"
              />
            )}
            {readOnly ? (
              <div className="text-sm text-muted-foreground">
                {t("quotes.profiles.workersCount", { count: profile.workerCount })}
              </div>
            ) : (
              <div>
                <label className="text-xs text-brand-accent block mb-1">
                  {t("quotes.profiles.workerCount")}
                </label>
                <Input
                  type="number"
                  min={1}
                  defaultValue={profile.workerCount}
                  onBlur={(e) => {
                    const v = Number(e.target.value);
                    if (v !== profile.workerCount) onUpdate({ workerCount: v });
                  }}
                  className="border-playBlueLight"
                />
              </div>
            )}
            <div className="text-xs text-muted-foreground self-center">
              {t("quotes.profiles.documentsCount", { count: profile.documents.length })}
            </div>
          </div>
          {!readOnly && (
            <Button
              variant="outline"
              size="sm"
              onClick={onRemove}
              className="text-destructive hover:text-destructive"
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          )}
        </div>

        {expanded && (
          <div className="border-t border-playBlueLight/20 pt-3 space-y-2">
            {profile.documents.length === 0 && (
              <p className="text-sm text-muted-foreground">
                {t("quotes.profiles.noDocuments")}
              </p>
            )}
            {profile.documents
              .sort((a, b) => a.sortOrder - b.sortOrder)
              .map((doc) => (
                <div
                  key={doc.id}
                  className="flex items-center justify-between bg-playGrey/40 rounded-md px-3 py-2"
                >
                  <span className="text-sm">
                    {doc.documentTypeName ?? doc.customName}
                  </span>
                  {!readOnly && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onRemoveDoc(doc.id!)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              ))}

            {!readOnly && (
              <div className="flex gap-2 pt-2">
                <Input
                  uppercase={false}
                  value={docName}
                  onChange={(e) => setDocName(e.target.value)}
                  placeholder={t("quotes.profiles.addDocPlaceholder")}
                  className="border-playBlueLight bg-white flex-1"
                />
                <Button
                  onClick={handleAddDoc}
                  disabled={!docName.trim()}
                  variant="outline"
                  className="border-playBlueLight"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  {t("common.add")}
                </Button>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
