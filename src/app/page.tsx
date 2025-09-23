"use client";

import { Button } from "@/components/ui/Button";
import { Shield } from "lucide-react";
import ProblemSolutionSection from "./landing/ProblemSolutionSection";
import DocumentationSupported from "./landing/DocumentationSupported";
import WhyUs from "./landing/WhyUs";
import Footer from "./landing/Footer";
import Hero from "./landing/Hero";
import ContactSection from "./landing/Contact";

export default function Landing() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-white">
        <div className="container mx-auto flex items-center justify-between px-4 py-4">
          <div className="flex items-center space-x-2">
            <Shield className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold text-foreground">Play CAE</h1>
          </div>
          <nav className="flex items-center space-x-4">
            <a
              href="#how-it-works"
              className="text-black transition-colors hover:text-primary"
            >
              ¿Cómo funciona?
            </a>
            <a href="#contact">
              <Button variant="outline">Agenda una demo</Button>
            </a>

            <Button
              onClick={() => {
                window.open("/login", "_blank");
              }}
            >
              Login
            </Button>
          </nav>
        </div>
      </header>

      <Hero />
      <ProblemSolutionSection />
      <DocumentationSupported />
      <WhyUs />
      <ContactSection />
      <Footer />
    </div>
  );
}
