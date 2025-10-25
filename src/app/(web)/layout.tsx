import { ReactNode } from "react";
import Header from "./components/landing/Header";
import Footer from "./components/landing/Footer";

// app/(web)/layout.tsx - Solo para sub-rutas de web
export default function WebLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      {children}
      <Footer />
    </div>
  );
}
