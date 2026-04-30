import { NextRequest, NextResponse } from "next/server";

interface ContactFormData {
  name: string;
  email: string;
  message: string;
}

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

export async function POST(request: NextRequest) {
  try {
    const body: ContactFormData = await request.json();
    const { name, email, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json(
        { message: "Todos los campos son obligatorios" },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { message: "Formato de email inválido" },
        { status: 400 }
      );
    }

    const emailDomain = email.split("@")[1]?.toLowerCase();
    if (!emailDomain || personalDomains.has(emailDomain)) {
      return NextResponse.json(
        { message: "Por favor, usa un email corporativo. No se aceptan correos de Gmail, Hotmail, Outlook, Yahoo u otros proveedores personales." },
        { status: 422 }
      );
    }

    const apiUrl = process.env.NEXT_PUBLIC_PLAYCAE_API;
    const response = await fetch(`${apiUrl}/api/web-inquiries/contact`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, message }),
    });

    if (!response.ok) {
      console.error("Error del backend al guardar contacto:", response.status);
      return NextResponse.json(
        { message: "Error al enviar el mensaje. Inténtalo de nuevo." },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: true, message: "Mensaje enviado correctamente" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error enviando contacto:", error);
    return NextResponse.json(
      { message: "Error al enviar el mensaje. Inténtalo de nuevo." },
      { status: 500 }
    );
  }
}
