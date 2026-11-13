# Design system — Veritas UniClass

## 1. Paleta oficial Veritas Group (inalterada)

Fonte: pacote de identidade visual (`03-Paleta-de-Cores`). Proporção de uso: **Tinta 60% · Pergaminho 25% · Ouro 10% · Vinho 5%**.

| Token | HEX | Uso no app |
|---|---|---|
| Azul Tinta | `#0E1B2E` | Menu, cabeçalhos, botão primário, área institucional |
| Ouro Veritas | `#B8935A` | Símbolo, filetes, anéis de progresso, botão "Iniciar sessão" — **nunca texto pequeno em fundo claro** |
| Ouro Antigo | `#7A5C2B` | Todo texto dourado em fundo claro (regra do manual) |
| Pergaminho | `#F5F0E6` | Fundo geral do modo claro, certificados |
| Vinho Editorial | `#5E1A28` | Premium, listel do selo, etiquetas editoriais |
| Grafite | `#2A2D33` | Texto corrido |
| Névoa | `#D9D2C3` | Bordas e divisores |

Fontes oficiais servidas localmente (OFL): **Cormorant Garamond** (títulos institucionais) e **Montserrat** (interface).

> O prompt original citava `#0E1F3D` / `#C9A227` / Cinzel + Inter. Prevalece o manual da marca: os valores acima.

## 2. Extensão acadêmica (o que foi acrescentado)

Tudo derivado da paleta oficial — mesma temperatura "editorial", sem cores de "app genérico".

1. **Feedback de questão** — *Louro* `#2F6B3F` (acerto) e *Lacre* `#A3262F` (erro), com fundos suaves. O Lacre é propositalmente mais vivo que o Vinho, para que "erro" nunca se confunda com "premium". Acerto/erro **sempre** acompanham ícone (✓/✕) — legível para daltônicos.
2. **Revisar / atenção** — Ouro Antigo sobre `#F1E6CF`: questão marcada para revisão, sequência em risco.
3. **Escala de domínio (5 passos)** — Lacre → terracota → ouro → oliva → Louro, com as mesmas fronteiras da classificação *Fraco (<50) / Em evolução (50–74) / Dominado (≥75)*. Usada no mapa de calor e nos indicadores de disciplina.
4. **Cor por disciplina** — 8 tons foscos (Português azul, Constitucional vinho, Administrativo ouro antigo, Rac. Lógico verde-petróleo…) para o aluno reconhecer a matéria antes de ler. Todas com contraste AA para texto branco.
5. **"Biblioteca noturna" (modo escuro)** — fundo tinta, texto pergaminho e ouro clareado `#D1AE74`; no escuro a ação primária vira ouro. Pensado para quem estuda à noite.
6. **Tipografia de leitura** — classe `text-leitura` (17px / 1.75) e largura máxima de 68 caracteres para enunciados e textos longos; números de estatística com algarismos tabulares (`.num`) para não "pularem" ao atualizar.
7. **Selo heráldico UniClass** — escudo com coroa mural, filete duplo dourado, monograma VU e listel *VERITAS · SCIENTIA · VICTORIA*. O **símbolo oficial fica intacto dentro do escudo** (o manual proíbe redesenhar/recolorir o logo); o escudo é moldura para certificados, conquistas e login.
8. **Acessibilidade** — foco visível dourado, `prefers-reduced-motion` respeitado, alvos de toque ≥ 44px, todos os pares texto/fundo verificados.

Os pares de contraste estão em `contrastPairs` (`src/lib/design/tokens.ts`) e são testados em `tokens.test.ts` — mudar uma cor que quebre AA falha o `npm test`.

## 3. Aplicação

- Telas do dia a dia: leves (pergaminho + cards "papel"), tinta só no menu.
- Solenidade (Cormorant, selo, filetes): login, certificados, conquistas, títulos de página.
- Logo: tamanho mínimo do símbolo 24px; não distorcer, girar, recolorir ou aplicar sombra.
