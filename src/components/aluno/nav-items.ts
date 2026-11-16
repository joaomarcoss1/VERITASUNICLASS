import { Award, BarChart3, BookOpen, CalendarClock, ClipboardList, CreditCard, FileCheck2, LayoutDashboard, Layers, Newspaper, Settings, Swords } from "lucide-react";

type Item = { href: string; label: string; icon: React.ComponentType<{ className?: string }> };

/** Menu agrupado pela tarefa do aluno (estudar → praticar → acompanhar → conta). */
export const NAV_GRUPOS: { titulo: string | null; itens: Item[] }[] = [
  { titulo: null, itens: [{ href: "/inicio", label: "Início", icon: LayoutDashboard }] },
  {
    titulo: "Estudar",
    itens: [
      { href: "/cursos", label: "Meus cursos", icon: BookOpen },
      { href: "/rotina", label: "Rotina", icon: CalendarClock },
    ],
  },
  {
    titulo: "Praticar",
    itens: [
      { href: "/questoes", label: "Questões", icon: ClipboardList },
      { href: "/simulados", label: "Simulados", icon: Swords },
      { href: "/fixacao", label: "Fixação", icon: Layers },
    ],
  },
  {
    titulo: "Acompanhar",
    itens: [
      { href: "/desempenho", label: "Desempenho", icon: BarChart3 },
      { href: "/insights", label: "Insights", icon: Newspaper },
      { href: "/certificados", label: "Certificados", icon: FileCheck2 },
      { href: "/conquistas", label: "Conquistas", icon: Award },
    ],
  },
  {
    titulo: "Conta",
    itens: [
      { href: "/financeiro", label: "Financeiro", icon: CreditCard },
      { href: "/configuracoes", label: "Configurações", icon: Settings },
    ],
  },
];

export const NAV_TODOS = NAV_GRUPOS.flatMap((g) => g.itens);

/** Barra inferior no celular: 4 destinos + "Menu". */
export const NAV_MOBILE = ["/inicio", "/questoes", "/rotina", "/desempenho"] as const;
