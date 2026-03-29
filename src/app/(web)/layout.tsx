import { ReactNode } from "react";
import Header from "./components/landing/Header";
import Footer from "./components/landing/Footer";
import TagManager from "./components/TagManage";
import Script from "next/script";

// app/(web)/layout.tsx - Solo para sub-rutas de web
export default function WebLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <Script id="microsoft-clarity" strategy="beforeInteractive">
        {`
          (function(c,l,a,r,i,t,y){
              c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
              t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
              y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
          })(window, document, "clarity", "script", "w2xe73oiwh");
        `}
      </Script>
      <Header />
      <TagManager />
      {children}
      <Footer />
    </div>
  );
}
