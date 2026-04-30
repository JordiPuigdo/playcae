import { NextRequest, NextResponse } from "next/server";

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
    const { email } = body;

    if (!email) {
      return NextResponse.json({ error: "Email requerido" }, { status: 400 });
    }

    const apiUrl = process.env.NEXT_PUBLIC_PLAYCAE_API;
    const response = await fetch(`${apiUrl}/api/web-inquiries/pricing`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: body.email,
        siteMode: body.siteMode,
        siteCount: body.siteCount,
        contractors: body.contractors,
        contractorWorkers: body.contractorWorkers,
        controlInternalWorkers: body.controlInternalWorkers,
        internalWorkers: body.internalWorkers,
        controlSuppliers: body.controlSuppliers,
        suppliersCount: body.suppliersCount,
        aiValidation: body.aiValidation,
        estimatedPrice: body.estimatedPrice,
        isCustom: body.isCustom,
        score: body.score,
      }),
    });

    if (!response.ok) {
      console.error("Error del backend al guardar lead de precios:", response.status);
      return NextResponse.json(
        { error: "Error al enviar el mensaje. Inténtalo de nuevo." },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Error enviando lead de pricing:", error);
    return NextResponse.json(
      { error: "Error al enviar el mensaje. Inténtalo de nuevo." },
      { status: 500 }
    );
  }
}
