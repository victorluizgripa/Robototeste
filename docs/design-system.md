# Design System — Roboto

> Tema claro, roxo como accent, visual clean e amigável (arredondado, leve, motivacional).

---

## 1. Paleta de cores

### Accent (roxo principal)

| Token            | Valor     | Uso                                      |
|------------------|-----------|------------------------------------------|
| `accent-50`      | `#f5f3ff` | Background sutil de destaque             |
| `accent-100`     | `#ede9fe` | Hover em backgrounds accent              |
| `accent-200`     | `#ddd6fe` | Borders accent                           |
| `accent-500`     | `#8b5cf6` | Badges, ícones, destaque leve            |
| `accent-600`     | `#7c3aed` | Botões primários, links, CTAs            |
| `accent-700`     | `#6d28d9` | Hover em botões primários                |
| `accent-900`     | `#4c1d95` | Texto sobre fundo accent claro           |

### Superfícies

| Token       | Valor     | Uso                                |
|-------------|-----------|-------------------------------------|
| `bg`        | `#faf9fb` | Fundo geral da página               |
| `surface`   | `#ffffff` | Cards, modais, blocos de conteúdo   |
| `surface-2` | `#f8f7fa` | Fundo alternativo (seções internas) |

### Texto

| Token        | Valor     | Uso                         |
|--------------|-----------|------------------------------|
| `text`       | `#1e1b2e` | Texto principal (headings)   |
| `text-2`     | `#4a4560` | Texto secundário (body)      |
| `text-3`     | `#8a849c` | Texto terciário (captions)   |
| `text-on-accent` | `#ffffff` | Texto sobre bg accent    |

### Borders

| Token         | Valor     | Uso                    |
|---------------|-----------|-------------------------|
| `border`      | `#e8e5f0` | Borda padrão de cards   |
| `border-hover`| `#d4d0e0` | Borda em hover          |

### Semânticas

| Token         | Valor (bg / text)       | Uso            |
|---------------|--------------------------|----------------|
| `success`     | `#ecfdf5` / `#065f46`   | Acerto, correto |
| `warning`     | `#fffbeb` / `#92400e`   | Atenção, alerta |
| `error`       | `#fef2f2` / `#991b1b`   | Erro, incorreto |

---

## 2. Tipografia

| Nível          | Classe Tailwind         | Uso                       |
|----------------|-------------------------|----------------------------|
| Display        | `text-3xl font-bold`    | Hero sections              |
| Heading 1      | `text-2xl font-bold`    | Título principal da página |
| Heading 2      | `text-lg font-semibold` | Subtítulos, card headers   |
| Body           | `text-sm`               | Texto padrão               |
| Body small     | `text-xs`               | Captions, labels, badges   |
| Caption        | `text-[11px]`           | Tags, micro-badges         |

Fonte: system stack (Inter via `font-sans` se disponível).

---

## 3. Spacing e Layout

| Token      | Valor | Uso                                        |
|------------|-------|--------------------------------------------|
| Padding XS | `8px` (p-2)    | Badges, micro-espaçamentos       |
| Padding SM | `12px` (p-3)   | Inputs, selects                  |
| Padding MD | `16px-20px` (p-4/p-5) | Cards                     |
| Padding LG | `24px` (p-6)   | Seções, containers               |
| Gap padrão | `16px` (gap-4)  | Grid, flex gap                  |
| Max width  | `max-w-6xl`     | Container principal (questões)  |
| Max width  | `max-w-4xl`     | Container menor (dashboard)     |

---

## 4. Border Radius

| Uso         | Valor               |
|-------------|----------------------|
| Botões      | `rounded-xl` (12px) |
| Cards       | `rounded-2xl` (16px)|
| Inputs      | `rounded-xl` (12px) |
| Badges      | `rounded-full`      |
| Modais      | `rounded-2xl`       |

---

## 5. Shadows

| Nível   | Classe                                                | Uso                 |
|---------|-------------------------------------------------------|----------------------|
| Nenhuma | —                                                     | Estado padrão input  |
| Sutil   | `shadow-sm`                                           | Cards em repouso     |
| Média   | `shadow-md`                                           | Cards em hover       |
| Elevada | `shadow-lg`                                           | Modais, dropdowns    |

---

## 6. Componentes base

Todos em `src/components/ui/`. Padrão: forwardRef + className merge.

| Componente  | Variantes                                   |
|-------------|----------------------------------------------|
| `Button`    | `primary`, `secondary`, `ghost`, `danger`    |
| `Card`      | Padrão (com ou sem hover)                    |
| `Badge`     | `default`, `accent`, `success`, `error`      |
| `Input`     | Com ícone opcional                           |
| `Select`    | Com placeholder                              |
| `Skeleton`  | Retângulo genérico com `animate-pulse`       |
| `Alert`     | `info`, `success`, `warning`, `error`        |

---

## 7. Regras (Do / Don't)

### Do

- Usar cores semânticas (`accent-600` para CTAs, `text` para headings).
- Manter `rounded-2xl` para cards e `rounded-xl` para botões/inputs.
- Usar `transition-all` em interações (hover, focus).
- Preferir `text-sm` como tamanho padrão de body.
- Sempre incluir estados: default, hover, focus, disabled.
- Usar `ring` com cor accent para focus.

### Don't

- Não usar `bg-slate-*` raw — usar tokens semânticos (`bg`, `surface`, `border`).
- Não misturar border-radius (ex.: `rounded-md` em um input e `rounded-xl` em outro).
- Não usar sombras pesadas (`shadow-xl`, `shadow-2xl`).
- Não criar estilos "soltos" — sempre via componente `ui/*` ou classe do token.
- Não usar preto puro (`#000`). Usar `text` (`#1e1b2e`).
- Não colocar accent como background de cards comuns (reservar para CTAs e highlights).
