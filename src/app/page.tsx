"use client";

import { Button } from "@/components/ui/Button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { CheckCircle, Users, Shield, Clock } from "lucide-react";
import ProblemSolutionSection from "./landing/ProblemSolutionSection";
import DocumentationSupported from "./landing/DocumentationSupported";
import WhyUs from "./landing/WhyUs";
import Footer from "./landing/Footer";
import Hero from "./landing/Hero";

export default function Landing() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Shield className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold text-foreground">Play CAE</h1>
          </div>
          <nav className="flex space-x-4">
            <Button variant="outline">Agenda una demo</Button>

            <Button>Login</Button>
          </nav>
        </div>
      </header>
      <Hero />
      <ProblemSolutionSection />
      <DocumentationSupported />
      <WhyUs />
      <Footer />
    </div>
  );
}
