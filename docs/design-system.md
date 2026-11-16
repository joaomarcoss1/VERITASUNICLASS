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

## 4. Veritas Academic — sistema de interface (versão atual)

Diagnóstico da versão anterior: metáforas demais (índice de livro, fitas, numerais romanos, molduras), ouro e bege dominando, paleta de disciplinas terrosa (marrons e vinhos muito parecidos) e cartões sem hierarquia. Resultado: aparência de "tema" e não de produto.

**Princípios**
1. A marca entra por **cor e assinatura**, não por ornamento: tinta no menu e na faixa de foco, ouro só em acento (item ativo, chamada principal, destaques), Cormorant só em momentos institucionais (login, landing, certificados).
2. **Estrutura de produto profissional**: menu lateral agrupado por tarefa (Estudar · Praticar · Acompanhar · Conta), barra superior com busca (Ctrl K), ação principal "Iniciar sessão", tema e alertas; cabeçalho de página padronizado (sobretítulo, título, descrição, ações).
3. **Hierarquia do painel**: 4 indicadores-chave → faixa de foco (retomar aula / começar sessão) → missão do dia → análises (tempo, matérias, linha do tempo) → domínio por disciplina → mercado.
4. **Dados primeiro**: números em Inter tabular; tabela de domínio ordenada da mais fraca para a mais forte, com estado (Fraco / Em evolução / Dominado) sempre em texto + cor.

**Tokens**: branco; cinzas frios derivados da tinta (`#101828` texto, `#576376` texto suave, `#E4E7EC` borda, `#F6F7F9` faixa); azul de link `#275EC4`; estados verde/âmbar/vermelho com fundos suaves. Raio: 8px (controles), 12px (cards). Sombra única e curta.

**Tipografia**: Inter (variável) para toda a interface; Cormorant Garamond para a assinatura VERITAS e títulos institucionais; Montserrat reservada à marca.

**Paleta das disciplinas** — validada com o validador do skill de visualização de dados (faixa de luminosidade, croma, separação para daltonismo ≥ 8 ΔE e visão normal ≥ 15 ΔE, contraste), com passos próprios para o modo escuro. Exposta como variáveis CSS `--disc-<id>` que trocam sozinhas com o tema. Texto nunca usa a cor da série: chips têm fundo tingido, ponto colorido e texto em tinta.

| Disciplina | Claro | Escuro |
|---|---|---|
| Português | `#2F6FDB` | `#4D86EA` |
| Dir. Constitucional | `#D2504F` | `#E0625F` |
| Raciocínio Lógico | `#14968A` | `#1FA898` |
| Dir. Administrativo | `#E0A23A` | `#C08626` |
| Informática | `#7357D6` | `#8B74E6` |
| Dir. Penal | `#3A9A4A` | `#3E9C4E` |

**Gráficos** (especificações do skill de dataviz): magnitude em um só tom (cinza; o dia selecionado em tinta), identidade por disciplina só onde há divisão por matéria; colunas com cantos de 4px apenas na ponta, 2px de respiro entre segmentos empilhados, grade e eixos discretos, tooltip ao passar o mouse, legenda sempre presente e destaque da série ao passar o mouse na legenda.

**Movimento**: entradas curtas e escalonadas, contadores, preenchimento de barras e colunas, controle segmentado deslizante. Desligado com `prefers-reduced-motion`.
