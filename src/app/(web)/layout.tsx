import { ReactNode } from "react";
import Header from "./components/landing/Header";
import Footer from "./components/landing/Footer";
import TagManager from "./components/TagManage";
import ClarityScript from "./components/ClarityScript";
import CookieBanner from "./components/CookieBanner";

// app/(web)/layout.tsx - Solo para sub-rutas de web
export default function WebLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <ClarityScript />
      <Header />
      <TagManager />
      {children}
      <Footer />
      <CookieBanner />
    </div>
  );
}
