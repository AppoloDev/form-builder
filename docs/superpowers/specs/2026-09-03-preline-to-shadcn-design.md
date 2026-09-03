# Migration Preline → shadcn/ui

Date: 2026-09-03

## Contexte

Le projet utilise actuellement Preline UI (`preline` + `@preline/tooltip`) pour un seul
besoin réel : le composant `Tooltip` (`src/components/Tooltip.tsx`), affiché via
`import 'preline'` dans `src/index.js` — ce qui embarque toute la librairie (~40
composants) alors qu'un seul est utilisé. Par ailleurs, l'UI d'édition des blocs
(`src/components/Edition/*`) et plusieurs boutons d'action (`.btn btn-color-appolo …`)
sont des éléments HTML natifs stylés à la main, sans librairie de composants.

Décision : remplacer Preline par shadcn/ui, et en profiter pour migrer les briques
d'édition (Button, Input, Checkbox/Switch, Select) vers de vrais composants shadcn.

## Objectifs

- Retirer complètement `preline` et `@preline/tooltip` du projet.
- Poser une fondation shadcn/ui réutilisable (alias `@/*`, `components.json`,
  `cn()`, composants dans `src/components/ui/`) pour que les futurs `npx shadcn add …`
  fonctionnent directement, sans réinstallation.
- Migrer les composants suivants vers shadcn : Tooltip, Button, Input/Textarea,
  Checkbox (→ Switch), Select.
- Ne rien changer côté API externe des composants migrés (mêmes props), pour que les
  ~15 fichiers consommateurs (`GenericInput`, `ChoiceGroupInput`, `Title`, `Paragraph`,
  `Signature`, `Select` (bloc), `Repeatable`, `FieldSet`, `AddMenu`, `Empty`…) n'aient
  pas besoin d'être modifiés au-delà des boutons `.btn-*`.

## Non-objectifs (explicitement hors périmètre)

- Boutons icône bespoke (poubelle/édition/drag dans `EditableBlock.tsx`, fermeture de
  `ContextMenu.tsx`, le "+" flottant dans `FormBuilder.tsx`) : restent en Tailwind
  inline. Pas de variante "icon button" shadcn introduite dans ce chantier.
- Les aperçus désactivés à l'intérieur des blocs (`<input disabled>`,
  `<select disabled>` dans `GenericInput.tsx`, `ChoiceGroupInput.tsx`, `Select.tsx`
  (bloc)) : ils représentent le futur formulaire final rendu hors de cet éditeur — non
  touchés.
- Pas de mapping de la palette de marque `appolo` (`--color-appolo-*`, `app.scss`) vers
  les variables shadcn. Thème neutre par défaut. Une couture visuelle entre les
  nouveaux composants shadcn (neutres) et les boutons icône restés custom (verts
  appolo) est attendue et acceptée pour l'instant.
- Pas de dark mode fonctionnel. Le bloc CSS `.dark` standard de shadcn est inclus par
  défaut (coût nul, pas de toggle construit).
- `CheckboxEdition` reste visuellement/fonctionnellement un **toggle switch** (comme
  aujourd'hui), reconstruit sur `ui/switch` — pas de vraie case à cocher.

## Fondation

### Nouvelles dépendances

```
class-variance-authority
clsx
tailwind-merge
tw-animate-css
@radix-ui/react-tooltip
@radix-ui/react-switch
@radix-ui/react-select
```

Dépendances retirées : `preline`, `@preline/tooltip`.

### Alias de chemin `@/*`

`tsconfig.json` — ajout sous `compilerOptions` :

```json
"baseUrl": ".",
"paths": { "@/*": ["./src/*"] }
```

`vite.config.ts` — ajout d'un `resolve.alias` :

```ts
resolve: {
  alias: { "@": path.resolve(__dirname, "./src") },
},
```

### `components.json`

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

### `src/lib/utils.ts`

Le helper standard shadcn :

```ts
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

### `src/themes/app.scss`

- Suppression des lignes Preline :
  ```
  @import "preline/variants.css";
  @source "../node_modules/preline/dist/*.js";
  ```
- Ajout de `@import "tw-animate-css";`
- Ajout du bloc de variables shadcn (thème **neutral**, valeurs OKLCH par défaut),
  `:root`, `.dark` et `@theme inline` — conservé tel quel depuis la doc shadcn
  (radius, background, foreground, primary, secondary, muted, accent, destructive,
  border, input, ring, chart-1..5, sidebar-*).
- Le bloc `@theme` existant (`--color-appolo-*`, `--breakpoint-3xl`) reste inchangé et
  cohabite avec le nouveau bloc shadcn.

### `src/index.js`

Retrait de :
```js
import 'preline'
import '@preline/tooltip';
```

## Composants shadcn (`src/components/ui/`)

Code canonique shadcn (Radix + CVA), copié dans le repo :
`tooltip.tsx`, `button.tsx`, `input.tsx`, `textarea.tsx`, `switch.tsx`, `select.tsx`.

## Migration — fichiers touchés

### Réécriture interne seule (API externe inchangée, aucun site d'appel à modifier)

| Fichier | Avant | Après |
|---|---|---|
| `src/components/Tooltip.tsx` | classes `hs-tooltip*` + `@preline/tooltip` | `ui/tooltip` (Radix) |
| `src/components/Edition/TextEdition.tsx` | `<input>`/`<textarea>` natifs | `ui/input` + `ui/textarea` |
| `src/components/Edition/CheckboxEdition.tsx` | toggle fait main | `ui/switch` |
| `src/components/Edition/SelectEdition.tsx` | `<select>` natif | `ui/select` |
| `src/components/Edition/OptionsEdition.tsx` | `<input>` + `<button>` | `ui/input` + `ui/button` |

### Boutons `.btn-*` → `<Button>`

`src/components/AddMenu.tsx`, `src/components/Blocks/ChoiceGroupInput.tsx`,
`src/components/Blocks/Repeatable.tsx`, `src/components/Blocks/FieldSet.tsx`,
`src/components/Empty.tsx`

Mapping de variantes : `btn-mode-solid` + `btn-color-appolo` → `Button` (variant
`default`) ; `btn-mode-ghost` → variant `ghost` ; `btn-color-red` (suppression
d'option) → variant `destructive`.

## Vérification

- `tsc --noEmit`, `eslint`, `pnpm build` — comme pour les migrations précédentes de
  cette session.
- Test manuel via le serveur de dev (pas d'outil de navigateur automatisé disponible
  cette session → vérification statique + smoke test serveur, comme pour la montée
  Vite 8) : ouverture/fermeture du tooltip, toggle du switch (Requis/Multiple),
  ouverture/sélection du select (mode DateTimeInput, type de fichier FileInput, niveau
  de titre), clics des boutons (ajouter option/bloc, supprimer option).
- Vérifier qu'aucun bloc ajouté cette session (Select, FieldSet, Repeatable, Signature,
  DateTimeInput, FileInput…) ne régresse, puisqu'ils consomment tous
  `TextEdition`/`CheckboxEdition`/`SelectEdition`/`OptionsEdition`.

## Risques identifiés

- `ui/select` (Radix) remplace un `<select>` natif : comportement clavier/souris
  légèrement différent (listbox stylée plutôt que le picker natif de l'OS). Impact
  visuel/UX à valider manuellement, aucun changement de props/API.
- Le thème neutre crée une incohérence visuelle temporaire avec les boutons icône
  restés verts (appolo) — assumé, cf. Non-objectifs.
