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

## 4. Linguagem visual: o livro acadêmico

Em vez da estética de painel SaaS (menu escuro, cards arredondados com ícone em quadradinho), a interface usa a linguagem de um **livro encadernado** — o objeto que melhor representa estudo.

- **Fundo**: branco puro, com o **símbolo Veritas colorido** (estrela em ouro, livro em ouro translúcido com as linhas das páginas) grande e centralizado na área de conteúdo, dentro de anéis de selo — papel timbrado da Academia. Os cards são 92% opacos, então o símbolo aparece sutilmente através deles.
- **Menu = Índice**: numeração romana (I–VIII) para os módulos e letras (A–D) para os "Apêndices" (financeiro, certificados, conquistas, configurações); títulos em Cormorant; linha pontilhada até o ícone, como no sumário de um livro. Na borda esquerda, uma **lombada** azul tinta com nervuras douradas. O item ativo ganha uma **fita marcadora vinho** saindo pela borda.
- **Ex libris**: o rodapé do índice é o "selo de dono do livro", com o símbolo e o nome do aluno.
- **Cards = pranchas**: cantos quase retos (6px), **moldura dupla** interna em ouro, cabeçalho com numeral romano + título em serifa + filete (curto em ouro, longo em névoa). Os blocos do painel seguem a ordem I a VII. Ao passar o mouse, um filete de ouro corre no topo.
- **Missão do dia**: a prancha recebe uma **fita marcadora**; os itens são entradas numeradas (01, 02…) com uma lombada fina na cor da disciplina e o tempo em serifa.
- **Capa**: a abertura do painel é a capa do livro — azul tinta, moldura dupla dourada com **cantoneiras**, data em versalete, saudação em Cormorant com o nome em itálico dourado e o símbolo em ouro dentro de um selo.
- **Algarismos**: números de destaque em Cormorant (algarismos de texto, típicos de livro), dados de tabela em Montserrat tabular.
- **Botões**: cantos de 4px; o primário tem um filete dourado interno, como douração de capa.

Movimento só com propósito: contadores, preenchimento de anéis e barras, entradas curtas, fita do índice deslizando para o item ativo, filete dourado no hover. Com `prefers-reduced-motion`, tudo é desligado.

**Evitado de propósito**: manchas de luz desfocadas, partículas, vidro fosco, texto em degradê, ícones em quadradinhos coloridos e cantos muito arredondados — marcas de interface genérica.

## 5. Painel de estudo (referência: apps de acompanhamento de estudo)

Elementos funcionais trazidos de apps de rotina de estudo e reinterpretados na identidade Veritas:

- **Começar agora** (dentro da capa): matéria → conteúdo → **Iniciar**. Abre o cronômetro Pomodoro já com matéria e conteúdo (evento `vu:iniciar-sessao`).
- **Últimos 7 dias**: pílulas de dia (o selecionado em tinta), relógio `H:MM:SS` do dia, colunas em cápsula douradas com linha de meta; o dia escolhido abre em segmentos por disciplina; comparativo com a semana anterior.
- **Matérias mais estudadas**: controle segmentado Hoje / Semana / Mês com indicador deslizante, faixa de participação, cartões por disciplina (tempo, % do período, média por dia) e ranking com barras.
- **Linha do tempo**: colunas empilhadas por disciplina, escalas Semana/Mês, navegação ‹ › entre períodos, total do período e legenda com tempo e %; passar o mouse numa disciplina destaca só ela no gráfico.
- **Atividades recentes**: linha do tempo vertical agrupada em Hoje / Ontem / Há N dias, com tipo, duração e acerto colorido.

Os cards voltaram a ter cantos generosos (20px) e um selo tinta com ícone em ouro no cabeçalho; ao passar o mouse sobem levemente e ganham um filete tinta→ouro→vinho no topo. Números e relógios em Montserrat tabular; Cormorant fica para saudações e títulos institucionais. As agregações estão em `src/lib/services/estudo.ts` (testadas).
