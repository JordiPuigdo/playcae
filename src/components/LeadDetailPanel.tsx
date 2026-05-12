"use client";

import { useEffect, useState } from "react";
import {
  Building2,
  CheckCircle2,
  FileText,
  Mail,
  MessageSquare,
  Phone,
  PhoneCall,
  Send,
  ShieldCheck,
} from "lucide-react";
import { LeadService } from "@/services/lead.service";
import {
  LeadEvent,
  LeadEventType,
  LeadListItem,
  LeadStatus,
  UpdateLeadStatusRequest,
} from "@/types/lead";
import { formatDate } from "@/app/utils/date";
import { LeadStatusBadge } from "./LeadStatusBadge";
import { Badge } from "./ui/Badge";
import { Button } from "./ui/Button";
import { Card, CardContent } from "./ui/Card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/Select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "./ui/Sheet";

const leadService = new LeadService();

const EVENT_ICONS: Record<LeadEventType, React.ReactNode> = {
  [LeadEventType.StatusChanged]: <CheckCircle2 className="h-4 w-4 text-brand-primary" />,
  [LeadEventType.NoteAdded]: <MessageSquare className="h-4 w-4 text-playBlueLight" />,
  [LeadEventType.QuoteSent]: <FileText className="h-4 w-4 text-playOrange" />,
  [LeadEventType.EmailSent]: <Mail className="h-4 w-4 text-blue-500" />,
  [LeadEventType.CallMade]: <PhoneCall className="h-4 w-4 text-playGreen" />,
};

const EVENT_LABELS: Record<LeadEventType, string> = {
  [LeadEventType.StatusChanged]: "Cambio de estado",
  [LeadEventType.NoteAdded]: "Nota",
  [LeadEventType.QuoteSent]: "Presupuesto enviado",
  [LeadEventType.EmailSent]: "Email enviado",
  [LeadEventType.CallMade]: "Llamada registrada",
};

const ALL_STATUSES: { value: LeadStatus; label: string }[] = [
  { value: LeadStatus.New, label: "Nuevo" },
  { value: LeadStatus.Contacted, label: "Contactado" },
  { value: LeadStatus.QuoteSent, label: "Presupuesto enviado" },
  { value: LeadStatus.PendingClaim, label: "Pendiente reclamar" },
  { value: LeadStatus.Converted, label: "Convertido" },
  { value: LeadStatus.Rejected, label: "Rechazado" },
  { value: LeadStatus.Lost, label: "Perdido" },
];

interface LeadDetailPanelProps {
  lead: LeadListItem | null;
  onClose: () => void;
  onStatusUpdated: (leadId: string, newStatus: LeadStatus) => void;
  onEmailVerified: (leadId: string, verified: boolean) => void;
}

export function LeadDetailPanel({ lead, onClose, onStatusUpdated, onEmailVerified }: LeadDetailPanelProps) {
  const [events, setEvents] = useState<LeadEvent[]>([]);
  const [eventsLoading, setEventsLoading] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<LeadStatus>(LeadStatus.New);
  const [statusNote, setStatusNote] = useState("");
  const [savingStatus, setSavingStatus] = useState(false);
  const [noteText, setNoteText] = useState("");
  const [savingNote, setSavingNote] = useState(false);
  const [activeAction, setActiveAction] = useState<"note" | "call" | null>(null);
  const [activating, setActivating] = useState(false);

  useEffect(() => {
    if (!lead) return;
    setSelectedStatus(lead.status);
    setStatusNote("");
    setNoteText("");
    setActiveAction(null);
    loadEvents(lead.id!);
  }, [lead?.id]);

  async function loadEvents(leadId: string) {
    setEventsLoading(true);
    try {
      const res = await leadService.getEvents(leadId);
      setEvents(res.data ?? []);
    } catch {
      setEvents([]);
    } finally {
      setEventsLoading(false);
    }
  }

  async function handleSaveStatus() {
    if (!lead || selectedStatus === lead.status) return;
    setSavingStatus(true);
    try {
      const req: UpdateLeadStatusRequest = { status: selectedStatus, notes: statusNote || undefined };
      await leadService.updateStatus(lead.id!, req);
      onStatusUpdated(lead.id!, selectedStatus);
      setStatusNote("");
      await loadEvents(lead.id!);
    } catch {
      /* noop */
    } finally {
      setSavingStatus(false);
    }
  }

  async function handleAddNote() {
    if (!lead || !noteText.trim()) return;
    setSavingNote(true);
    try {
      await leadService.addEvent(lead.id!, { eventType: LeadEventType.NoteAdded, notes: noteText.trim() });
      setNoteText("");
      setActiveAction(null);
      await loadEvents(lead.id!);
    } catch {
      /* noop */
    } finally {
      setSavingNote(false);
    }
  }

  async function handleQuickEvent(eventType: LeadEventType) {
    if (!lead) return;
    await leadService.addEvent(lead.id!, { eventType });
    await loadEvents(lead.id!);
  }

  async function handleActivate() {
    if (!lead || lead.emailVerified) return;
    setActivating(true);
    try {
      await leadService.activate(lead.id!);
      onEmailVerified(lead.id!, true);
      await loadEvents(lead.id!);
    } catch {
      /* noop */
    } finally {
      setActivating(false);
    }
  }

  async function handleDeactivate() {
    if (!lead || !lead.emailVerified) return;
    setActivating(true);
    try {
      await leadService.deactivate(lead.id!);
      onEmailVerified(lead.id!, false);
      await loadEvents(lead.id!);
    } catch {
      /* noop */
    } finally {
      setActivating(false);
    }
  }

  async function handleRegisterCall() {
    if (!lead || !noteText.trim()) return;
    setSavingNote(true);
    try {
      await leadService.addEvent(lead.id!, { eventType: LeadEventType.CallMade, notes: noteText.trim() });
      setNoteText("");
      setActiveAction(null);
      await loadEvents(lead.id!);
    } catch {
      /* noop */
    } finally {
      setSavingNote(false);
    }
  }

  return (
    <Sheet open={!!lead} onOpenChange={(open) => { if (!open) onClose(); }}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-lg flex flex-col gap-0 p-0 overflow-hidden"
      >
        {lead && (
          <>
            {/* Header */}
            <SheetHeader className="px-6 py-4 border-b bg-playGrey">
              <SheetTitle className="text-base font-bold text-brand-primary flex items-center gap-2">
                <Building2 className="h-5 w-5 shrink-0" />
                {lead.companyName}
              </SheetTitle>
              <div className="flex items-center gap-2 flex-wrap mt-1">
                <LeadStatusBadge status={lead.status} />
                <Badge variant="secondary" className="text-xs">
                  {lead.origin === 0 ? "Web" : "Landing"}
                </Badge>
              </div>
              <div className="flex flex-col gap-1 mt-2 text-sm text-muted-foreground">
                <a href={`mailto:${lead.email}`} className="flex items-center gap-1 hover:text-brand-primary">
                  <Mail className="h-3 w-3" /> {lead.email}
                </a>
                {lead.phone && (
                  <span className="flex items-center gap-1">
                    <Phone className="h-3 w-3" /> {lead.phone}
                  </span>
                )}
                <span className="text-xs">Registrado el {formatDate(lead.creationDate)}</span>
              </div>
            </SheetHeader>

            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-5">
              {/* Estado */}
              <div className="space-y-2">
                <p className="text-sm font-semibold text-brand-primary">Estado</p>
                <div className="flex gap-2 items-end">
                  <div className="flex-1">
                    <Select
                      value={String(selectedStatus)}
                      onValueChange={(v) => setSelectedStatus(Number(v) as LeadStatus)}
                    >
                      <SelectTrigger className="border-playBlueLight focus-visible:ring-brand-primary h-9">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-white border border-playBlueLight/30">
                        {ALL_STATUSES.map((s) => (
                          <SelectItem
                            key={s.value}
                            value={String(s.value)}
                            className="hover:bg-playGrey hover:text-brand-primary"
                          >
                            {s.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <Button
                    type="button"
                    size="sm"
                    onClick={handleSaveStatus}
                    disabled={savingStatus || selectedStatus === lead.status}
                    className="bg-brand-primary hover:bg-brand-primary/90 text-white h-9"
                  >
                    Guardar
                  </Button>
                </div>
                {selectedStatus !== lead.status && (
                  <textarea
                    placeholder="Nota sobre el cambio de estado (opcional)"
                    value={statusNote}
                    onChange={(e) => setStatusNote(e.target.value)}
                    rows={2}
                    className="w-full rounded-md border border-playBlueLight/50 px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-brand-primary/30 placeholder:text-muted-foreground"
                  />
                )}
              </div>

              {/* Acciones rápidas */}
              <div className="space-y-2">
                <p className="text-sm font-semibold text-brand-primary">Acciones</p>
                <div className="flex flex-wrap gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setActiveAction(activeAction === "note" ? null : "note")}
                    className="gap-1.5 border-playBlueLight text-brand-primary hover:bg-playGrey"
                  >
                    <MessageSquare className="h-3.5 w-3.5" />
                    Añadir nota
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setActiveAction(activeAction === "call" ? null : "call")}
                    className="gap-1.5 border-playBlueLight text-brand-primary hover:bg-playGrey"
                  >
                    <PhoneCall className="h-3.5 w-3.5" />
                    Registrar llamada
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => handleQuickEvent(LeadEventType.QuoteSent)}
                    className="gap-1.5 border-playOrange text-playOrange hover:bg-playOrange/10"
                  >
                    <Send className="h-3.5 w-3.5" />
                    Presupuesto enviado
                  </Button>
                  {!lead.emailVerified ? (
                    <Button
                      type="button"
                      size="sm"
                      onClick={handleActivate}
                      disabled={activating}
                      className="gap-1.5 bg-playGreen hover:bg-playGreen/90 text-white"
                    >
                      <ShieldCheck className="h-3.5 w-3.5" />
                      {activating ? "Activando..." : "Activar cuenta"}
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleDeactivate}
                      disabled={activating}
                      className="gap-1.5 border-red-300 text-red-600 hover:bg-red-50"
                    >
                      <ShieldCheck className="h-3.5 w-3.5" />
                      {activating ? "Desactivando..." : "Desactivar cuenta"}
                    </Button>
                  )}
                </div>

                {activeAction && (
                  <div className="space-y-2 pt-1">
                    <textarea
                      placeholder={activeAction === "note" ? "Escribe una nota..." : "Resumen de la llamada..."}
                      value={noteText}
                      onChange={(e) => setNoteText(e.target.value)}
                      rows={3}
                      className="w-full rounded-md border border-playBlueLight/50 px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-brand-primary/30 placeholder:text-muted-foreground"
                    />
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        size="sm"
                        disabled={savingNote || !noteText.trim()}
                        onClick={activeAction === "note" ? handleAddNote : handleRegisterCall}
                        className="bg-brand-primary hover:bg-brand-primary/90 text-white"
                      >
                        Guardar
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => { setActiveAction(null); setNoteText(""); }}
                        className="border-playBlueLight"
                      >
                        Cancelar
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              {/* Timeline */}
              <div className="space-y-2">
                <p className="text-sm font-semibold text-brand-primary">Historial de actividad</p>
                {eventsLoading ? (
                  <p className="text-sm text-muted-foreground">Cargando...</p>
                ) : events.length === 0 ? (
                  <Card className="border-dashed border-playBlueLight/30">
                    <CardContent className="py-6 text-center text-sm text-muted-foreground">
                      Sin actividad registrada
                    </CardContent>
                  </Card>
                ) : (
                  <div className="relative space-y-3">
                    {events.map((event, index) => (
                      <div key={event.id} className="flex gap-3">
                        <div className="flex flex-col items-center">
                          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-playGrey border border-playBlueLight/20">
                            {EVENT_ICONS[event.eventType]}
                          </div>
                          {index < events.length - 1 && (
                            <div className="w-px flex-1 bg-playBlueLight/20 mt-1 min-h-3" />
                          )}
                        </div>
                        <div className="flex-1 pb-3">
                          <div className="flex items-baseline gap-2">
                            <span className="text-xs font-medium text-brand-primary">
                              {EVENT_LABELS[event.eventType]}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {formatDate(event.creationDate)}
                            </span>
                          </div>
                          {event.eventType === LeadEventType.StatusChanged && event.previousStatus !== undefined && event.newStatus !== undefined && (
                            <p className="text-xs text-muted-foreground mt-0.5">
                              {ALL_STATUSES.find(s => s.value === event.previousStatus)?.label ?? "—"}{" "}
                              → {ALL_STATUSES.find(s => s.value === event.newStatus)?.label ?? "—"}
                            </p>
                          )}
                          {event.notes && (
                            <p className="text-sm text-foreground mt-0.5 whitespace-pre-wrap">{event.notes}</p>
                          )}
                          {event.createdByUserEmail && (
                            <p className="text-xs text-muted-foreground mt-0.5">{event.createdByUserEmail}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
