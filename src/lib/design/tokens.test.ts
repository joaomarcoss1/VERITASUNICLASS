import { describe, expect, it } from "vitest";
import { contrastPairs, contrastRatio, corDominio, academic } from "./tokens";

describe("paleta Veritas + extensão acadêmica", () => {
  it.each(contrastPairs)("$nome atinge WCAG AA", ({ texto, fundo, minimo }) => {
    expect(contrastRatio(texto, fundo)).toBeGreaterThanOrEqual(minimo);
  });

  it("escala de domínio cobre 0–100 nas pontas", () => {
    expect(corDominio(0)).toBe(academic.dominio[0]);
    expect(corDominio(100)).toBe(academic.dominio[4]);
    expect(corDominio(55)).toBe(academic.dominio[2]);
    // Mesma fronteira da classificação Fraco/Em evolução/Dominado
    expect(corDominio(49)).toBe(academic.dominio[1]);
    expect(corDominio(74)).toBe(academic.dominio[3]);
    expect(corDominio(75)).toBe(academic.dominio[4]);
  });
});
