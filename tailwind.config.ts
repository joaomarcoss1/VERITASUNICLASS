import type { Config } from "tailwindcss";

/** Cores via variáveis CSS (globals.css) para alternar claro/escuro sem duplicar classes. */
const v = (name: string) => `rgb(var(--${name}) / <alpha-value>)`;

const config: Config = {
  darkMode: "class",
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Paleta oficial Veritas (fixa — usada em marca, certificados, telas institucionais)
        veritas: {
          tinta: "#0E1B2E",
          ouro: "#B8935A",
          "ouro-antigo": "#7A5C2B",
          pergaminho: "#F5F0E6",
          vinho: "#5E1A28",
          grafite: "#2A2D33",
          nevoa: "#D9D2C3",
        },
        // Tokens semânticos (mudam com o tema)
        fundo: v("fundo"),
        superficie: v("superficie"),
        "superficie-alta": v("superficie-alta"),
        texto: v("texto"),
        "texto-suave": v("texto-suave"),
        borda: v("borda"),
        primaria: v("primaria"),
        "primaria-texto": v("primaria-texto"),
        destaque: v("destaque"),
        "destaque-texto": v("destaque-texto"),
        premium: v("premium"),
        info: v("info"),
        acerto: v("acerto"),
        "acerto-suave": v("acerto-suave"),
        erro: v("erro"),
        "erro-suave": v("erro-suave"),
        revisar: v("revisar"),
        "revisar-suave": v("revisar-suave"),
      },
      fontFamily: {
        titulo: ["var(--font-titulo)"],
        sans: ["var(--font-texto)"],
      },
      fontSize: {
        // Leitura de enunciados: corpo maior e entrelinha generosa
        leitura: ["1.0625rem", { lineHeight: "1.75" }],
      },
      maxWidth: { leitura: "68ch" },
      boxShadow: {
        card: "0 1px 2px rgba(14,27,46,.06), 0 8px 24px rgba(14,27,46,.06)",
        selo: "0 0 0 1px rgba(184,147,90,.5), 0 8px 30px rgba(184,147,90,.18)",
      },
      borderRadius: { xl2: "1.125rem" },
      keyframes: {
        "sobe-fade": { from: { opacity: "0", transform: "translateY(6px)" }, to: { opacity: "1", transform: "none" } },
      },
      animation: { "sobe-fade": "sobe-fade .35s ease-out both" },
    },
  },
  plugins: [],
};

export default config;
