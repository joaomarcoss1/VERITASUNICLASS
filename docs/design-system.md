# Design system — Veritas UniClass

## 1. Paleta oficial Veritas Group (inalterada)

Fonte: pacote de identidade visual (`03-Paleta-de-Cores`). Proporção de uso: **Tinta 60% · Pergaminho 25% · Ouro 10% · Vinho 5%**.

| Token | HEX | Uso no app |
|---|---|---|
| Azul Tinta | `#0E1B2E` | Menu, cabeçalhos, botão primário, área institucional |
| Ouro Veritas | `#B8935A` | Símbolo, filetes, anéis de progresso, botão "Iniciar sessão" — **nunca texto pequeno em fundo claro** |
| Ouro Antigo | `#7A5C2B` | Todo texto dourado em fundo claro (regra do manual) |
| Pergaminho | `#F5F0E6` | Certificados; diluído (`#FAF8F4`) em campos e linhas de lista |
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

## 4. Fundo, acabamento e interações

**Fundo branco editorial.** O tema claro usa branco puro (`#FFFFFF`) no fundo e nos cards; o Pergaminho fica reservado a certificados, campos de formulário e linhas de lista (`#FAF8F4`, pergaminho bem diluído). Bordas em névoa clareada (`#E6E1D6`).

**A marca como gravura, não como efeito.** O símbolo oficial aparece em traço fino (estrela + livro com as linhas das páginas), dentro de anéis de selo com régua de marcações, no canto superior direito — como papel timbrado. Onde o selo já aparece (faixa do painel, login, landing), a gravura é omitida para não repetir a marca.

**O que foi evitado de propósito** (são sinais de visual genérico ou "feito por IA"): manchas de luz desfocadas, partículas/estrelas espalhadas piscando, vidro fosco, texto em degradê animado, elementos flutuando sem motivo e sombras coloridas. Tudo é cor sólida, filete fino e sombra curta.

**Movimento só com propósito:**
- cards: ao passar o mouse, um filete dourado se abre no topo e a borda escurece levemente;
- botões e itens: reflexo discreto e leve afundar ao clicar;
- números contam ao abrir a tela; anéis, barras e colunas da semana se preenchem (o dia de hoje em tinta);
- entrada curta e escalonada dos blocos e transição entre telas;
- login: o selo acompanha suavemente o mouse;
- celebração com estrelas apenas ao concluir o onboarding; halo no botão de sessão de estudo.

Com `prefers-reduced-motion`, tudo isso é desligado.
