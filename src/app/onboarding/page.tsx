import type { Metadata } from "next";
import { AREAS, DISCIPLINAS, EDITAIS } from "@/lib/catalog";
import { OnboardingWizard } from "@/components/onboarding/wizard";

export const metadata: Metadata = { title: "Primeiros passos" };

export default function OnboardingPage() {
  return <OnboardingWizard areas={AREAS} editais={EDITAIS} disciplinas={DISCIPLINAS.map((d) => ({ id: d.id, nome: d.nome, curto: d.curto }))} />;
}
