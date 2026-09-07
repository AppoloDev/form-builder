# Migration Preline → shadcn/ui Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remove Preline UI entirely and replace it with a shadcn/ui foundation, migrating Tooltip, Button, Input/Textarea, Checkbox (as Switch), Select and OptionsEdition onto it.

**Architecture:** shadcn/ui is not an npm component library — its CLI copies component source directly into the repo under `src/components/ui/`, built on Radix UI primitives + `class-variance-authority` (CVA) for variants, styled with Tailwind utility classes and merged via a `cn()` helper (`clsx` + `tailwind-merge`). Because this project cannot run the interactive `shadcn` CLI in this environment, each `ui/*.tsx` file is hand-written from the canonical shadcn "new-york" source in this plan. All existing consumer components (`TextEdition`, `CheckboxEdition`, `SelectEdition`, `OptionsEdition`, `Tooltip`) keep their exact current prop APIs — only their internals change — so no call site outside the 5 `.btn`-using files needs to change.

**Tech Stack:** React 19, TypeScript 6, Vite 8 (Rolldown), Tailwind CSS v4, Zustand, @dnd-kit. Adding: Radix UI primitives (`@radix-ui/react-tooltip`, `@radix-ui/react-slot`, `@radix-ui/react-switch`, `@radix-ui/react-select`), `class-variance-authority`, `clsx`, `tailwind-merge`, `tw-animate-css`, `lucide-react`.

**Spec:** `docs/superpowers/specs/2026-09-03-preline-to-shadcn-design.md`

> **⚠️ STATUT : PLAN SUPERSEDÉ — historique uniquement, ne pas ré-exécuter.**
>
> Ce plan décrit une implémentation **Radix UI** (style `new-york`), exécutée en
> subagent-driven-development dans un worktree isolé (`feature/preline-to-shadcn`).
> Task 1 (fondation + Tooltip) et une grande partie de Task 2 (Button) ont été
> implémentées et revues avec succès sur cette base.
>
> Pendant une interruption de Task 2 (limite de session de l'agent implémenteur), une
> installation shadcn/ui **Base UI** (style `base-nova`) a été faite indépendamment,
> directement sur `develop`, via la vraie CLI `shadcn` (interactive, donc impossible à
> lancer dans l'environnement de cet agent). Décision prise de reprendre le travail sur
> cette base réelle plutôt que sur le worktree Radix. Le worktree et la branche
> `feature/preline-to-shadcn` ont été supprimés — l'implémentation Radix décrite
> ci-dessous n'existe plus.
>
> **La migration a été menée à son terme sur Base UI**, directement sur `develop`
> (sans worktree, sans re-décomposition en tâches — le reste a été fait en exécution
> directe au fil de la conversation). Le spec associé
> (`docs/superpowers/specs/2026-09-03-preline-to-shadcn-design.md`) a été mis à jour
> pour refléter l'implémentation réelle : c'est la référence à jour, pas ce plan.
> Les tâches ci-dessous restent comme trace de la conception Radix d'origine et de la
> méthode SDD suivie jusqu'au pivot.

## Global Constraints

- Thème shadcn **neutre par défaut** (`baseColor: "neutral"`) — pas de mapping vers la palette `--color-appolo-*`.
- `CheckboxEdition` reste un **toggle switch** visuellement et fonctionnellement identique à aujourd'hui (pas de vraie case à cocher).
- Aucun changement de prop API externe sur `Tooltip`, `TextEdition`, `CheckboxEdition`, `SelectEdition`, `OptionsEdition` — seuls leurs internes changent.
- Hors périmètre : boutons icône bespoke (`EditableBlock.tsx`, `ContextMenu.tsx`, le "+" flottant de `FormBuilder.tsx`), aperçus désactivés dans les blocs (`<input disabled>`, `<select disabled>`), dark mode fonctionnel.
- **Pas de test runner dans ce repo** (aucun Vitest/Jest — hors périmètre de ce chantier). Vérification par tâche : `pnpm exec tsc --noEmit`, `pnpm run lint`, `pnpm run build`, plus un smoke-test manuel décrit dans chaque tâche (serveur de dev + description précise de ce qu'il faut cliquer/vérifier).
- Toujours lancer les 3 commandes de vérification depuis la racine du repo (`/Users/simon/Documents/LAB/form-builder`).

---

## Task 1: Fondation shadcn + migration Tooltip

**Files:**
- Modify: `package.json` (dépendances)
- Modify: `tsconfig.json` (alias `@/*`)
- Modify: `vite.config.js` (alias `@`)
- Create: `components.json`
- Create: `src/lib/utils.ts`
- Modify: `src/themes/app.scss` (retrait Preline, ajout variables shadcn)
- Modify: `src/index.js` (retrait des imports Preline)
- Create: `src/components/ui/tooltip.tsx`
- Modify: `src/components/Tooltip.tsx`

**Interfaces:**
- Produces: `cn(...inputs: ClassValue[]): string` exporté par `@/lib/utils`, utilisé par toutes les tâches suivantes.
- Produces: `Tooltip`, `TooltipTrigger`, `TooltipContent`, `TooltipProvider` exportés par `@/components/ui/tooltip`.
- Produces: `Tooltip` (wrapper) exporté par `src/components/Tooltip.tsx`, API inchangée : `<Tooltip content={string}>{children}</Tooltip>`.

- [ ] **Step 1: Installer les dépendances de fondation + Tooltip, retirer Preline**

```bash
pnpm add class-variance-authority clsx tailwind-merge tw-animate-css @radix-ui/react-tooltip
pnpm remove preline @preline/tooltip
```

- [ ] **Step 2: Ajouter l'alias `@/*` dans `tsconfig.json`**

Dans `compilerOptions`, ajouter (à côté de `"moduleResolution": "bundler",`) :

```json
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    },
```

- [ ] **Step 3: Ajouter l'alias `@` dans `vite.config.js`**

Remplacer tout le contenu de `vite.config.js` par :

```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { fileURLToPath } from 'node:url'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(),],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
```

(`node:url` est un module Node natif — pas de nouvelle dépendance. `fileURLToPath`/`import.meta.url` fonctionnent en ESM, contrairement à `__dirname` qui n'existe pas puisque `package.json` déclare `"type": "module"`.)

- [ ] **Step 4: Créer `components.json`**

```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "new-york",
  "rsc": false,
  "tsx": true,
  "tailwind": {
    "config": "",
    "css": "src/themes/app.scss",
    "baseColor": "neutral",
    "cssVariables": true
  },
  "aliases": {
    "components": "@/components",
    "ui": "@/components/ui",
    "lib": "@/lib",
    "hooks": "@/hooks",
    "utils": "@/lib/utils"
  }
}
```

- [ ] **Step 5: Créer `src/lib/utils.ts`**

```ts
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}
```

- [ ] **Step 6: Mettre à jour `src/themes/app.scss`**

Remplacer tout le contenu du fichier par :

```scss
@use "tailwindcss";
@import "tw-animate-css";

@custom-variant dark (&:is(.dark *));

@theme {
    --color-appolo-50: #eefbf4;
    --color-appolo-100: #CEF6D7;
    --color-appolo-200: #A0EEBA;
    --color-appolo-300: #69CE94;
    --color-appolo-400: #3D9D6F;
    --color-appolo-500: #115C40;
    --color-appolo-600: #0C4F3C;
    --color-appolo-700: #084238;
    --color-appolo-800: #053531;
    --color-appolo-900: #032B2C;

    --breakpoint-3xl: 1920px;
}

:root {
    --radius: 0.625rem;
    --background: oklch(1 0 0);
    --foreground: oklch(0.145 0 0);
    --card: oklch(1 0 0);
    --card-foreground: oklch(0.145 0 0);
    --popover: oklch(1 0 0);
    --popover-foreground: oklch(0.145 0 0);
    --primary: oklch(0.205 0 0);
    --primary-foreground: oklch(0.985 0 0);
    --secondary: oklch(0.97 0 0);
    --secondary-foreground: oklch(0.205 0 0);
    --muted: oklch(0.97 0 0);
    --muted-foreground: oklch(0.556 0 0);
    --accent: oklch(0.97 0 0);
    --accent-foreground: oklch(0.205 0 0);
    --destructive: oklch(0.577 0.245 27.325);
    --border: oklch(0.922 0 0);
    --input: oklch(0.922 0 0);
    --ring: oklch(0.708 0 0);
    --chart-1: oklch(0.646 0.222 41.116);
    --chart-2: oklch(0.6 0.118 184.704);
    --chart-3: oklch(0.398 0.07 227.392);
    --chart-4: oklch(0.828 0.189 84.429);
    --chart-5: oklch(0.769 0.188 70.08);
    --sidebar: oklch(0.985 0 0);
    --sidebar-foreground: oklch(0.145 0 0);
    --sidebar-primary: oklch(0.205 0 0);
    --sidebar-primary-foreground: oklch(0.985 0 0);
    --sidebar-accent: oklch(0.97 0 0);
    --sidebar-accent-foreground: oklch(0.205 0 0);
    --sidebar-border: oklch(0.922 0 0);
    --sidebar-ring: oklch(0.708 0 0);
}

.dark {
    --background: oklch(0.145 0 0);
    --foreground: oklch(0.985 0 0);
    --card: oklch(0.205 0 0);
    --card-foreground: oklch(0.985 0 0);
    --popover: oklch(0.205 0 0);
    --popover-foreground: oklch(0.985 0 0);
    --primary: oklch(0.922 0 0);
    --primary-foreground: oklch(0.205 0 0);
    --secondary: oklch(0.269 0 0);
    --secondary-foreground: oklch(0.985 0 0);
    --muted: oklch(0.269 0 0);
    --muted-foreground: oklch(0.708 0 0);
    --accent: oklch(0.269 0 0);
    --accent-foreground: oklch(0.985 0 0);
    --destructive: oklch(0.704 0.191 22.216);
    --border: oklch(1 0 0 / 10%);
    --input: oklch(1 0 0 / 15%);
    --ring: oklch(0.556 0 0);
    --chart-1: oklch(0.488 0.243 264.376);
    --chart-2: oklch(0.696 0.17 162.48);
    --chart-3: oklch(0.769 0.188 70.08);
    --chart-4: oklch(0.627 0.265 303.9);
    --chart-5: oklch(0.645 0.246 16.439);
    --sidebar: oklch(0.205 0 0);
    --sidebar-foreground: oklch(0.985 0 0);
    --sidebar-primary: oklch(0.488 0.243 264.376);
    --sidebar-primary-foreground: oklch(0.985 0 0);
    --sidebar-accent: oklch(0.269 0 0);
    --sidebar-accent-foreground: oklch(0.985 0 0);
    --sidebar-border: oklch(1 0 0 / 10%);
    --sidebar-ring: oklch(0.556 0 0);
}

@theme inline {
    --color-background: var(--background);
    --color-foreground: var(--foreground);
    --color-card: var(--card);
    --color-card-foreground: var(--card-foreground);
    --color-popover: var(--popover);
    --color-popover-foreground: var(--popover-foreground);
    --color-primary: var(--primary);
    --color-primary-foreground: var(--primary-foreground);
    --color-secondary: var(--secondary);
    --color-secondary-foreground: var(--secondary-foreground);
    --color-muted: var(--muted);
    --color-muted-foreground: var(--muted-foreground);
    --color-accent: var(--accent);
    --color-accent-foreground: var(--accent-foreground);
    --color-destructive: var(--destructive);
    --color-border: var(--border);
    --color-input: var(--input);
    --color-ring: var(--ring);
    --color-chart-1: var(--chart-1);
    --color-chart-2: var(--chart-2);
    --color-chart-3: var(--chart-3);
    --color-chart-4: var(--chart-4);
    --color-chart-5: var(--chart-5);
    --color-sidebar: var(--sidebar);
    --color-sidebar-foreground: var(--sidebar-foreground);
    --color-sidebar-primary: var(--sidebar-primary);
    --color-sidebar-primary-foreground: var(--sidebar-primary-foreground);
    --color-sidebar-accent: var(--sidebar-accent);
    --color-sidebar-accent-foreground: var(--sidebar-accent-foreground);
    --color-sidebar-border: var(--sidebar-border);
    --color-sidebar-ring: var(--sidebar-ring);
    --radius-sm: calc(var(--radius) * 0.6);
    --radius-md: calc(var(--radius) * 0.8);
    --radius-lg: var(--radius);
    --radius-xl: calc(var(--radius) * 1.4);
    --radius-2xl: calc(var(--radius) * 1.8);
    --radius-3xl: calc(var(--radius) * 2.2);
    --radius-4xl: calc(var(--radius) * 2.6);
}

/* Plugins */
@plugin "@tailwindcss/forms";

@import "/css/app.css";
```

(Les lignes `@import "preline/variants.css";` et `@source "../node_modules/preline/dist/*.js";` disparaissent. Le bloc `@theme` appolo existant est conservé tel quel et cohabite avec le nouveau `@theme inline` shadcn.)

- [ ] **Step 7: Retirer les imports Preline de `src/index.js`**

```js
import './themes/app.scss';
import './elements/formBuilder';
```

(Les deux lignes `import 'preline'` et `import '@preline/tooltip';` sont supprimées.)

- [ ] **Step 8: Créer `src/components/ui/tooltip.tsx`**

```tsx
import * as React from "react"
import * as TooltipPrimitive from "@radix-ui/react-tooltip"

import { cn } from "@/lib/utils"

function TooltipProvider({
    delayDuration = 0,
    ...props
}: React.ComponentProps<typeof TooltipPrimitive.Provider>) {
    return (
        <TooltipPrimitive.Provider
            data-slot="tooltip-provider"
            delayDuration={delayDuration}
            {...props}
        />
    )
}

function Tooltip({
    ...props
}: React.ComponentProps<typeof TooltipPrimitive.Root>) {
    return (
        <TooltipProvider>
            <TooltipPrimitive.Root data-slot="tooltip" {...props} />
        </TooltipProvider>
    )
}

function TooltipTrigger({
    ...props
}: React.ComponentProps<typeof TooltipPrimitive.Trigger>) {
    return <TooltipPrimitive.Trigger data-slot="tooltip-trigger" {...props} />
}

function TooltipContent({
    className,
    sideOffset = 4,
    children,
    ...props
}: React.ComponentProps<typeof TooltipPrimitive.Content>) {
    return (
        <TooltipPrimitive.Portal>
            <TooltipPrimitive.Content
                data-slot="tooltip-content"
                sideOffset={sideOffset}
                className={cn(
                    "bg-primary text-primary-foreground animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 w-fit origin-(--radix-tooltip-content-transform-origin) rounded-md px-3 py-1.5 text-xs text-balance",
                    className
                )}
                {...props}
            >
                {children}
                <TooltipPrimitive.Arrow className="bg-primary fill-primary z-50 size-2.5 translate-y-[calc(-50%_-_2px)] rotate-45 rounded-[2px]" />
            </TooltipPrimitive.Content>
        </TooltipPrimitive.Portal>
    )
}

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider }
```

- [ ] **Step 9: Réécrire `src/components/Tooltip.tsx` sur `ui/tooltip`**

```tsx
import { PropsWithChildren } from "react";
import { Tooltip as TooltipRoot, TooltipContent, TooltipTrigger } from "./ui/tooltip";

type Props = { content: string } & PropsWithChildren;

export const Tooltip = ({ children, content }: Props) => {
    return (
        <TooltipRoot>
            <TooltipTrigger asChild>
                <span className="inline-block">{children}</span>
            </TooltipTrigger>
            <TooltipContent>{content}</TooltipContent>
        </TooltipRoot>
    );
}
```

- [ ] **Step 10: Vérifier**

```bash
pnpm exec tsc --noEmit
pnpm run lint
pnpm run build
```

Les trois doivent passer sans erreur (les catégories déjà tolérées — `any`, `setState`-in-effect — peuvent rester, ne pas en introduire de nouvelles).

- [ ] **Step 11: Smoke-test manuel**

```bash
pnpm run dev
```

Ouvrir l'URL affichée. Ajouter un bloc au canvas, survoler l'icône de déplacement (les 3 points) ou l'icône d'édition d'un bloc : une bulle de tooltip doit apparaître avec le bon texte ("Déplacer le bloc" / "Modifier"), positionnée au-dessus/à côté de l'icône, puis disparaître quand la souris s'éloigne.

- [ ] **Step 12: Commit**

```bash
git add package.json pnpm-lock.yaml tsconfig.json vite.config.js components.json src/lib/utils.ts src/themes/app.scss src/index.js src/components/ui/tooltip.tsx src/components/Tooltip.tsx
git commit -m "Replace Preline with shadcn/ui foundation + Tooltip"
```

---

## Task 2: Button

**Files:**
- Modify: `package.json` (dépendance)
- Create: `src/components/ui/button.tsx`
- Modify: `src/components/AddMenu.tsx`
- Modify: `src/components/Empty.tsx`
- Modify: `src/components/Blocks/ChoiceGroupInput.tsx`
- Modify: `src/components/Blocks/FieldSet.tsx`
- Modify: `src/components/Blocks/Repeatable.tsx`

**Interfaces:**
- Consumes: `cn` from `@/lib/utils` (Task 1).
- Produces: `Button`, `buttonVariants` exportés par `@/components/ui/button`, props `variant?: "default"|"destructive"|"outline"|"secondary"|"ghost"|"link"`, `size?: "default"|"sm"|"lg"|"icon"`, `asChild?: boolean`, plus toutes les props natives de `<button>`.

- [ ] **Step 1: Installer `@radix-ui/react-slot`**

```bash
pnpm add @radix-ui/react-slot
```

- [ ] **Step 2: Créer `src/components/ui/button.tsx`**

```tsx
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
    "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 aria-invalid:border-destructive",
    {
        variants: {
            variant: {
                default:
                    "bg-primary text-primary-foreground shadow-xs hover:bg-primary/90",
                destructive:
                    "bg-destructive text-white shadow-xs hover:bg-destructive/90 focus-visible:ring-destructive/20",
                outline:
                    "border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground",
                secondary:
                    "bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80",
                ghost: "hover:bg-accent hover:text-accent-foreground",
                link: "text-primary underline-offset-4 hover:underline",
            },
            size: {
                default: "h-9 px-4 py-2 has-[>svg]:px-3",
                sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
                lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
                icon: "size-9",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    }
)

function Button({
    className,
    variant,
    size,
    asChild = false,
    ...props
}: React.ComponentProps<"button"> &
    VariantProps<typeof buttonVariants> & {
    asChild?: boolean
}) {
    const Comp = asChild ? Slot : "button"

    return (
        <Comp
            data-slot="button"
            className={cn(buttonVariants({ variant, size, className }))}
            {...props}
        />
    )
}

export { Button, buttonVariants }
```

- [ ] **Step 3: Migrer `src/components/Empty.tsx`**

Remplacer :

```tsx
                <AddMenu
                    onPick={onPick}
                >
                    <button className="btn btn-size-default btn-color-appolo btn-mode-solid">
                        Ajouter un bloc
                    </button>
                </AddMenu>
```

par :

```tsx
                <AddMenu
                    onPick={onPick}
                >
                    <Button type="button">
                        Ajouter un bloc
                    </Button>
                </AddMenu>
```

et ajouter en haut du fichier :

```tsx
import { Button } from "./ui/button";
```

(`AddMenu` place déjà le contenu passé en `children` dans un `<div onClick=...>` gérant l'ouverture — un `<Button>` cliquable à l'intérieur fonctionne à l'identique d'un `<button>`.)

- [ ] **Step 4: Migrer `src/components/AddMenu.tsx`**

Remplacer :

```tsx
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            onPick(def);
                                            handleClose();
                                        }}
                                        className="flex-col !items-start btn btn-size-small btn-mode-ghost w-full text-left !gap-1"
                                        title={def.description}
                                    >
```

par :

```tsx
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            onPick(def);
                                            handleClose();
                                        }}
                                        className="flex-col items-start w-full text-left gap-1 h-auto"
                                        title={def.description}
                                    >
```

et le `</button>` de fermeture correspondant (juste après le `<p className="text-xs">{def.description}</p>`) par `</Button>`. Ajouter en haut du fichier :

```tsx
import { Button } from "./ui/button";
```

(Les `!` forcés dans les classes d'origine servaient à surcharger le CSS `.btn` externe — `ui/button` n'a pas ce conflit, donc `!` n'est plus nécessaire. `h-auto` est ajouté car le bouton contient deux lignes de texte (titre + description), incompatible avec la hauteur fixe `size="sm"`.)

- [ ] **Step 5: Migrer `src/components/Blocks/ChoiceGroupInput.tsx`**

Ajouter l'import en haut du fichier :

```tsx
import { Button } from "../ui/button";
```

Remplacer (bouton de suppression d'option) :

```tsx
                            <button
                                type="button"
                                onClick={() => removeOption(idx)}
                                className="btn btn-size-small btn-color-red btn-mode-ghost"
                                aria-label="Supprimer l'option"
                            >
                                <TrashIcon size={20} />
                            </button>
```

par :

```tsx
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => removeOption(idx)}
                                className="text-destructive hover:text-destructive"
                                aria-label="Supprimer l'option"
                            >
                                <TrashIcon size={20} />
                            </Button>
```

(Écart volontaire par rapport au spec, qui suggérait `variant="destructive"` : l'original est une icône poubelle discrète, sans fond — `variant="destructive"` mettrait un fond rouge plein, un changement visuel non demandé. `variant="ghost"` + texte rouge préserve le rendu actuel à l'identique.)

Remplacer (toggle "Champs conditionnés") :

```tsx
                            {propsUseContionnalField && <button
                                type="button"
                                onClick={() => updateOption(idx, {showConditionalField: !opt.showConditionalField})}
                                className={'btn btn-size-small btn-color-appolo btn-mode-ghost'}
                            >
                                {opt.showConditionalField ? <EyeClosedIcon size={22}/> : <EyeIcon size={22}/>}
                                Champs conditionnés
                            </button>}
```

par :

```tsx
                            {propsUseContionnalField && <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => updateOption(idx, {showConditionalField: !opt.showConditionalField})}
                            >
                                {opt.showConditionalField ? <EyeClosedIcon size={22}/> : <EyeIcon size={22}/>}
                                Champs conditionnés
                            </Button>}
```

Remplacer (bouton "Ajouter un bloc" dans la zone conditionnelle) :

```tsx
                                            <AddMenu onPick={(def) => addFollowUpFromDef(idx, def)}>
                                                <button
                                                    type="button"
                                                    className="btn btn-size-small btn-color-appolo btn-mode-solid"
                                                >
                                                    Ajouter un bloc
                                                </button>
                                            </AddMenu>
```

par :

```tsx
                                            <AddMenu onPick={(def) => addFollowUpFromDef(idx, def)}>
                                                <Button type="button" size="sm">
                                                    Ajouter un bloc
                                                </Button>
                                            </AddMenu>
```

Remplacer (bouton "Ajouter une option") :

```tsx
                    <button
                        type="button"
                        onClick={addOption}
                        className="btn btn-size-small btn-color-appolo btn-mode-solid"
                    >
                        Ajouter une option
                    </button>
```

par :

```tsx
                    <Button type="button" size="sm" onClick={addOption}>
                        Ajouter une option
                    </Button>
```

- [ ] **Step 6: Migrer `src/components/Blocks/FieldSet.tsx`**

Ajouter l'import :

```tsx
import { Button } from "../ui/button";
```

Remplacer :

```tsx
                            <AddMenu onPick={addChild}>
                                <button type="button" className="btn btn-size-small btn-color-appolo btn-mode-solid">
                                    Ajouter un bloc
                                </button>
                            </AddMenu>
```

par :

```tsx
                            <AddMenu onPick={addChild}>
                                <Button type="button" size="sm">
                                    Ajouter un bloc
                                </Button>
                            </AddMenu>
```

- [ ] **Step 7: Migrer `src/components/Blocks/Repeatable.tsx`**

Ajouter l'import :

```tsx
import { Button } from "../ui/button";
```

Remplacer :

```tsx
                            <AddMenu onPick={addChild}>
                                <button type="button" className="btn btn-size-small btn-color-appolo btn-mode-solid">
                                    Ajouter un bloc
                                </button>
                            </AddMenu>
```

par :

```tsx
                            <AddMenu onPick={addChild}>
                                <Button type="button" size="sm">
                                    Ajouter un bloc
                                </Button>
                            </AddMenu>
```

- [ ] **Step 8: Vérifier**

```bash
pnpm exec tsc --noEmit
pnpm run lint
pnpm run build
```

- [ ] **Step 9: Smoke-test manuel**

```bash
pnpm run dev
```

Ajouter un bloc "Choix (radio / cases)" au canvas : cliquer "Ajouter une option" (une option de plus apparaît), cliquer l'icône poubelle rouge d'une option (elle disparaît), cliquer "Champs conditionnés" sur une option (la zone conditionnelle s'ouvre/ferme), y ajouter un bloc via "Ajouter un bloc". Ajouter un bloc "Groupe de champs" et un bloc "Répétable" : dans chacun, cliquer "Ajouter un bloc" et confirmer qu'un nouveau bloc enfant apparaît. Ouvrir le menu d'ajout de bloc général (bouton "+") et confirmer que la liste des blocs (avec titre + description) est cliquable et ajoute bien le bloc choisi.

- [ ] **Step 10: Commit**

```bash
git add package.json pnpm-lock.yaml src/components/ui/button.tsx src/components/AddMenu.tsx src/components/Empty.tsx src/components/Blocks/ChoiceGroupInput.tsx src/components/Blocks/FieldSet.tsx src/components/Blocks/Repeatable.tsx
git commit -m "Migrate action buttons to shadcn Button"
```

---

## Task 3: Input / Textarea (TextEdition)

**Files:**
- Create: `src/components/ui/input.tsx`
- Create: `src/components/ui/textarea.tsx`
- Modify: `src/components/Edition/TextEdition.tsx`

**Interfaces:**
- Consumes: `cn` from `@/lib/utils` (Task 1).
- Produces: `Input` exporté par `@/components/ui/input` (props natives de `<input>`).
- Produces: `Textarea` exporté par `@/components/ui/textarea` (props natives de `<textarea>`).
- `TextEdition`'s prop API is unchanged: `{ label: string; value: string; type?: "text"|"textarea"; helpText?: string; rows?: number; editItem: (text: string) => void }`.

- [ ] **Step 1: Créer `src/components/ui/input.tsx`**

```tsx
import * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
    return (
        <input
            type={type}
            data-slot="input"
            className={cn(
                "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
                "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
                "aria-invalid:ring-destructive/20 aria-invalid:border-destructive",
                className
            )}
            {...props}
        />
    )
}

export { Input }
```

- [ ] **Step 2: Créer `src/components/ui/textarea.tsx`**

```tsx
import * as React from "react"

import { cn } from "@/lib/utils"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
    return (
        <textarea
            data-slot="textarea"
            className={cn(
                "border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 aria-invalid:border-destructive flex field-sizing-content min-h-16 w-full rounded-md border bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
                className
            )}
            {...props}
        />
    )
}

export { Textarea }
```

- [ ] **Step 3: Réécrire `src/components/Edition/TextEdition.tsx`**

```tsx
import { ChangeEvent } from "react";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";

type Props = {
    label: string;
    value: string;
    type?: "text" | "textarea";
    helpText?: string;
    rows?: number;
    editItem: (text: string) => void
}

export const TextEdition = ({label, value, helpText, editItem, type = 'text', rows = 3}: Props) => {
    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        editItem(e.target.value);
    };

    return (
        <div className="space-y-.5 form_row">
            <label>
                {label}
            </label>

            {type === "textarea" ? (
                <Textarea
                    value={value}
                    onChange={handleChange}
                    rows={rows}
                />
            ) : (
                <Input
                    type={type}
                    value={value}
                    onChange={handleChange}
                />
            )}

            {helpText && (
                <p className="help-text">{helpText}</p>
            )}
        </div>
    );
};
```

- [ ] **Step 4: Vérifier**

```bash
pnpm exec tsc --noEmit
pnpm run lint
pnpm run build
```

- [ ] **Step 5: Smoke-test manuel**

```bash
pnpm run dev
```

Ajouter un bloc "Texte court" : ouvrir son panneau d'édition (clic droit ou menu contextuel), modifier le champ "Titre" — le libellé affiché sur le bloc doit se mettre à jour en direct. Faire pareil sur le champ "Message d'aide" (textarea) d'un bloc "Paragraphe" ou "Titre" et confirmer la mise à jour.

- [ ] **Step 6: Commit**

```bash
git add src/components/ui/input.tsx src/components/ui/textarea.tsx src/components/Edition/TextEdition.tsx
git commit -m "Migrate TextEdition to shadcn Input/Textarea"
```

---

## Task 4: Switch (CheckboxEdition)

**Files:**
- Modify: `package.json` (dépendance)
- Create: `src/components/ui/switch.tsx`
- Modify: `src/components/Edition/CheckboxEdition.tsx`

**Interfaces:**
- Consumes: `cn` from `@/lib/utils` (Task 1).
- Produces: `Switch` exporté par `@/components/ui/switch`, props `checked?: boolean`, `onCheckedChange?: (checked: boolean) => void`, plus les props natives d'un bouton Radix.
- `CheckboxEdition`'s prop API is unchanged: `{ label: string; checked: boolean; editItem: (editable: boolean) => void }`.

- [ ] **Step 1: Installer `@radix-ui/react-switch`**

```bash
pnpm add @radix-ui/react-switch
```

- [ ] **Step 2: Créer `src/components/ui/switch.tsx`**

```tsx
import * as React from "react"
import * as SwitchPrimitive from "@radix-ui/react-switch"

import { cn } from "@/lib/utils"

function Switch({
    className,
    ...props
}: React.ComponentProps<typeof SwitchPrimitive.Root>) {
    return (
        <SwitchPrimitive.Root
            data-slot="switch"
            className={cn(
                "peer data-[state=checked]:bg-primary data-[state=unchecked]:bg-input focus-visible:border-ring focus-visible:ring-ring/50 inline-flex h-[1.15rem] w-8 shrink-0 items-center rounded-full border border-transparent shadow-xs transition-all outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50",
                className
            )}
            {...props}
        >
            <SwitchPrimitive.Thumb
                data-slot="switch-thumb"
                className="bg-background pointer-events-none block size-4 rounded-full ring-0 transition-transform data-[state=checked]:translate-x-[calc(100%-2px)] data-[state=unchecked]:translate-x-0"
            />
        </SwitchPrimitive.Root>
    )
}

export { Switch }
```

- [ ] **Step 3: Réécrire `src/components/Edition/CheckboxEdition.tsx`**

```tsx
import { Switch } from "../ui/switch";

type Props = {
    label: string;
    checked: boolean;
    editItem: (editable: boolean) => void;
}

export const CheckboxEdition = ({label, checked, editItem}: Props) => {
    return (
        <div
            className="flex items-center cursor-pointer justify-between"
            onClick={() => editItem(!checked)}
        >
            <span className="text-sm font-medium text-gray-900">{label}</span>
            <Switch
                checked={checked}
                onCheckedChange={editItem}
                onClick={(e) => e.stopPropagation()}
            />
        </div>
    );
}
```

(Le `onClick` sur le conteneur permet de garder le clic "sur toute la ligne" pour toggler, comme avec l'ancien `<label>` + `<input>` natif. `stopPropagation` sur le `Switch` évite un double-toggle quand on clique directement dessus : `onCheckedChange` gère alors seul ce cas.)

- [ ] **Step 4: Vérifier**

```bash
pnpm exec tsc --noEmit
pnpm run lint
pnpm run build
```

- [ ] **Step 5: Smoke-test manuel**

```bash
pnpm run dev
```

Ajouter un bloc "Texte court", ouvrir son édition, cliquer sur le switch "Requis" puis sur le texte "Requis" lui-même — dans les deux cas le switch doit basculer une seule fois (pas de double-toggle) et un `*` doit apparaître/disparaître à côté du libellé du bloc. Faire de même avec "Sélection multiple" sur un bloc "Choix (radio / cases)".

- [ ] **Step 6: Commit**

```bash
git add package.json pnpm-lock.yaml src/components/ui/switch.tsx src/components/Edition/CheckboxEdition.tsx
git commit -m "Migrate CheckboxEdition to shadcn Switch"
```

---

## Task 5: Select (SelectEdition)

**Files:**
- Modify: `package.json` (dépendances)
- Create: `src/components/ui/select.tsx`
- Modify: `src/components/Edition/SelectEdition.tsx`

**Interfaces:**
- Consumes: `cn` from `@/lib/utils` (Task 1).
- Produces: `Select`, `SelectValue`, `SelectTrigger`, `SelectContent`, `SelectItem` exportés par `@/components/ui/select`.
- `SelectEdition`'s prop API is unchanged: `{ label: string; value: string; options: {value: string; label: string}[]; helpText?: string; editItem: (value: string) => void }`.

**Note :** Radix Select interdit `value=""` sur un `<Select.Item>` (et lève une erreur si `Select` reçoit une valeur vide en tant que sélection courante correspondant à aucun item). Tous les appels actuels de `SelectEdition` (mode de `DateTimeInput`, type de fichier de `FileInput`, niveau de titre de `Title`) fournissent toujours une valeur par défaut non vide via `defaultProps` — donc aucun changement de données n'est nécessaire, mais si un futur bloc appelle `SelectEdition` avec une valeur initiale vide, il faudra lui donner une valeur par défaut réelle en amont (pas dans `SelectEdition`).

- [ ] **Step 1: Installer les dépendances**

```bash
pnpm add @radix-ui/react-select lucide-react
```

- [ ] **Step 2: Créer `src/components/ui/select.tsx`**

```tsx
import * as React from "react"
import * as SelectPrimitive from "@radix-ui/react-select"
import { CheckIcon, ChevronDownIcon } from "lucide-react"

import { cn } from "@/lib/utils"

function Select({ ...props }: React.ComponentProps<typeof SelectPrimitive.Root>) {
    return <SelectPrimitive.Root data-slot="select" {...props} />
}

function SelectValue({
    ...props
}: React.ComponentProps<typeof SelectPrimitive.Value>) {
    return <SelectPrimitive.Value data-slot="select-value" {...props} />
}

function SelectTrigger({
    className,
    size = "default",
    children,
    ...props
}: React.ComponentProps<typeof SelectPrimitive.Trigger> & {
    size?: "sm" | "default"
}) {
    return (
        <SelectPrimitive.Trigger
            data-slot="select-trigger"
            data-size={size}
            className={cn(
                "border-input data-[placeholder]:text-muted-foreground [&_svg:not([class*='text-'])]:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 aria-invalid:border-destructive flex w-fit items-center justify-between gap-2 rounded-md border bg-transparent px-3 py-2 text-sm whitespace-nowrap shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 data-[size=default]:h-9 data-[size=sm]:h-8 *:data-[slot=select-value]:line-clamp-1 *:data-[slot=select-value]:flex *:data-[slot=select-value]:items-center *:data-[slot=select-value]:gap-2 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
                className
            )}
            {...props}
        >
            {children}
            <SelectPrimitive.Icon asChild>
                <ChevronDownIcon className="size-4 opacity-50" />
            </SelectPrimitive.Icon>
        </SelectPrimitive.Trigger>
    )
}

function SelectContent({
    className,
    children,
    position = "popper",
    ...props
}: React.ComponentProps<typeof SelectPrimitive.Content>) {
    return (
        <SelectPrimitive.Portal>
            <SelectPrimitive.Content
                data-slot="select-content"
                className={cn(
                    "bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 relative z-50 max-h-(--radix-select-content-available-height) min-w-[8rem] origin-(--radix-select-content-transform-origin) overflow-x-hidden overflow-y-auto rounded-md border shadow-md",
                    position === "popper" &&
                    "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
                    className
                )}
                position={position}
                {...props}
            >
                <SelectPrimitive.Viewport
                    className={cn(
                        "p-1",
                        position === "popper" &&
                        "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)] scroll-my-1"
                    )}
                >
                    {children}
                </SelectPrimitive.Viewport>
            </SelectPrimitive.Content>
        </SelectPrimitive.Portal>
    )
}

function SelectItem({
    className,
    children,
    ...props
}: React.ComponentProps<typeof SelectPrimitive.Item>) {
    return (
        <SelectPrimitive.Item
            data-slot="select-item"
            className={cn(
                "focus:bg-accent focus:text-accent-foreground [&_svg:not([class*='text-'])]:text-muted-foreground relative flex w-full cursor-default items-center gap-2 rounded-sm py-1.5 pr-8 pl-2 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 *:[span]:last:flex *:[span]:last:items-center *:[span]:last:gap-2",
                className
            )}
            {...props}
        >
            <span className="absolute right-2 flex size-3.5 items-center justify-center">
                <SelectPrimitive.ItemIndicator>
                    <CheckIcon className="size-4" />
                </SelectPrimitive.ItemIndicator>
            </span>
            <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
        </SelectPrimitive.Item>
    )
}

export {
    Select,
    SelectValue,
    SelectTrigger,
    SelectContent,
    SelectItem,
}
```

(Sous-ensemble volontairement réduit du set canonique shadcn : `SelectGroup`, `SelectLabel`, `SelectSeparator` et les boutons de scroll ne sont pas inclus car rien dans ce projet ne les utilise aujourd'hui — à ajouter si un futur usage en a besoin.)

- [ ] **Step 3: Réécrire `src/components/Edition/SelectEdition.tsx`**

```tsx
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

type Option = { value: string; label: string };

type Props = {
    label: string;
    value: string;
    options: Option[];
    helpText?: string;
    editItem: (value: string) => void;
};

export const SelectEdition = ({label, value, options, helpText, editItem}: Props) => {
    return (
        <div className="mb-3">
            <label className="block mb-2 text-sm font-medium text-gray-900">{label}</label>
            <Select value={value ?? ""} onValueChange={editItem}>
                <SelectTrigger className="w-full">
                    <SelectValue/>
                </SelectTrigger>
                <SelectContent>
                    {options.map(opt => (
                        <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                    ))}
                </SelectContent>
            </Select>
            {helpText && <p className="mt-1 text-xs text-gray-500 italic">{helpText}</p>}
        </div>
    );
};
```

- [ ] **Step 4: Vérifier**

```bash
pnpm exec tsc --noEmit
pnpm run lint
pnpm run build
```

- [ ] **Step 5: Smoke-test manuel**

```bash
pnpm run dev
```

Ajouter un bloc "Titre", ouvrir son édition, changer "Niveau de titre" via le select — le rendu du titre doit changer de taille en direct. Ajouter un bloc "Date / Heure", ouvrir son édition, changer "Type de saisie" (Date / Date et heure / Heure) — le champ prévisualisé doit changer de type. Ajouter un bloc "Fichier", changer "Fichiers acceptés" — pas de crash, la valeur est bien retenue en rouvrant le panneau.

- [ ] **Step 6: Commit**

```bash
git add package.json pnpm-lock.yaml src/components/ui/select.tsx src/components/Edition/SelectEdition.tsx
git commit -m "Migrate SelectEdition to shadcn Select"
```

---

## Task 6: OptionsEdition

**Files:**
- Modify: `src/components/Edition/OptionsEdition.tsx`

**Interfaces:**
- Consumes: `Input` from `@/components/ui/input` (Task 3), `Button` from `@/components/ui/button` (Task 2).
- `OptionsEdition`'s prop API is unchanged: `{ label: string; value: string[]; helpText?: string; onChange: (next: string[]) => void }`.

- [ ] **Step 1: Réécrire `src/components/Edition/OptionsEdition.tsx`**

```tsx
import { Input } from "../ui/input";
import { Button } from "../ui/button";

type Props = {
    label: string;
    value: string[];
    helpText?: string;
    onChange: (next: string[]) => void;
};

export const OptionsEdition = ({ label, value = [], helpText, onChange }: Props) => {
    const add = () => onChange([...value, "Nouvelle option"]);
    const update = (idx: number, v: string) => {
        const next = [...value];
        next[idx] = v;
        onChange(next);
    };
    const remove = (idx: number) => {
        const next = value.filter((_, i) => i !== idx);
        onChange(next);
    };

    return (
        <div className="mb-3">
            <div className="flex items-center justify-between mb-1">
                <label className="block text-sm font-medium text-gray-700">{label}</label>
                <Button type="button" size="sm" variant="secondary" onClick={add}>
                    + Ajouter
                </Button>
            </div>

            <div className="space-y-2">
                {value.map((opt, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                        <Input
                            value={opt}
                            onChange={(e) => update(idx, e.target.value)}
                            className="flex-1"
                        />
                        <Button
                            type="button"
                            size="sm"
                            variant="destructive"
                            onClick={() => remove(idx)}
                            aria-label="Supprimer l'option"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 256 256"><path d="M216,48H176V40a24,24,0,0,0-24-24H104A24,24,0,0,0,80,40v8H40a8,8,0,0,0,0,16h8V208a16,16,0,0,0,16,16H192a16,16,0,0,0,16-16V64h8a8,8,0,0,0,0-16ZM96,40a8,8,0,0,1,8-8h48a8,8,0,0,1,8,8v8H96Zm96,168H64V64H192ZM112,104v64a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Zm48,0v64a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Z"></path></svg>
                        </Button>
                    </div>
                ))}
            </div>

            {helpText && (
                <p className="mt-1 text-xs text-gray-500 italic">{helpText}</p>
            )}
        </div>
    );
};
```

- [ ] **Step 2: Vérifier**

```bash
pnpm exec tsc --noEmit
pnpm run lint
pnpm run build
```

- [ ] **Step 3: Smoke-test manuel**

```bash
pnpm run dev
```

Ajouter un bloc "Liste déroulante", ouvrir son édition : cliquer "+ Ajouter" (une option "Nouvelle option" apparaît), modifier son texte dans le champ, cliquer l'icône poubelle rouge (l'option disparaît). Le `<select>` affiché sur le bloc doit refléter les options en direct.

- [ ] **Step 4: Commit**

```bash
git add src/components/Edition/OptionsEdition.tsx
git commit -m "Migrate OptionsEdition to shadcn Input/Button"
```

---

## Task 7: Vérification finale et nettoyage

**Files:**
- None (vérification uniquement, plus correctifs éventuels si le grep ci-dessous trouve un résidu)

**Interfaces:**
- Consumes: l'ensemble des tâches précédentes.

- [ ] **Step 1: Confirmer l'absence totale de Preline**

```bash
grep -rn "preline" package.json pnpm-lock.yaml src || echo "clean"
grep -rn "hs-tooltip\|data-hs-tooltip" src || echo "clean"
```

Les deux commandes doivent afficher `clean`. Si un résidu apparaît, le supprimer avant de continuer.

- [ ] **Step 2: Confirmer l'absence totale de classes `.btn-*`**

```bash
grep -rn "btn-size\|btn-color\|btn-mode" src || echo "clean"
```

Doit afficher `clean`. Si un résidu apparaît (fichier oublié dans les tâches 2/6), le migrer avec le même mapping que la Task 2 (`btn-mode-solid`→`variant="default"`, `btn-mode-ghost`→`variant="ghost"`, `btn-color-red`→ajout de `className="text-destructive hover:text-destructive"`, `btn-size-small`→`size="sm"`).

- [ ] **Step 3: Vérification complète**

```bash
pnpm exec tsc --noEmit
pnpm run lint
pnpm run build
```

Noter la taille du bundle JS affichée par `pnpm run build` (`dist/assets/index-*.js`) — elle doit être **plus petite** qu'avant ce chantier (Preline embarquait ~40 composants inutilisés ; shadcn n'installe que ce qui est réellement utilisé).

- [ ] **Step 4: Smoke-test manuel complet**

```bash
pnpm run dev
```

Reprendre en une passe tous les smoke-tests des tâches 1 à 6 (tooltip, boutons, input/textarea, switch, select, options) sur un même formulaire construit à la volée avec un bloc de chaque type. Exporter le JSON du formulaire (si un bouton d'export existe dans l'app hôte) ou au minimum vérifier dans la console navigateur que `onChange` du composant reçoit bien un JSON cohérent (pas de `undefined`/`NaN` introduits par les nouveaux composants).

- [ ] **Step 5: Commit (si des résidus ont été corrigés à l'étape 2)**

```bash
git add -A
git commit -m "Clean up remaining Preline/.btn residue"
```

(Si aucun résidu, ne rien committer à cette étape — les tâches précédentes ont déjà tout committé.)
