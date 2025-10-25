"use client";

import React from "react";
import { motion } from "framer-motion";

const ContactSection: React.FC = () => {
  return (
    <section
      id="contact"
      className="relative overflow-hidden py-24"
      aria-labelledby="contact-title"
    >
      {/* Fondo degradado y blobs decorativos */}
      <div
        className="absolute inset-0 bg-gradient-to-br from-sky-50 to-cyan-50"
        aria-hidden="true"
      />
      <div
        className="absolute top-20 left-10 h-72 w-72 rounded-full bg-blue-200/30 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="absolute -bottom-20 -right-10 h-80 w-80 rounded-full bg-cyan-200/40 blur-3xl"
        aria-hidden="true"
      />

      <div className="container relative z-10 mx-auto px-4">
        {/* Cabecera */}
        <motion.div
          className="mx-auto mb-16 max-w-2xl text-center"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <h2
            id="contact-title"
            className="text-4xl font-bold text-gray-900 md:text-5xl"
          >
            ¿Hablamos?
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Agenda una demo personalizada o escríbenos para resolver tus dudas.
            Nuestro equipo te acompañará en todo el proceso.
          </p>
        </motion.div>

        {/* Grid principal */}
        <motion.div
          className="mx-auto grid max-w-5xl grid-cols-1 gap-10 rounded-2xl border border-gray-200 bg-white p-8 shadow-xl md:grid-cols-2"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          {/* Formulario */}
          <form className="space-y-6">
            <div>
              <label
                htmlFor="name"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                Nombre
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 shadow-sm focus:border-cyan-500 focus:ring focus:ring-cyan-500/30"
              />
            </div>
            <div>
              <label
                htmlFor="email"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                Correo electrónico
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 shadow-sm focus:border-cyan-500 focus:ring focus:ring-cyan-500/30"
              />
            </div>
            <div>
              <label
                htmlFor="message"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                Mensaje
              </label>
              <textarea
                id="message"
                name="message"
                rows={4}
                required
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 shadow-sm focus:border-cyan-500 focus:ring focus:ring-cyan-500/30"
              ></textarea>
            </div>
            <button
              type="submit"
              className="w-full rounded-full bg-gradient-to-r from-blue-600 to-cyan-600 px-6 py-3 font-semibold text-white shadow-lg transition-transform hover:scale-[1.02] hover:from-blue-700 hover:to-cyan-700 focus:outline-none focus-visible:ring focus-visible:ring-cyan-500/50"
            >
              Enviar mensaje
            </button>
          </form>

          {/* Info de contacto */}
          <div className="flex flex-col justify-center space-y-8">
            <div>
              <h3 className="text-xl font-semibold text-gray-900">
                Información de contacto
              </h3>
              <p className="mt-2 text-gray-600">
                También puedes escribirnos directamente o llamarnos:
              </p>
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9h3.5a2.5 2.5 0 000-5H16z"
                    />
                  </svg>
                </div>
                <span className="text-gray-700">soporte@playcae.ai</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-cyan-100 text-cyan-600">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 5h2l3.6 7.59-1.35 2.45A2 2 0 009 17h9a2 2 0 001.8-1.1l3.24-6.48A1 1 0 0022 8h-6.31l-1.95-3.9A1 1 0 0013 4H6a1 1 0 00-1 1z"
                    />
                  </svg>
                </div>
                <span className="text-gray-700">+34 600 123 456</span>
              </div>
            </div>
            <div>
              <p className="text-gray-600">
                Responderemos en menos de 24 horas 🚀
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ContactSection;
