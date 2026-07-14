# Changelog

## 0.1.2.0 — 2026-07-14

### Changed
- **Tema escuro premium ("Meia-Noite") em todo o app**: fundo carvão profundo com brilho âmbar no topo, cartões de vidro (glass) com desfoque e borda sutil, texto branco de alto contraste com cinzas suaves para hierarquia. O acento passa a ser um único gradiente âmbar→laranja, com o vermelho reservado para o brilho da chama.
- **Tipografia**: numerais e títulos de destaque agora usam *Space Grotesk*; *Inter* segue no corpo de texto.
- **Tela de streak do onboarding** redesenhada no estilo "Meia-Noite": anel gradiente luminoso ao redor da chama, pips diários com gradiente e brilho, e o número da sequência em gradiente âmbar.
- Botões principais (CTA), FAB, pílula de segmento ativa, toggles e barras de progresso adotaram o gradiente âmbar; anéis de meta, gráfico semanal e chips foram ajustados para o fundo escuro.
- Os três slides do onboarding ganharam brilhos de fundo coloridos por slide (âmbar → laranja → verde) com crossfade suave, além de um orbe de luz que flutua atrás da ilustração.

### Added
- Animação de transição entre os slides do onboarding: o slide sai com desfoque e leve zoom, o novo entra com mola (spring) na direção correta, e o conteúdo aparece em parallax escalonado (ilustração, título e subtítulo em sequência). Os pontos de paginação agora são clicáveis. A saída do onboarding para o app usa desfoque + zoom com entrada em mola.

## 0.1.1.0 — 2026-07-10

### Changed
- **App traduzido para português (pt-BR)**: the entire interface is now in Brazilian Portuguese — onboarding slides and CTAs, tab bar (Início / Estante / Perfil), Home dashboard (saudação "Bom dia/Boa tarde/Boa noite", metas, gráfico semanal), shelf filters (Todos / Lendo / Quero ler / Lidos), add-book and settings sheets, achievements, and all accessibility labels (aria-labels, placeholders).
- Dates and numbers now format with the pt-BR locale (e.g. "1.234 páginas", "10 de jul."), via a single shared `APP_LOCALE` constant.
- Weekly chart day letters follow the Portuguese convention (D S T Q Q S S) and each bar shows the full day name on hover and to screen readers.
- The document language is `pt-BR` and the page title is "EasyReads — Acompanhe cada livro".

### Fixed
- Books and profile saved by the previous English version migrate once to the new storage format: the default name "Reader" becomes "Leitor" and "Unknown author" becomes "Autor desconhecido", without ever rewriting names the user typed themselves.
- Corrupted saved data (non-array book lists, null entries) no longer risks wiping the library on load — invalid entries are filtered out and the previous save is kept as a backup.
- The "Dia seguido / Dias seguidos" stat now uses the correct singular/plural form.
- Long Portuguese labels no longer break layouts: segmented filter buttons never wrap, the profile note stays centered when it wraps, and settings rows keep a gap between text and the toggle.
- The onboarding goal ring now shows the current year instead of a hardcoded one.

## 0.1.0.0 — 2026-07-10

First release of EasyReads, a book-tracking app (Vite + React 19 + TypeScript + Bun, animated with `motion`).

### Added
- **Onboarding**: 3 animated pre-signup screens in the Cal AI style (cover-scan demo, streak calendar, yearly goal ring) with swipe navigation, progress segments, skip/back, and "Get started" / "Continue as guest" CTAs. Completion is remembered in localStorage.
- **Home dashboard**: greeting header with streak pill, yearly goal progress ring, daily page-goal card with live progress, "Currently reading" carousel with +10 pages / Finish quick actions, weekly pages bar chart, finished-books shelf, and empty states.
- **Book registration**: floating + button opens a bottom sheet — title (required), author, pages, and status (Reading now / Want to read / Finished). Covers get auto-assigned colors.
- **Shelf**: filterable library (All / Reading / Want / Done) with progress bars, start-reading and finish actions, 5-star ratings on finished books, finish dates, and delete.
- **Profile**: editable name, live stats grid (books finished, pages read, day streak, reading now), yearly goal stepper, daily-goal progress row, 6 unlockable achievements, and sign out.
- **Settings**: gear-button sheet with name, daily reading goal (pages/day), yearly book goal, reminder toggle, replay intro, sign out, and two-tap "Clear all data".
- **Data layer**: reducer store persisted to localStorage with per-day activity log powering streaks and the weekly chart; auto-finish when the last page is logged; migration-safe profile defaults.

### Fixed
- Yearly goal ring, "Finished this year" count, and the Profile goal row now filter finished books by the current year, so counts stay correct after a year rollover.
