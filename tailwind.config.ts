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
        "sobe-fade": { from: { opacity: "0", transform: "translateY(10px)" }, to: { opacity: "1", transform: "none" } },
        flutua: { "0%,100%": { transform: "translate3d(0,0,0)" }, "50%": { transform: "translate3d(0,-14px,0)" } },
        cintila: { "0%,100%": { opacity: ".15", transform: "scale(.7)" }, "50%": { opacity: "1", transform: "scale(1)" } },
        respira: { "0%,100%": { opacity: ".55", transform: "scale(1)" }, "50%": { opacity: ".9", transform: "scale(1.06)" } },
        gira: { to: { transform: "rotate(360deg)" } },
        "gira-reverso": { to: { transform: "rotate(-360deg)" } },
        halo: { "0%": { transform: "scale(1)", opacity: ".55" }, "100%": { transform: "scale(1.6)", opacity: "0" } },
        reflexo: { "0%": { transform: "translateX(-120%) skewX(-20deg)" }, "100%": { transform: "translateX(220%) skewX(-20deg)" } },
        "brilho-texto": { "0%": { backgroundPosition: "200% 50%" }, "100%": { backgroundPosition: "-200% 50%" } },
        aurora: { "0%,100%": { transform: "translate3d(0,0,0) scale(1)" }, "33%": { transform: "translate3d(4%,-3%,0) scale(1.08)" }, "66%": { transform: "translate3d(-3%,4%,0) scale(.96)" } },
        "estrela-sobe": { "0%": { opacity: "0", transform: "translate3d(0,0,0) scale(.4)" }, "15%": { opacity: "1" }, "100%": { opacity: "0", transform: "translate3d(var(--dx),var(--dy),0) scale(1)" } },
        "check-pop": { "0%": { transform: "scale(.4)" }, "60%": { transform: "scale(1.15)" }, "100%": { transform: "scale(1)" } },
        cresce: { from: { transform: "scaleY(0)" }, to: { transform: "scaleY(1)" } },
        "linha-desenha": { from: { strokeDashoffset: "var(--comprimento)" }, to: { strokeDashoffset: "0" } },
      },
      animation: {
        "sobe-fade": "sobe-fade .5s cubic-bezier(.2,.7,.2,1) both",
        flutua: "flutua 9s ease-in-out infinite",
        "flutua-lento": "flutua 16s ease-in-out infinite",
        cintila: "cintila 4s ease-in-out infinite",
        respira: "respira 6s ease-in-out infinite",
        "gira-lento": "gira 90s linear infinite",
        "gira-medio": "gira 40s linear infinite",
        "gira-reverso": "gira-reverso 60s linear infinite",
        halo: "halo 2.4s cubic-bezier(.2,.7,.2,1) infinite",
        reflexo: "reflexo 1.1s ease-out",
        "brilho-texto": "brilho-texto 6s linear infinite",
        aurora: "aurora 28s ease-in-out infinite",
        "estrela-sobe": "estrela-sobe 1.6s ease-out forwards",
        "check-pop": "check-pop .45s cubic-bezier(.2,.7,.2,1) both",
        cresce: "cresce .9s cubic-bezier(.2,.7,.2,1) both",
      },
      transitionTimingFunction: { premium: "cubic-bezier(.2,.7,.2,1)" },
    },
  },
  plugins: [],
};

export default config;
