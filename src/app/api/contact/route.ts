import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

interface ContactFormData {
  name: string;
  email: string;
  message: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: ContactFormData = await request.json();
    const { name, email, message } = body;

    // Validación básica
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Todos los campos son obligatorios" },
        { status: 400 }
      );
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Formato de email inválido" },
        { status: 400 }
      );
    }

    // Solo emails corporativos
    const personalDomains = new Set([
      "gmail.com", "googlemail.com",
      "hotmail.com", "hotmail.es", "hotmail.co.uk",
      "outlook.com", "outlook.es",
      "live.com", "live.es",
      "msn.com",
      "yahoo.com", "yahoo.es", "yahoo.co.uk",
      "ymail.com",
      "icloud.com", "me.com", "mac.com",
      "aol.com",
      "mail.com", "gmx.com", "gmx.es",
      "protonmail.com", "proton.me",
      "tutanota.com",
    ]);
    const emailDomain = email.split("@")[1]?.toLowerCase();
    if (!emailDomain || personalDomains.has(emailDomain)) {
      return NextResponse.json(
        { error: "Por favor, usa un email corporativo. No se aceptan correos de Gmail, Hotmail, Outlook, Yahoo u otros proveedores personales." },
        { status: 422 }
      );
    }

    // Inicializar Resend
    const resend = new Resend(process.env.RESEND_API_KEY);

    // Enviar email con Resend
    const { data, error } = await resend.emails.send({
      from: "PlayCAE <onboarding@resend.dev>",
      to: "playcae2025@gmail.com",
      replyTo: email,
      subject: `[Contacto Web] Mensaje de ${name}`,
      html: `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #0D1B2A, #1B3A4B); color: white; padding: 20px; border-radius: 8px 8px 0 0; }
    .content { background: #f9f9f9; padding: 20px; border: 1px solid #ddd; border-top: none; border-radius: 0 0 8px 8px; }
    .field { margin-bottom: 15px; }
    .label { font-weight: bold; color: #0D1B2A; }
    .message { background: white; padding: 15px; border-radius: 4px; border-left: 4px solid #FF6B35; margin-top: 10px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h2 style="margin: 0;">📬 Nuevo mensaje de contacto</h2>
    </div>
    <div class="content">
      <div class="field">
        <span class="label">Nombre:</span> ${name}
      </div>
      <div class="field">
        <span class="label">Email:</span> <a href="mailto:${email}">${email}</a>
      </div>
      <div class="field">
        <span class="label">Mensaje:</span>
        <div class="message">${message.replace(/\n/g, "<br>")}</div>
      </div>
    </div>
  </div>
</body>
</html>
      `.trim(),
    });

    if (error) {
      console.error("Error de Resend:", error);
      console.error("Detalles completos del error:", JSON.stringify(error, null, 2));
      return NextResponse.json(
        { error: "Error al enviar el mensaje. Inténtalo de nuevo." },
        { status: 500 }
      );
    }

    console.log("Email enviado exitosamente:", data);
    return NextResponse.json(
      { success: true, message: "Mensaje enviado correctamente", data },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error enviando email:", error);
    console.error("Tipo de error:", typeof error);
    console.error("Error completo:", JSON.stringify(error, Object.getOwnPropertyNames(error), 2));
    if (error instanceof Error) {
      console.error("Error.message:", error.message);
      console.error("Error.stack:", error.stack);
    }
    return NextResponse.json(
      { error: "Error al enviar el mensaje. Inténtalo de nuevo." },
      { status: 500 }
    );
  }
}
