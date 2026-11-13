import { Award, BarChart3, BookOpen, CalendarClock, ClipboardList, CreditCard, FileCheck2, Home, Layers, Newspaper, Settings, Swords } from "lucide-react";

export const NAV_PRINCIPAL = [
  { href: "/inicio", label: "Início", icon: Home },
  { href: "/cursos", label: "Meus Cursos", icon: BookOpen },
  { href: "/questoes", label: "Questões", icon: ClipboardList },
  { href: "/simulados", label: "Simulados", icon: Swords },
  { href: "/fixacao", label: "Fixação", icon: Layers },
  { href: "/rotina", label: "Rotina", icon: CalendarClock },
  { href: "/desempenho", label: "Desempenho", icon: BarChart3 },
  { href: "/insights", label: "Insights", icon: Newspaper },
] as const;

export const NAV_PERFIL = [
  { href: "/financeiro", label: "Financeiro", icon: CreditCard },
  { href: "/certificados", label: "Certificados", icon: FileCheck2 },
  { href: "/conquistas", label: "Conquistas", icon: Award },
  { href: "/configuracoes", label: "Configurações", icon: Settings },
] as const;

/** Barra inferior no celular: 5 destinos mais usados; o resto fica em "Mais". */
export const NAV_MOBILE = ["/inicio", "/questoes", "/rotina", "/desempenho"] as const;
