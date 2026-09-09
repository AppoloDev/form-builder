# Conditional Rules Redesign — Design Spec

## Context

`ChoiceGroup` (radio/checkbox) currently supports "conditional fields": each
`OptionItem` carries its own `showConditionalField: boolean` and
`children: Block[]`. A per-option eye-icon toggle reveals an inline,
indented zone directly under that option where follow-up blocks are added.

This is purely a builder/authoring concept — nothing in this codebase
evaluates these conditions at form-fill time (no runtime renderer exists
here). The feature exists to let form authors group follow-up questions
under the option that should trigger them, for whatever external system
later consumes and renders the published form JSON.

`Select` (dropdown) has no equivalent feature today, and its `options` are
plain `string[]` with no stable identity per option.

## Goals

Redesign the authoring UX to match Tally's pattern — a rules section
*below* the block, built from selects — while keeping the key difference
requested: rules hold real, directly-added blocks (not references to
existing fields elsewhere in the form, as Tally does).

Extend the feature to both `ChoiceGroup` and `Select`.

## Non-goals

- No runtime evaluation engine. This remains an authoring/schema concern.
- No support for a single rule targeting multiple options (OR logic). One
  rule = one option; multiple options need multiple rules.
- No redesign of Select's option-editing UI/location (settings-panel list
  via `OptionsEdition`) beyond giving each option a stable `id`.

## Data Model

```ts
// OptionItem simplifies — conditional children move out of the option itself
export type OptionItem = {
    id: string;
    label: string;
    value: string;
};

// New shared shape, used by both ChoiceGroup and Select
export type ConditionRule = {
    id: string;
    optionId: string;   // references an OptionItem.id (ChoiceGroup) or SelectOption.id (Select)
    children: Block[];
};

// Select gains stable option identity (previously plain string[])
export type SelectOption = {
    id: string;
    label: string;
};
```

- `ChoiceGroupProps`: drops nothing at the props level, but its
  `OptionItem` entries simplify as above. Gains `conditions?: ConditionRule[]`.
- `SelectProps.options` changes type from `string[]` to `SelectOption[]`.
  Gains `conditions?: ConditionRule[]`.
- A rule references its option by **stable id**, not by label/value text.
  Renaming an option's label never orphans a rule (the concrete problem
  with referencing by value, since ChoiceGroup's `value` today always
  mirrors `label`, and Select had no per-option identity at all).

## Canvas UI

Below the option list (both blocks), one row per existing rule:

```
┃ Si [Select: option ▾] est sélectionné              🗑
┃   (zone de blocs — Empty / ChildrenSorter / AddMenu,
┃    identique à l'actuel, rattachée à la règle plutôt qu'à l'option)
```

- Left-border accent (`border-l-2 border-border pl-4`, matching the
  existing conditional-zone treatment) — no filled background/box.
- Nothing renders in this area if `conditions` is empty.
- The option-picker select lists the block's current options, excluding
  any option already targeted by another rule (no duplicate rules on the
  same option). The rule's own currently-selected option always remains
  visible in its own select even if that would otherwise be "used".
- Block-adding zone per rule reuses `Empty` (empty state), `ChildrenSorter`
  (reorder), and `AddMenu` (add-block picker) exactly as today's per-option
  zone does, now operating on `rule.children` instead of `option.children`.

## Adding / Removing Rules

- **Add**: a "+ Ajouter une condition" button lives in the block's settings
  panel (gear icon / edition items), alongside the existing Titre/Message
  d'aide/Requis fields. Clicking it appends a new rule with an unset
  `optionId` (or the first unused option, if any) and empty `children`.
  Disabled when there are no options yet on the block.
- **Remove**: a trash icon on the rule's own row, on canvas — not in
  settings. Matches how block/option deletion works elsewhere (control
  lives where the thing being deleted is shown).
- **Auto-cleanup**: deleting an option also deletes any rule that targeted
  it. This matches current behavior, where deleting an option today
  implicitly deletes its nested children (since they lived inside the
  option object).

## Store Changes

`recurseIntoChildren` in `src/stores/block.store.ts` currently special-cases
`ChoiceGroup.options[].children`. It generalizes to recurse into
`(ChoiceGroup | Select).conditions[].children` instead — a single
`conditions` array shape shared by both block types, rather than a
per-block-type-shaped traversal.

```ts
const recurseIntoChildren = (block: Block, recurse: (children: Block[]) => Block[]): Block => {
    if (block.type === 'FieldSet' || block.type === 'Repeatable') {
        if (block.children.length === 0) return block;
        return { ...block, children: recurse(block.children) };
    }

    if (block.type === 'ChoiceGroup' || block.type === 'Select') {
        const conditions = block.conditions ?? [];
        if (conditions.length === 0) return block;
        const nextConditions = conditions.map((rule) =>
            rule.children.length === 0 ? rule : { ...rule, children: recurse(rule.children) }
        );
        return { ...block, conditions: nextConditions };
    }

    return block;
};
```

## Migration

Existing saved forms may still use the old shapes:
- `ChoiceGroup` options carrying `showConditionalField`/`children`.
- `Select.options` as `string[]`.

A migration pass runs whenever blocks are loaded into the store (inside
`setBlocks`, so every entry point is covered), walking the block tree
recursively (including into `FieldSet`/`Repeatable`/`conditions[].children`,
in case a legacy `ChoiceGroup`/`Select` is nested):

- For each `ChoiceGroup`: any option with a truthy `showConditionalField`
  and non-empty `children` becomes a new entry in that block's
  `conditions` array: `{ id: uuid(), optionId: option.id, children: option.children }`.
  The option itself is rewritten to drop `showConditionalField`/`children`,
  keeping only `{ id, label, value }`.
- For each `Select`: if `options` is an array of strings, convert to
  `options.map(label => ({ id: uuid(), label }))`.
- Blocks already in the new shape pass through unchanged (migration is
  idempotent — safe to run on every load).

**Compatibility caveat**: this migration only upgrades JSON once it's
loaded into this builder. It does not retroactively rewrite JSON already
exported/stored in an external system, and does not change what the
builder previously exported. Any external system that renders/fills the
published form from this JSON (if one exists) will need its own update to
understand the new `conditions` and `SelectOption` shapes before it can
consume forms saved with this new version of the builder.

## Files Touched

- `src/components/Blocks/Definition.ts` — type changes described above.
- `src/stores/block.store.ts` — generalized `recurseIntoChildren`, new
  migration function invoked from `setBlocks`.
- `src/components/Blocks/ChoiceGroupInput.tsx` — remove per-option
  toggle/inline zone and `showConditionalField`; add the settings-panel
  "+ Ajouter une condition" button; render the new conditions section.
- `src/components/Blocks/Select.tsx` — switch `options` to `SelectOption[]`;
  add the same settings-panel button and conditions section.
- `src/components/Edition/OptionsEdition.tsx` — operate on
  `{id, label}[]` instead of `string[]`, generating an id on add;
  otherwise unchanged UI.
- New: `src/components/Blocks/ConditionRules.tsx` — shared component
  rendering the rule list + per-rule option-select, delete button, and
  block-adding zone, used identically by `ChoiceGroupInput` and `Select`.

## Testing

No automated test suite exists in this repo currently (verification for
this project has consistently been `tsc --noEmit` + `pnpm run build` +
`pnpm run lint` + manual dev-server smoke checks, per established
practice this session). The implementation plan should verify:

- A fresh `ChoiceGroup`/`Select` block: adding options, adding a
  condition, adding blocks inside it, removing the rule, removing an
  option that has a rule (rule disappears with it).
- Loading a hand-crafted legacy-shape JSON blob (old `showConditionalField`
  option and old `Select.options: string[]`) through `setBlocks` and
  confirming it comes out in the new shape, functionally equivalent.
- Nested case: a `ChoiceGroup` placed inside another rule's `children`
  still gets its own working conditions section.
