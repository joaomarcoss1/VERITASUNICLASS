import { Award, BarChart3, BookOpen, CalendarClock, ClipboardList, CreditCard, FileCheck2, Home, Layers, Newspaper, Settings, Swords } from "lucide-react";

export const NAV_PRINCIPAL = [
  { href: "/inicio", numero: "I", label: "Início", icon: Home },
  { href: "/cursos", numero: "II", label: "Meus Cursos", icon: BookOpen },
  { href: "/questoes", numero: "III", label: "Questões", icon: ClipboardList },
  { href: "/simulados", numero: "IV", label: "Simulados", icon: Swords },
  { href: "/fixacao", numero: "V", label: "Fixação", icon: Layers },
  { href: "/rotina", numero: "VI", label: "Rotina", icon: CalendarClock },
  { href: "/desempenho", numero: "VII", label: "Desempenho", icon: BarChart3 },
  { href: "/insights", numero: "VIII", label: "Insights", icon: Newspaper },
] as const;

export const NAV_PERFIL = [
  { href: "/financeiro", numero: "A", label: "Financeiro", icon: CreditCard },
  { href: "/certificados", numero: "B", label: "Certificados", icon: FileCheck2 },
  { href: "/conquistas", numero: "C", label: "Conquistas", icon: Award },
  { href: "/configuracoes", numero: "D", label: "Configurações", icon: Settings },
] as const;

/** Barra inferior no celular: 5 destinos mais usados; o resto fica em "Mais". */
export const NAV_MOBILE = ["/inicio", "/questoes", "/rotina", "/desempenho"] as const;
