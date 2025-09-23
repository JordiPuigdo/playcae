import Hero from "./landing/Hero";
import ProblemSolutionSection from "./landing/ProblemSolutionSection";
import DocumentationSupported from "./landing/DocumentationSupported";
import WhyUs from "./landing/WhyUs";
import ContactSection from "./landing/Contact";
import Footer from "./landing/Footer";
import Header from "./landing/Header";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Hero />
      <ProblemSolutionSection />
      <DocumentationSupported />
      <WhyUs />
      <ContactSection />
      <Footer />
    </div>
  );
}
