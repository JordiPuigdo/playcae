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
          "radial-gradient(1400px 700px at 5% 0%, rgba(21,52,84,.35), transparent 45%), radial-gradient(1400px 700px at 95% 100%, rgba(239,121,50,.30), transparent 45%)",
      }}
    >
      {/* Background */}
      <div
        className="absolute inset-0 bg-gradient-to-br from-playBlueDark/15 via-playGrey to-playOrange/15"
        aria-hidden="true"
      />
      <div className="pointer-events-none absolute -top-10 -left-32 h-[30rem] w-[30rem] rounded-full bg-playBlueDark/40 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -right-32 h-[35rem] w-[35rem] rounded-full bg-playOrange/50 blur-3xl" />
      <div className="pointer-events-none absolute top-1/3 right-1/4 h-80 w-80 rounded-full bg-playBlueLight/30 blur-3xl" />

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
