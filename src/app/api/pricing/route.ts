import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

interface PricingLeadData {
  email: string;
  siteMode: "single" | "multiple";
  siteCount: number;
  contractors: number;
  contractorWorkers: number;
  controlInternalWorkers: boolean;
  internalWorkers: number;
  controlSuppliers: boolean;
  suppliersCount: number;
  aiValidation: boolean;
  estimatedPrice: number;
  isCustom: boolean;
  score: number;
}

export async function POST(request: NextRequest) {
  try {
    const body: PricingLeadData = await request.json();
    const {
      email,
      siteMode,
      siteCount,
      contractors,
      contractorWorkers,
      controlInternalWorkers,
      internalWorkers,
      controlSuppliers,
      suppliersCount,
      aiValidation,
      estimatedPrice,
      isCustom,
      score,
    } = body;

    if (!email) {
      return NextResponse.json({ error: "Email requerido" }, { status: 400 });
    }

    const resend = new Resend(process.env.RESEND_API_KEY);

    const priceDisplay = isCustom
      ? "Precio personalizado (volumen enterprise)"
      : `EUR ${estimatedPrice}/mes`;

    const tier =
      score < 220
        ? "Pequeña operación"
        : score < 520
          ? "Operación media"
          : score < 900
            ? "Operación grande"
            : "Enterprise";

    const { error } = await resend.emails.send({
      from: "PlayCAE <onboarding@resend.dev>",
      to: "playcae2025@gmail.com",
      replyTo: email,
      subject: `[Estimador Precios] Lead de ${email}`,
      html: `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #0D1B2A, #1B3A4B); color: white; padding: 20px; border-radius: 8px 8px 0 0; }
    .content { background: #f9f9f9; padding: 20px; border: 1px solid #ddd; border-top: none; border-radius: 0 0 8px 8px; }
    table { width: 100%; border-collapse: collapse; margin-top: 12px; }
    th, td { text-align: left; padding: 10px 12px; border-bottom: 1px solid #e0e0e0; }
    th { color: #0D1B2A; font-weight: bold; width: 55%; }
    .price-box { background: #fff; border-left: 4px solid #FF6B35; padding: 14px 16px; margin-top: 20px; border-radius: 4px; }
    .price-box .label { color: #666; font-size: 13px; }
    .price-box .value { font-size: 22px; font-weight: bold; color: #0D1B2A; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h2 style="margin: 0;">Nuevo lead del estimador de precios</h2>
    </div>
    <div class="content">
      <p><strong>Email corporativo:</strong> <a href="mailto:${email}">${email}</a></p>

      <table>
        <tr><th>Pregunta</th><th>Respuesta</th></tr>
        <tr>
          <td>Sedes</td>
          <td>${siteMode === "multiple" ? `Varias (${siteCount})` : "Una sede"}</td>
        </tr>
        <tr>
          <td>Empresas contratistas</td>
          <td>${contractors}</td>
        </tr>
        <tr>
          <td>Trabajadores de contratas</td>
          <td>${contractorWorkers}</td>
        </tr>
        <tr>
          <td>Control trabajadores internos</td>
          <td>${controlInternalWorkers ? `Sí (${internalWorkers})` : "No"}</td>
        </tr>
        <tr>
          <td>Control proveedores</td>
          <td>${controlSuppliers ? `Sí (${suppliersCount})` : "No"}</td>
        </tr>
        <tr>
          <td>Validación con IA</td>
          <td>${aiValidation ? "Sí" : "No"}</td>
        </tr>
      </table>

      <div class="price-box">
        <div class="label">Tier estimado: ${tier}</div>
        <div class="value">${priceDisplay}</div>
        <div class="label" style="margin-top:4px">Score interno: ${Math.round(score)}</div>
      </div>
    </div>
  </div>
</body>
</html>
      `.trim(),
    });

    if (error) {
      console.error("Error de Resend (pricing):", error);
      console.error("Detalles completos del error:", JSON.stringify(error, null, 2));
      return NextResponse.json(
        { error: "Error al enviar el mensaje. Inténtalo de nuevo.", resendError: error },
        { status: 500 }
      );
    }

    console.log("Email de pricing enviado exitosamente");
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Error enviando email de pricing:", error);
    console.error("Tipo de error:", typeof error);
    console.error("Error completo:", JSON.stringify(error, Object.getOwnPropertyNames(error), 2));
    if (error instanceof Error) {
      console.error("Error.message:", error.message);
      console.error("Error.stack:", error.stack);
    }
    return NextResponse.json(
      {
        error: "Error al enviar el mensaje. Inténtalo de nuevo.",
        catchError: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
