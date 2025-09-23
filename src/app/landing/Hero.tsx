"use client";

import HeroHeader from "@/components/HeroHeader";
import HeroMock from "@/components/HeroMock";
import HeroStats from "@/components/HeroStats";
import { motion } from "framer-motion";

const Hero = () => {
  return (
    <section
      className="relative overflow-hidden"
      aria-labelledby="hero-title"
      style={{
        backgroundImage:
          "radial-gradient(1200px 500px at 10% 0%, rgba(59,130,246,.08), transparent 60%), radial-gradient(1200px 500px at 100% 100%, rgba(34,211,238,.10), transparent 60%)",
      }}
    >
      {/* Background */}
      <div
        className="absolute inset-0 bg-gradient-to-br from-sky-50 to-cyan-50"
        aria-hidden="true"
      />
      <div className="pointer-events-none absolute top-24 -left-16 h-72 w-72 rounded-full bg-blue-200/30 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-10 -right-10 h-80 w-80 rounded-full bg-cyan-200/40 blur-3xl" />

      {/* Content */}
      <motion.div
        className="container relative z-10 mx-auto flex flex-col items-center gap-10 px-4 py-12 lg:flex-row lg:gap-16 lg:py-24"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        <div className="flex flex-col items-start">
          <HeroHeader />
          <HeroStats />
        </div>
        <HeroMock />
      </motion.div>

      {/* Wave bottom */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 -z-0">
        <svg
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          className="relative block h-20 w-full"
        >
          <path
            d="M0,120 C300,20 900,200 1200,40 L1200,120 L0,120 Z"
            className="fill-white"
          />
        </svg>
      </div>
    </section>
  );
};

export default Hero;
