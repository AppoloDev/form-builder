# Migration Preline → shadcn/ui

Date: 2026-09-03 (conçu) — mis à jour 2026-09-07 (implémentation réelle)

> **Note de pivot** : ce spec a été conçu pour une implémentation shadcn/ui basée sur
> **Radix UI** (style `new-york`), exécutée via un plan et le processus
> subagent-driven-development dans un worktree isolé. Pendant une interruption de la
> tâche 2 (limite de session de l'agent), une installation shadcn/ui a été faite
> **directement sur `develop`, via la vraie CLI `shadcn`**, sur une base différente :
> **Base UI** (style `base-nova`), avec des conventions de chemin différentes. Le
> travail a repris sur cette base réelle plutôt que sur le worktree Radix (abandonné et
> supprimé). Ce document reflète l'implémentation **effective** (Base UI). La section
> "Historique" en bas de fichier garde une trace de la conception Radix d'origine.

## Contexte

Le projet utilisait Preline UI (`preline` + `@preline/tooltip`) pour un seul besoin
réel : le composant `Tooltip` (`src/components/Tooltip.tsx`), affiché via
`import 'preline'` dans `src/index.js` — ce qui embarquait toute la librairie (~40
composants) alors qu'un seul était utilisé. Par ailleurs, l'UI d'édition des blocs
(`src/components/Edition/*`) et plusieurs boutons d'action (`.btn btn-color-appolo …`)
étaient des éléments HTML natifs stylés à la main, sans librairie de composants.

Décision : remplacer Preline par shadcn/ui, et en profiter pour migrer les briques
d'édition (Button, Input, Checkbox/Switch, Select) vers de vrais composants shadcn.

## Objectifs

- Retirer complètement `preline` et `@preline/tooltip` du projet. ✅
- Poser une fondation shadcn/ui réutilisable (alias `@/*`, `components.json`,
  `cn()`, composants dans `src/components/ui/`) pour que les futurs `npx shadcn add …`
  fonctionnent directement, sans réinstallation. ✅
- Migrer les composants suivants vers shadcn : Tooltip, Button, Input/Textarea,
  Checkbox (→ Switch), Select. ✅
- Ne rien changer côté API externe des composants migrés (mêmes props), pour que les
  fichiers consommateurs (`GenericInput`, `ChoiceGroupInput`, `Title`, `Paragraph`,
  `Signature`, `Select` (bloc), `Repeatable`, `FieldSet`, `AddMenu`, `Empty`…) n'aient
  pas besoin d'être modifiés au-delà des boutons `.btn-*`. ✅

## Non-objectifs (explicitement hors périmètre)

- Boutons icône bespoke (poubelle/édition/drag dans `EditableBlock.tsx`, fermeture de
  `ContextMenu.tsx`, le "+" flottant dans `FormBuilder.tsx`) : restent en Tailwind
  inline. Pas de variante "icon button" shadcn introduite dans ce chantier.
- Les aperçus désactivés à l'intérieur des blocs (`<input disabled>`,
  `<select disabled>` dans `GenericInput.tsx`, `ChoiceGroupInput.tsx`, `Select.tsx`
  (bloc)) : ils représentent le futur formulaire final rendu hors de cet éditeur — non
  touchés.
- Pas de mapping de la palette de marque `appolo` (`--color-appolo-*`) vers les
  variables shadcn. Thème neutre par défaut (`baseColor: "neutral"`). Une couture
  visuelle entre les nouveaux composants shadcn (neutres) et les boutons icône restés
  custom (verts appolo) est attendue et acceptée pour l'instant. La palette `appolo`
  elle-même reste définie (nécessaire : le CSS du site hôte, hors dépôt, l'utilise
  massivement — boutons, badges, alertes, inputs…).
- Pas de dark mode fonctionnel. Le bloc CSS `.dark` standard de shadcn est inclus par
  défaut (coût nul, pas de toggle construit).
- `CheckboxEdition` reste visuellement/fonctionnellement un **toggle switch** (comme
  avant), reconstruit sur `ui/switch` — pas de vraie case à cocher.
- L'assistant de configuration à la création d'un bloc (sélection d'un type puis
  pré-remplissage de ses propriétés avant ajout) qui vit maintenant dans `AddMenu.tsx`
  est une fonctionnalité **indépendante** de cette migration, apparue en parallèle sur
  `develop` pendant l'interruption mentionnée plus haut. Elle n'a pas été conçue ni
  planifiée ici ; ce spec ne documente que son usage des composants shadcn qu'elle
  consomme (`Button`, `TextEdition`, `CheckboxEdition`, `SelectEdition`), pas sa
  logique propre.

## Fondation (implémentation réelle)

### Dépendances

```
class-variance-authority
cn                   (remplace clsx + tailwind-merge — package officiel shadcn,
                       même API, "drop-in replacement", zéro dépendance)
lucide-react         (iconLibrary du components.json)
shadcn               (le CLI lui-même, présent en dépendance — fournit
                       shadcn/tailwind.css importé par le thème)
tw-animate-css
@base-ui/react
```

Dépendances retirées : `preline`, `@preline/tooltip`, `clsx`, `tailwind-merge`.

### Alias de chemin `@/*`

`tsconfig.json` — sous `compilerOptions`, à côté des réglages existants
(`target`, `lib`, `strict`, `jsx`, etc. — **conservés**, une réécriture accidentelle de
ce fichier par la CLI les avait effacés en cours de route, restauré) :

```json
"paths": { "@/*": ["./*"] }
```

Pas de `baseUrl` : TypeScript 6.0.3 le déprécie (`TS5101`) ; `paths` seul suffit,
résolu relativement à l'emplacement de `tsconfig.json` (donc la racine du repo).

`vite.config.js` — alias `@` pointant vers la racine du repo (pas `./src`, note la
différence avec la conception d'origine) :

```js
import { fileURLToPath } from 'node:url'
// ...
resolve: {
  alias: { '@': fileURLToPath(new URL('.', import.meta.url)) },
},
```

### `components.json`

```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "base-nova",
  "rsc": false,
  "tsx": true,
  "tailwind": {
    "config": "",
    "css": "src/themes/app.css",
    "baseColor": "neutral",
    "cssVariables": true,
    "prefix": ""
  },
  "aliases": {
    "components": "@/src/components",
    "utils": "@/src/utilities/utils",
    "ui": "@/src/components/ui",
    "lib": "@/src/lib",
    "hooks": "@/src/hooks"
  },
  "iconLibrary": "lucide"
}
```

Différences avec la conception d'origine : style `base-nova` (Base UI) au lieu de
`new-york` (Radix) ; `cn()` vit dans `src/utilities/utils.ts` (alias `utils`) au lieu
de `src/lib/utils.ts` ; imports en `@/src/components/ui/...` (alias racine-repo) au
lieu de `@/components/ui/...` (alias src-relatif).

### `src/utilities/utils.ts`

```ts
export { cn } from "cn"
```

### `src/themes/app.scss` → `src/themes/app.css`

Le fichier a été renommé et réécrit par la CLI. Points restaurés après coup (cassures
non intentionnelles de la CLI, corrigées en cours de chantier) :
- Le bloc `@theme { --color-appolo-*; --breakpoint-3xl }` avait disparu — restauré
  (le CSS externe `css/` en dépend fortement : `_button.css`, `_badge.css`,
  `_alert.css`, `_input.css`, `_tomselect.css`, `_sweetalert.css`,
  `_character-counter.css`).
- `@import "/css/app.css";` (le CSS du site hôte) était commenté — réactivé.
- `@custom-variant hs-removing (&.hs-removing);` ajouté : `css/ui/atoms/_toast.css`
  utilise `@apply hs-removing:...`, une variante que Preline fournissait via
  `preline/variants.css` (jamais réimportée par la CLI). Preline étant retiré,
  cette déclaration minimale restaure uniquement cette variante — pas de
  réintroduction de Preline. Ce CSS de toast n'est câblé à aucun composant JS du
  dépôt (vérifié) : c'est un correctif de compilation, pas fonctionnel.

Contenu final : `@import "tailwindcss"`, `@import "tw-animate-css"`,
`@import "shadcn/tailwind.css"`, `@custom-variant dark`, `@custom-variant hs-removing`,
le bloc `@theme` (appolo), `@theme inline` (mapping shadcn), `:root`/`.dark` (valeurs
OKLCH neutres par défaut), `@layer base` (bordures/fond par défaut), puis
`@import "/css/app.css"`.

### `src/index.js`

Retrait de `import 'preline'` et `import '@preline/tooltip';`.

## Composants shadcn (`src/components/ui/`)

Code canonique shadcn (Base UI + CVA), style `base-nova`, récupéré depuis le registre
officiel (`ui.shadcn.com/r/styles/base-nova/<nom>.json`) et adapté sur deux points
systématiques : suppression de la directive `"use client"` (non pertinente hors
Next.js/RSC, `rsc: false`) et import de `cn` depuis l'alias du projet
(`@/src/utilities/utils`) plutôt que le nom générique `"cn"` du registre.

- `tooltip.tsx` : `Tooltip`, `TooltipTrigger`, `TooltipContent`, `TooltipProvider` —
  composition `Provider > Root > Trigger` + `Portal > Positioner > Popup > Arrow`.
- `button.tsx` : variantes `default | outline | secondary | ghost | destructive | link`,
  tailles `default | xs | sm | lg | icon | icon-xs | icon-sm | icon-lg`. Généré par la
  CLI avant la reprise du chantier ; conservé tel quel.
- `input.tsx`, `textarea.tsx` : wrappers directs, `input.tsx` utilise
  `Input` de `@base-ui/react/input`.
- `switch.tsx` : `Switch`/`Switch.Thumb` de `@base-ui/react/switch`.
- `select.tsx` : `Select`, `SelectTrigger`, `SelectValue`, `SelectContent`,
  `SelectItem`, `SelectLabel`, `SelectGroup`, `SelectSeparator`,
  `SelectScrollUpButton`, `SelectScrollDownButton` — set complet du registre (pas
  réduit, pour rester compatible avec un futur `shadcn add select` qui écraserait le
  fichier). Les icônes du registre utilisent un composant `IconPlaceholder` propre au
  site de doc shadcn (abstraction multi-bibliothèques) — remplacées par des imports
  directs `lucide-react` (`ChevronDownIcon`, `CheckIcon`, `ChevronUpIcon`), cohérent
  avec `iconLibrary: "lucide"`.

## Migration — fichiers touchés

### Réécriture interne seule (API externe inchangée, aucun site d'appel à modifier)

| Fichier | Avant | Après |
|---|---|---|
| `src/components/Tooltip.tsx` | classes `hs-tooltip*` + `@preline/tooltip` | `ui/tooltip` (Base UI, trigger via `render={<span/>}`) |
| `src/components/Edition/TextEdition.tsx` | `<input>`/`<textarea>` natifs | `ui/input` + `ui/textarea` |
| `src/components/Edition/CheckboxEdition.tsx` | toggle fait main | `ui/switch` (toggle sur la ligne entière, `stopPropagation` sur le switch pour éviter un double-toggle) |
| `src/components/Edition/SelectEdition.tsx` | `<select>` natif | `ui/select` (`onValueChange` peut recevoir `null` côté Base UI ; coalescé en `""`) |
| `src/components/Edition/OptionsEdition.tsx` | `<input>` + `<button>` | `ui/input` + `ui/button` |

### Boutons `.btn-*` → `<Button>`

`src/components/AddMenu.tsx`, `src/components/Blocks/ChoiceGroupInput.tsx`,
`src/components/Blocks/Repeatable.tsx`, `src/components/Blocks/FieldSet.tsx`,
`src/components/Empty.tsx`

Mapping de variantes utilisé : `btn-mode-solid` + `btn-color-appolo` → `Button`
(variant par défaut) ; `btn-mode-ghost` → variant `ghost` ; `btn-color-red`
(suppression d'option) → variant `ghost` + `className="text-destructive
hover:text-destructive"` (et non `variant="destructive"` : ce dernier a un fond plein,
ce qui aurait changé le rendu — l'original est une icône discrète sans fond). Dans
`AddMenu.tsx`, les surcharges `!important` (`!items-start`, `!gap-0.5`…) qui
contraient l'ancien CSS `.btn` ont pu être retirées : plus de conflit de spécificité
avec `Button`.

## Vérification

- `tsc --noEmit`, `eslint`, `pnpm build` à chaque étape.
- Test manuel via le serveur de dev (pas d'outil de navigateur automatisé disponible →
  vérification statique : `curl` sur chaque module touché pour confirmer une
  transformation sans erreur, plus lecture du code pour décrire le comportement
  attendu).
- Confirmé : plus aucune référence à `preline`/`hs-tooltip`/`.btn-*` dans `src/`.
- Bundle JS final nettement plus léger qu'avec Preline (~400-470 Ko contre ~700+ Ko).

## Risques identifiés

- `ui/select` (Base UI) remplace un `<select>` natif : comportement clavier/souris
  différent (listbox stylée plutôt que le picker natif de l'OS). Aucun changement de
  props/API. Non validé visuellement en navigateur.
- Le thème neutre crée une incohérence visuelle avec les boutons icône restés verts
  (appolo) — assumé, cf. Non-objectifs.
- `ui/select.tsx` conserve le set complet de sous-composants du registre (dont
  `SelectScrollUpButton`/`DownButton`, `SelectGroup`, `SelectLabel`, `SelectSeparator`)
  alors que rien dans ce projet ne les utilise aujourd'hui — choix délibéré pour rester
  compatible avec un futur `shadcn add select`, mais c'est du code mort pour l'instant.

## Historique — conception d'origine (Radix UI, abandonnée)

La première version de ce spec prévoyait `@radix-ui/react-tooltip`,
`@radix-ui/react-switch`, `@radix-ui/react-select`, `@radix-ui/react-slot`, style
`new-york`, `cn()` dans `src/lib/utils.ts`, alias `@/*` → `./src/*`. Un plan
d'implémentation en 7 tâches a été écrit et exécuté en subagent-driven-development
dans un worktree isolé (`feature/preline-to-shadcn`). La Task 1 (fondation + Tooltip)
et une grande partie de la Task 2 (Button) ont été implémentées et revues avec succès
sur cette base avant le pivot. Le worktree et la branche ont été supprimés après le
pivot vers Base UI — l'implémentation Radix n'existe plus que dans cet historique.
