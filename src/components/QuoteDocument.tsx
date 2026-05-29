"use client";

import Image from "next/image";
import { CheckCircle2 } from "lucide-react";
import { Quote, QuoteBillingType, QuoteLanguage, QuoteStatus } from "@/types/quote";

const formatCurrency = (value: number) => {
  const abs = Math.abs(value).toFixed(2);
  const [int, dec] = abs.split(".");
  const intFormatted = int.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  const decPart = dec === "00" ? "" : `,${dec}`;
  return `${value < 0 ? "-" : ""}${intFormatted}${decPart} €`;
};

const formatDate = (iso?: string | null, lang: QuoteLanguage = QuoteLanguage.Es) => {
  if (!iso) return "-";
  const d = new Date(iso);
  return d.toLocaleDateString(lang === QuoteLanguage.Ca ? "ca-ES" : "es-ES", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
};

const buildDocumentNumber = (reference: string, clientCompanyName: string, issueDate: string) => {
  const namePart = clientCompanyName
    .toUpperCase()
    .replace(/\b(S\.L\.U\.|S\.A\.U\.|S\.L\.|S\.A\.|SLU|SAU|SL|SA)\b/g, "")
    .replace(/[^A-Z0-9\s]/g, "")
    .trim()
    .split(/\s+/)[0];
  const d = new Date(issueDate);
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();
  return `${reference}_${namePart}_${dd}_${mm}_${yyyy}`;
};

const FEATURES = [
  { icon: "📁", title: "Gestión documental CAE", titleCa: "Gestió documental CAE", desc: "Control completo del ciclo de vida de documentos", descCa: "Control complet del cicle de vida de documents" },
  { icon: "⏰", title: "Control de caducidades", titleCa: "Control de caducitats", desc: "Avisos automáticos 7 días antes y tras vencimiento", descCa: "Avisos automàtics 7 dies abans i després del venciment" },
  { icon: "📋", title: "Plantillas dinámicas", titleCa: "Plantilles dinàmiques", desc: "Descarga, firma y subida de documentos firmados", descCa: "Descàrrega, signatura i pujada de documents signats" },
  { icon: "☁️", title: "Cloud Microsoft Azure", titleCa: "Cloud Microsoft Azure", desc: "Alojamiento seguro y de alta disponibilidad", descCa: "Allotjament segur i d'alta disponibilitat" },
  { icon: "🏢", title: "Multiempresa", titleCa: "Multiempresa", desc: "Gestión unificada de todas las sedes desde una sola plataforma", descCa: "Gestió unificada de totes les seus des d'una sola plataforma" },
  { icon: "📧", title: "Notificaciones email", titleCa: "Notificacions email", desc: "Sistema de avisos automáticos vía Brevo", descCa: "Sistema d'avisos automàtics via Brevo" },
  { icon: "🔗", title: "Portal proveedores", titleCa: "Portal proveïdors", desc: "Acceso directo para que cada proveedor suba su documentación", descCa: "Accés directe perquè cada proveïdor pugi la seva documentació" },
  { icon: "📈", title: "Escalabilidad", titleCa: "Escalabilitat", desc: "Sin migraciones al crecer en proveedores o documentación", descCa: "Sense migracions en créixer en proveïdors o documentació" },
  { icon: "🛠", title: "Soporte y mantenimiento", titleCa: "Suport i manteniment", desc: "Soporte técnico y actualizaciones incluidas", descCa: "Suport tècnic i actualitzacions incloses" },
];

const VALUE_PILLS = [
  { icon: "✓", label: "Reducción de riesgo legal PRL", labelCa: "Reducció de risc legal PRL", color: "green" },
  { icon: "✓", label: "Automatización CAE completa", labelCa: "Automatització CAE completa", color: "green" },
  { icon: "📁", label: "Control documental total", labelCa: "Control documental total", color: "blue" },
  { icon: "🔍", label: "Preparación para auditorías", labelCa: "Preparació per a auditories", color: "blue" },
  { icon: "⚡", label: "Ahorro de tiempo administrativo", labelCa: "Estalvi de temps administratiu", color: "orange" },
  { icon: "🚀", label: "Escalabilidad sin fricciones", labelCa: "Escalabilitat sense friccions", color: "orange" },
  { icon: "✓", label: "Transición segura con migración incluida", labelCa: "Transició segura amb migració inclosa", color: "green" },
  { icon: "🔒", label: "Almacenamiento seguro en Azure", labelCa: "Emmagatzematge segur a Azure", color: "blue" },
];

interface Props {
  quote: Quote;
}

export function QuoteDocument({ quote }: Props) {
  const isCa = quote.language === QuoteLanguage.Ca;

  const regularDocs = quote.companyDocumentSpecs
    .filter((d) => !d.isTemplate)
    .sort((a, b) => a.sortOrder - b.sortOrder);
  const templateDocs = quote.companyDocumentSpecs
    .filter((d) => d.isTemplate)
    .sort((a, b) => a.sortOrder - b.sortOrder);

  const halfTotal = quote.firstYearTotal / 2;

  return (
    <div data-quote-document="true" style={{ maxWidth: 900, margin: "0 auto", background: "white", boxShadow: "0 4px 40px rgba(0,0,0,0.12)" }}>
      <style>{`
        @media print {
          .no-print { display: none !important; }
          body { background: white !important; }
          @page { size: A4; margin: 0; }
          * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
          .print-section { break-inside: avoid; }
          .print-page-break { break-before: page; }
        }
      `}</style>

      {/* ── HEADER ── */}
      <div style={{ background: "#153454", padding: "40px 56px 36px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 4, background: "linear-gradient(90deg, #EF7932, #517B95, transparent)" }} />
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 32 }}>
          <Image src="/assets/playcaeDashboard.png" alt="Play CAE" width={140} height={40} style={{ filter: "brightness(0) invert(1)", objectFit: "contain" }} />
          <span style={{ color: "rgba(255,255,255,0.8)", fontSize: 18, fontWeight: 800 }}>{quote.clientCompanyName}</span>
        </div>
        <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.15em", textTransform: "uppercase", color: "#EF7932", marginBottom: 8 }}>
          {isCa ? "Proposta Comercial" : "Propuesta Comercial"}
        </div>
        <h1 style={{ fontSize: 28, fontWeight: 800, color: "white", lineHeight: 1.2, marginBottom: 6 }}>
          Plataforma CAE / PRL
        </h1>
        <p style={{ fontSize: 13, color: "rgba(255,255,255,0.55)" }}>
          {isCa ? "Gestió documental de Coordinació d'Activitats Empresarials" : "Gestión documental de Coordinación de Actividades Empresariales"}
        </p>
        <div style={{ display: "flex", gap: 32, marginTop: 24, paddingTop: 24, borderTop: "1px solid rgba(255,255,255,0.12)" }}>
          {[
            { label: isCa ? "Client" : "Cliente", value: quote.clientCompanyName },
            { label: isCa ? "Núm. Pressupost" : "Nº Presupuesto", value: quote.reference, mono: true },
            { label: isCa ? "Data" : "Fecha", value: formatDate(quote.issueDate, quote.language) },
            { label: isCa ? "Vàlid fins" : "Válido hasta", value: formatDate(quote.validUntil, quote.language) },
          ].map(({ label, value, mono }) => (
            <div key={label}>
              <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "#517B95", marginBottom: 4 }}>{label}</div>
              <div style={{ fontSize: 13, color: "rgba(255,255,255,0.85)", fontWeight: 500, fontFamily: mono ? "monospace" : undefined }}>{value}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── CONTENT ── */}
      <div style={{ padding: "0 56px" }}>

        {/* Accepted banner */}
        {quote.status === QuoteStatus.Accepted && (
          <div style={{ display: "flex", alignItems: "flex-start", gap: 12, background: "rgba(63,166,107,0.1)", borderLeft: "4px solid #3FA66B", padding: "16px 20px", margin: "24px 0", borderRadius: "0 8px 8px 0" }}>
            <CheckCircle2 style={{ width: 24, height: 24, color: "#3FA66B", flexShrink: 0 }} />
            <div style={{ fontSize: 13 }}>
              <p style={{ fontWeight: 600, color: "#153454" }}>{isCa ? "Acceptada" : "Aceptada"}</p>
              {quote.acceptedAt && (
                <p style={{ color: "#517B95" }}>
                  {formatDate(quote.acceptedAt, quote.language)}
                  {quote.acceptedByName ? ` · ${quote.acceptedByName}` : ""}
                </p>
              )}
            </div>
          </div>
        )}

        {/* ── ALCANCE ── */}
        {(quote.scope || quote.externalCompaniesCount > 0) && (
          <Section>
            <SectionHeader icon="📊" title={isCa ? "Abast del Servei" : "Alcance del Servicio"} />
            {quote.scope && (
              <div style={{ background: "#F2F4F5", borderLeft: "3px solid #EF7932", padding: "16px 20px", borderRadius: "0 8px 8px 0", fontSize: 13.5, color: "#4a5568", lineHeight: 1.7, marginTop: 8, marginBottom: 16 }}>
                {quote.scope}
              </div>
            )}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginTop: 16 }}>
              <StatCard value={`~${quote.externalCompaniesCount}`} label={isCa ? "Empreses externes" : "Empresas externas"} />
              <StatCard value={String(quote.externalWorkersCount)} label={isCa ? "Treballadors externs" : "Trabajadores externos"} />
              <StatCard value={String(quote.usersCount)} label={isCa ? "Usuaris plataforma" : "Usuarios plataforma"} />
            </div>
          </Section>
        )}

        {/* ── DOCS EMPRESA ── */}
        {quote.companyDocumentSpecs.length > 0 && (
          <Section>
            <SectionHeader
              icon="🏭"
              title={isCa ? "Documentació — Empreses / Proveïdors" : "Documentación — Empresas / Proveedores"}
              subtitle={`${regularDocs.length} ${isCa ? "documents" : "documentos"}${templateDocs.length > 0 ? ` + ${templateDocs.length} ${isCa ? "plantilla" : "plantilla"}` : ""}`}
            />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginTop: 16 }}>
              <DocGroup
                title={isCa ? "Documents empresa" : "Documentos empresa"}
                count={regularDocs.length}
                items={regularDocs.map((d) => d.documentTypeName ?? d.customName ?? "")}
              />
              {templateDocs.length > 0 && (
                <DocGroup
                  title={isCa ? "Plantilles empresa" : "Plantillas empresa"}
                  count={templateDocs.length}
                  items={templateDocs.map((d) => d.documentTypeName ?? d.customName ?? "")}
                  isTemplate
                />
              )}
            </div>
          </Section>
        )}

        {/* ── PERFILES TRABAJADOR ── */}
        {quote.workerProfileSpecs.length > 0 && (
          <Section>
            <SectionHeader
              icon="👷"
              title={isCa ? "Documentació — Treballadors" : "Documentación — Trabajadores"}
              subtitle={`${quote.workerProfileSpecs.reduce((acc, p) => acc + p.documents.length, 0)} ${isCa ? "documents per treballador" : "documentos por trabajador"}`}
            />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginTop: 16 }}>
              {[...quote.workerProfileSpecs].sort((a, b) => a.sortOrder - b.sortOrder).map((profile) => (
                <DocGroup
                  key={profile.id}
                  title={profile.name}
                  count={profile.workerCount}
                  countLabel={isCa ? "treballadors" : "trabajadores"}
                  items={profile.documents.map((d) => d.documentTypeName ?? d.customName ?? "")}
                />
              ))}
            </div>
          </Section>
        )}

        {/* ── PERFILES EMPRESA ── */}
        {quote.companyProfileSpecs.length > 0 && (
          <Section>
            <SectionHeader
              icon="🏢"
              title={isCa ? "Perfils d'empresa" : "Perfiles de empresa"}
            />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginTop: 16 }}>
              {[...quote.companyProfileSpecs].sort((a, b) => a.sortOrder - b.sortOrder).map((profile) => (
                <div key={profile.id} style={{ background: "#F2F4F5", border: "1px solid #e2e8f0", borderRadius: 10, padding: "18px 20px" }}>
                  <div style={{ fontSize: 12.5, fontWeight: 700, color: "#153454", marginBottom: 4 }}>{profile.name}</div>
                  {profile.description && <div style={{ fontSize: 12, color: "#718096" }}>{profile.description}</div>}
                  <div style={{ marginTop: 8, fontSize: 11, color: "#517B95" }}>
                    {profile.companyCount} {isCa ? "empreses" : "empresas"}
                  </div>
                </div>
              ))}
            </div>
          </Section>
        )}

        {/* ── FUNCIONALIDADES ── */}
        <Section>
          <SectionHeader icon="⚙️" title={isCa ? "Funcionalitats Incloses" : "Funcionalidades Incluidas"} />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginTop: 16 }}>
            {FEATURES.map((f, i) => (
              <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start", padding: 14, background: "#F2F4F5", borderRadius: 8, border: "1px solid #e2e8f0" }}>
                <span style={{ fontSize: 16, flexShrink: 0, marginTop: 1 }}>{f.icon}</span>
                <div>
                  <strong style={{ display: "block", fontSize: 12.5, fontWeight: 600, color: "#153454", marginBottom: 2 }}>
                    {isCa ? f.titleCa : f.title}
                  </strong>
                  <span style={{ fontSize: 11.5, color: "#718096", lineHeight: 1.4 }}>
                    {isCa ? f.descCa : f.desc}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* ── PROPUESTA ECONÓMICA ── */}
        <Section pageBreak>
          <SectionHeader icon="💰" title={isCa ? "Proposta Econòmica" : "Propuesta Económica"} />
          <div style={{ background: "#153454", borderRadius: 14, padding: 32, color: "white", marginTop: 8 }}>
            {[...quote.lines].sort((a, b) => a.sortOrder - b.sortOrder).map((line, i, arr) => (
              <div
                key={line.id}
                style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 0", borderBottom: i < arr.length - 1 ? "1px solid rgba(255,255,255,0.1)" : "none", gap: 24 }}
              >
                <div style={{ flex: 1 }}>
                  <strong style={{ display: "block", color: line.billingType === QuoteBillingType.Annual ? "#EF7932" : "white", fontSize: 15, fontWeight: 600, marginBottom: 3 }}>
                    {line.nameSnapshot}
                    {line.isOptional && (
                      <span style={{ marginLeft: 8, fontSize: 11, background: "rgba(244,197,66,0.3)", color: "#F4C542", borderRadius: 4, padding: "1px 6px" }}>
                        {isCa ? "Opcional" : "Opcional"}
                      </span>
                    )}
                  </strong>
                  <small style={{ fontSize: 12, color: line.billingType === QuoteBillingType.Annual ? "#EF7932" : "rgba(255,255,255,0.45)" }}>
                    {line.billingType === QuoteBillingType.Annual
                      ? isCa ? "Pagament anual" : "Pago anual"
                      : isCa ? "Pagament únic" : "Pago único"}
                    {" · "}
                    {line.quantity === 1
                      ? isCa ? "1 ut." : "1 ud."
                      : isCa ? `${line.quantity} uts.` : `${line.quantity} uds.`}
                  </small>
                </div>
                <div style={{ fontSize: 22, fontWeight: 800, color: line.billingType === QuoteBillingType.Annual ? "#EF7932" : "white", fontFamily: "monospace", whiteSpace: "nowrap", flexShrink: 0 }}>
                  {formatCurrency(line.unitPrice * line.quantity)}
                </div>
              </div>
            ))}

            <div style={{ marginTop: 16, paddingTop: 12, borderTop: "1px solid rgba(255,255,255,0.15)" }}>
              {[
                { label: isCa ? "Subtotal anual" : "Subtotal anual", value: quote.annualSubtotal },
                { label: isCa ? "Subtotal pagament únic" : "Subtotal pago único", value: quote.oneTimeSubtotal },
              ].map(({ label, value }) => (
                <div key={label} style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                  <span style={{ fontSize: 13, color: "rgba(255,255,255,0.55)" }}>{label}</span>
                  <span style={{ fontFamily: "monospace", color: "rgba(255,255,255,0.55)", fontSize: 13, whiteSpace: "nowrap" }}>{formatCurrency(value)}</span>
                </div>
              ))}
            </div>

            <div style={{ marginTop: 12, padding: "20px 24px", background: "rgba(255,255,255,0.06)", borderRadius: 10, border: "1px solid rgba(255,255,255,0.12)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <strong style={{ display: "block", color: "white", fontSize: 15, marginBottom: 4 }}>
                  {isCa ? "Total primer any" : "Total primer año"}
                </strong>
                <span style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 600 }}>
                  {isCa
                    ? `A partir del 2n any: ${formatCurrency(quote.annualSubtotal)} / any`
                    : `A partir del 2.º año: ${formatCurrency(quote.annualSubtotal)} / año`}
                </span>
              </div>
              <div style={{ fontSize: 34, fontWeight: 800, color: "#EF7932", fontFamily: "monospace", letterSpacing: "-0.02em", whiteSpace: "nowrap", flexShrink: 0 }}>
                {formatCurrency(quote.firstYearTotal)}
              </div>
            </div>

            <p style={{ marginTop: 12, fontSize: 12, color: "rgba(255,255,255,0.4)", textAlign: "center" }}>
              {isCa
                ? `Preus sense IVA · Vàlid fins ${formatDate(quote.validUntil, quote.language)} · Ajustable segons creixement`
                : `Precios sin IVA · Válido hasta ${formatDate(quote.validUntil, quote.language)} · Ajustable según crecimiento`}
            </p>
          </div>
        </Section>

        {/* ── CONDICIONES DE PAGO ── */}
        <Section>
          <SectionHeader icon="💳" title={isCa ? "Condicions de Pagament" : "Condiciones de Pago"} />
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13, marginTop: 16 }}>
            <thead>
              <tr style={{ background: "#153454", color: "white" }}>
                {[isCa ? "Moment" : "Momento", isCa ? "Concepte" : "Concepto", "%", isCa ? "Import" : "Importe"].map((h, i) => (
                  <th key={h} style={{ padding: "10px 14px", textAlign: i >= 2 ? "right" : "left", fontSize: 11, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                {
                  moment: isCa ? "Firma del contracte" : "Firma del contrato",
                  concept: isCa ? "Arrencada del projecte i inici de la implementació" : "Arranque del proyecto e inicio de la implementación",
                },
                {
                  moment: "Go-live",
                  concept: isCa ? "Sistema operatiu, formació completada i lliurament final" : "Sistema operativo, formación completada y entrega final",
                },
              ].map(({ moment, concept }) => (
                <tr key={moment} style={{ borderBottom: "1px solid #e2e8f0" }}>
                  <td style={{ padding: "10px 14px", fontWeight: 700, color: "#153454" }}>{moment}</td>
                  <td style={{ padding: "10px 14px", color: "#4a5568" }}>{concept}</td>
                  <td style={{ padding: "10px 14px", textAlign: "right", fontWeight: 600, color: "#517B95" }}>50%</td>
                  <td style={{ padding: "10px 14px", textAlign: "right", fontWeight: 700, color: "#153454" }}>{formatCurrency(halfTotal)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan={3} style={{ padding: "10px 14px", fontWeight: 700, color: "#153454", background: "#F2F4F5" }}>
                  {isCa ? "Total primer any" : "Total primer año"}
                </td>
                <td style={{ padding: "10px 14px", textAlign: "right", fontWeight: 700, color: "#EF7932", fontSize: 15, background: "#F2F4F5" }}>
                  {formatCurrency(quote.firstYearTotal)}
                </td>
              </tr>
            </tfoot>
          </table>
          <div style={{ marginTop: 14, background: "#F2F4F5", borderLeft: "3px solid #517B95", padding: "12px 16px", borderRadius: "0 8px 8px 0" }}>
            <p style={{ fontSize: 12.5, color: "#4a5568", marginBottom: 6 }}>
              <strong style={{ color: "#153454" }}>{isCa ? "Renovació anual:" : "Renovación anual:"}</strong>{" "}
              {isCa
                ? `A partir del 2n any, la llicència anual (${formatCurrency(quote.annualSubtotal)}) es factura a l'inici de cada període.`
                : `A partir del 2.º año, la licencia anual (${formatCurrency(quote.annualSubtotal)}) se factura al inicio de cada periodo.`}
            </p>
            <p style={{ fontSize: 12.5, color: "#4a5568" }}>
              <strong style={{ color: "#153454" }}>{isCa ? "Forma de pagament:" : "Forma de pago:"}</strong>{" "}
              {isCa
                ? `Transferència bancària. Preus sense IVA. Validesa: fins ${formatDate(quote.validUntil, quote.language)}.`
                : `Transferencia bancaria. Precios sin IVA. Validez: hasta ${formatDate(quote.validUntil, quote.language)}.`}
            </p>
          </div>
        </Section>

        {/* ── VALOR APORTADO ── */}
        <Section>
          <SectionHeader icon="🎯" title={isCa ? "Valor Aportat" : "Valor Aportado"} />
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 12 }}>
            {VALUE_PILLS.map((pill, i) => (
              <span
                key={i}
                style={{
                  padding: "6px 14px",
                  borderRadius: 100,
                  fontSize: 12,
                  fontWeight: 500,
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  background: pill.color === "green" ? "rgba(63,166,107,0.1)" : pill.color === "orange" ? "rgba(239,121,50,0.1)" : "rgba(21,52,84,0.07)",
                  color: pill.color === "green" ? "#3FA66B" : pill.color === "orange" ? "#EF7932" : "#153454",
                  border: `1px solid ${pill.color === "green" ? "rgba(63,166,107,0.2)" : pill.color === "orange" ? "rgba(239,121,50,0.2)" : "rgba(21,52,84,0.15)"}`,
                }}
              >
                <span style={{ fontSize: 11 }}>{pill.icon}</span>
                {isCa ? pill.labelCa : pill.label}
              </span>
            ))}
          </div>
        </Section>

        {/* ── ACEPTACIÓN ── */}
        <Section noBorder pageBreak>
          <SectionHeader icon="✅" title={isCa ? "Acceptació de l'Oferta" : "Aceptación de la Oferta"} />
          <p style={{ fontSize: 13, color: "#4a5568", marginBottom: 20 }}>
            {quote.status === QuoteStatus.Accepted
              ? isCa
                ? "Aquesta oferta ha estat acceptada. Les dades de la signatura queden registrades a continuació."
                : "Esta oferta ha sido aceptada. Los datos de la firma quedan registrados a continuación."
              : isCa
                ? "Si desitja acceptar la present oferta, signi i retorni aquest document. La signatura implica l'acceptació dels termes i condicions descrits al pressupost."
                : "Si desea aceptar la presente oferta, firme y devuelva este documento. La firma implica la aceptación de los términos y condiciones descritos en el presupuesto."}
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
            <AcceptBox title={isCa ? "Dades del proveïdor" : "Datos del proveedor"} rows={[
              [isCa ? "Nom comercial" : "Nombre comercial", "PlayCAE"],
              [isCa ? "Denominació social" : "Denominación social", "OCTOSOFT S.L."],
              ["NIF", "B25929381"],
              [isCa ? "Domicili social" : "Domicilio social", "Calle Unió Europea, 3 – Pta. 2, 08540 Centelles (Barcelona)"],
              ["Email", "soporte@playcae.com"],
              ["Web", "www.playcae.com"],
              ["IBAN", "______________________________"],
            ]} />
            <AcceptBox title={isCa ? "Dades del client" : "Datos del cliente"} rows={[
              [isCa ? "Empresa" : "Empresa", quote.clientCompanyName],
              [isCa ? "Nom i cognoms" : "Nombre y apellidos", quote.acceptedByName ?? "______________________________"],
              ["DNI / NIF", quote.acceptedByDni ?? "______________________________"],
              [isCa ? "Data" : "Fecha", quote.acceptedAt ? formatDate(quote.acceptedAt, quote.language) : "______________________________"],
            ]} />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginTop: 20 }}>
            <SignBox title={isCa ? "Signatura del proveïdor" : "Firma del proveedor"}>
              <div style={{ fontSize: 12.5, fontWeight: 700, color: "#153454" }}>Noè Alexandre</div>
              <div style={{ fontSize: 11.5, color: "#718096" }}>CEO · OCTOSOFT S.L.</div>
              <div style={{ fontSize: 11.5, color: "#718096", marginTop: 2 }}>{formatDate(quote.issueDate, quote.language)}</div>
            </SignBox>
            <SignBox title={isCa ? "Signatura del client" : "Firma del cliente"}>
              {quote.acceptedByName ? (
                <>
                  <div style={{ fontSize: 12.5, fontWeight: 700, color: "#153454" }}>{quote.acceptedByName}</div>
                  {quote.acceptedAt && (
                    <div style={{ fontSize: 11.5, color: "#718096", marginTop: 2 }}>{formatDate(quote.acceptedAt, quote.language)}</div>
                  )}
                </>
              ) : (
                <div style={{ fontSize: 12, color: "#718096" }}>{isCa ? "Nom i segell de l'empresa" : "Nombre y sello de la empresa"}</div>
              )}
            </SignBox>
          </div>
        </Section>

      </div>

      {/* ── FOOTER ── */}
      <div style={{ background: "#153454", padding: "24px 56px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <strong style={{ display: "block", color: "rgba(255,255,255,0.8)", fontSize: 13, marginBottom: 2 }}>PlayCAE</strong>
          <span style={{ fontSize: 12, color: "rgba(255,255,255,0.4)" }}>
            {isCa ? "Plataforma de gestió CAE / PRL" : "Plataforma de gestión CAE / PRL"}
          </span>
        </div>
        <div style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", textAlign: "right", fontFamily: "monospace" }}>
          {isCa ? "Document confidencial · Ús exclusiu del destinatari" : "Documento confidencial · Uso exclusivo del destinatario"}<br />
          Ref: {quote.reference}
        </div>
      </div>
    </div>
  );
}

// ── Sub-components ──────────────────────────────────────────

function Section({ children, noBorder, pageBreak }: { children: React.ReactNode; noBorder?: boolean; pageBreak?: boolean }) {
  return (
    <div
      className={`print-section${pageBreak ? " print-page-break" : ""}`}
      style={{ padding: "36px 0", borderBottom: noBorder ? "none" : "1px solid #e2e8f0" }}
    >
      {children}
    </div>
  );
}

function SectionHeader({ icon, title, subtitle }: { icon: string; title: string; subtitle?: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 4 }}>
      <div style={{ width: 32, height: 32, background: "#153454", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, flexShrink: 0 }}>
        {icon}
      </div>
      <span style={{ fontSize: 16, fontWeight: 700, color: "#153454" }}>{title}</span>
      {subtitle && <span style={{ fontSize: 12, color: "#718096", marginLeft: "auto" }}>{subtitle}</span>}
    </div>
  );
}

function StatCard({ value, label, highlight }: { value: string; label: string; highlight?: boolean }) {
  return (
    <div style={{ background: highlight ? "#153454" : "#F2F4F5", border: `1px solid ${highlight ? "#153454" : "#e2e8f0"}`, borderRadius: 10, padding: "18px 16px" }}>
      <div style={{ fontSize: 24, fontWeight: 800, color: highlight ? "#EF7932" : "#153454", lineHeight: 1, marginBottom: 4 }}>{value}</div>
      <div style={{ fontSize: 11, color: highlight ? "rgba(255,255,255,0.6)" : "#718096", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.06em" }}>{label}</div>
    </div>
  );
}

function DocGroup({ title, count, countLabel, items, isTemplate }: { title: string; count: number; countLabel?: string; items: string[]; isTemplate?: boolean }) {
  return (
    <div style={{ background: "#F2F4F5", border: "1px solid #e2e8f0", borderRadius: 10, padding: "18px 20px" }}>
      <div style={{ fontSize: 11, fontWeight: 700, color: "#517B95", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 12, display: "flex", alignItems: "center", gap: 8 }}>
        {title}
        <span style={{ background: "#517B95", color: "white", borderRadius: 20, padding: "1px 8px", fontSize: 10, fontWeight: 600 }}>
          {count}{countLabel ? ` ${countLabel}` : ""}
        </span>
      </div>
      <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 6 }}>
        {items.map((item, i) => (
          <li key={i} style={{ fontSize: 12.5, color: "#4a5568", display: "flex", alignItems: "flex-start", gap: 8, lineHeight: 1.4 }}>
            <span style={{ width: 5, height: 5, borderRadius: "50%", background: isTemplate ? "#517B95" : "#EF7932", flexShrink: 0, marginTop: 5, display: "inline-block" }} />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

function AcceptBox({ title, rows }: { title: string; rows: [string, string][] }) {
  return (
    <div style={{ background: "#F2F4F5", border: "1px solid #e2e8f0", borderRadius: 10, padding: 20 }}>
      <div style={{ fontSize: 11, fontWeight: 700, color: "#517B95", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 14 }}>{title}</div>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12.5 }}>
        <tbody>
          {rows.map(([label, value]) => (
            <tr key={label}>
              <td style={{ padding: "5px 0", color: "#718096", width: "45%" }}>{label}</td>
              <td style={{ padding: "5px 0", fontWeight: 600, color: "#153454" }}>{value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function SignBox({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ background: "#F2F4F5", border: "1px solid #e2e8f0", borderRadius: 10, padding: 20 }}>
      <div style={{ fontSize: 11, fontWeight: 700, color: "#517B95", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 40 }}>{title}</div>
      <div style={{ borderTop: "1px solid #e2e8f0", paddingTop: 10 }}>{children}</div>
    </div>
  );
}
