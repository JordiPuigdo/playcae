import Link from "next/link";
import type { Metadata } from "next";
import Header from "./(web)/components/landing/Header";
import Footer from "./(web)/components/landing/Footer";

export const metadata: Metadata = {
  title: "Página no encontrada | PlayCAE",
  description: "La página que buscas no existe. Vuelve al inicio o explora nuestros servicios.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header alwaysSolid />
      <main className="flex flex-1 flex-col items-center justify-center px-4 py-24 text-center">
        <p className="text-6xl font-bold text-brand-secondary mb-4">404</p>
        <h1 className="text-2xl font-bold text-brand-primary mb-3">
          Esta página no existe
        </h1>
        <p className="text-brand-accent max-w-md mb-8">
          Es posible que la dirección haya cambiado o que el enlace esté roto. No te preocupes, desde aquí puedes volver al inicio.
        </p>
        <Link
          href="/"
          className="rounded-full bg-brand-secondary px-8 py-3 font-semibold text-white shadow-md transition-all hover:bg-brand-secondary/90 hover:scale-[1.03]"
        >
          Volver al inicio
        </Link>
      </main>
      <Footer />
    </div>
  );
}
