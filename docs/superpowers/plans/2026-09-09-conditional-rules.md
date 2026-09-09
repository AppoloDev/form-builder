# Conditional Rules Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace ChoiceGroup's per-option inline "conditional field" toggle with a shared, Tally-style rules section (rendered below the option list, added via a settings-panel button) that also extends to Select, where each rule targets one option by stable id and holds directly-added blocks.

**Architecture:** `OptionItem` loses its embedded `showConditionalField`/`children`; a new `ConditionRule` type (`{id, optionId, children}`) lives in a `conditions` array on both `ChoiceGroupProps` and `SelectProps`. A new shared `ConditionRules` component renders and edits that array identically for both blocks. `Select.options` gains stable ids (`SelectOption = {id, label}`, replacing plain strings). The store's block-tree recursion generalizes from "ChoiceGroup options' children" to "ChoiceGroup/Select conditions' children", and a migration pass upgrades legacy-shaped blocks (old per-option toggle, old string-array Select options) whenever blocks are loaded into the store.

**Tech Stack:** React 19, TypeScript, Zustand, shadcn/ui on Base UI (`Select`, `Button`), `uuid` for id generation. No test runner exists in this repo — verification is `pnpm exec tsc --noEmit`, `pnpm run build`, `pnpm run lint`, plus manual dev-server checks, matching this project's established practice.

**Spec:** `docs/superpowers/specs/2026-09-09-conditional-rules-design.md`

## Global Constraints

- One rule targets exactly one option, referenced by stable `id` (never by label/value text) — spec section "Data Model".
- Rules render below the option list with a left-border accent (`border-l-2 border-border pl-4`), no filled background — spec section "Canvas UI".
- The "+ Ajouter une condition" trigger lives in the block's settings panel (`editionItems`), disabled when the block has zero options. Rule deletion is a trash icon on the rule's own canvas row — spec section "Adding / Removing Rules".
- Deleting an option must also delete any rule that targeted it (auto-cleanup) — spec section "Adding / Removing Rules".
- A block rendered as a follow-up (inside another rule's `children`) must not itself offer "+ Ajouter une condition" — this already exists today via the `useContionnalField={false}` prop that `ChildrenSorter`'s `FollowUpRenderer` passes to every follow-up block; `Select` must start honoring this prop (it doesn't today) for parity with `ChoiceGroup`.
- Migration must be idempotent — safe to run on every `setBlocks` call, whether the incoming data is legacy-shaped, new-shaped, or mixed (nested) — spec section "Migration".
- **This session's user has a standing instruction: do not run `git commit` — they commit manually.** Every task ends with staging the changed files, not committing. Do not run `git commit` even though the step template below shows one — skip that command specifically.
- No test framework exists (`pnpm run typecheck`/`build`/`lint` only, no `vitest`/`jest`, confirmed absent from `package.json` and the tree). Do not introduce one. Verification steps below use `tsc`/`build`/`lint` plus concrete manual/dev-server checks instead of automated tests.
- Because this is a coupled, statically-typed multi-file refactor, `pnpm exec tsc --noEmit` will show **expected, temporary** errors in files a not-yet-run task will fix. Each task below states exactly which files should still error and why — treat errors in any *other* file as a real regression.

---

### Task 1: Data model + store (types, recursion, migration)

**Files:**
- Modify: `src/components/Blocks/Definition.ts`
- Modify: `src/stores/block.store.ts`

**Interfaces:**
- Produces: `OptionItem = { id: string; label: string; value: string }` (simplified — no more `showConditionalField`/`children`).
- Produces: `export type ConditionRule = { id: string; optionId: string; children: Block[] }`.
- Produces: `export type SelectOption = { id: string; label: string }`.
- Produces: `ChoiceGroupProps.conditions?: ConditionRule[]`.
- Produces: `SelectProps.options: SelectOption[]` (was `string[]`), `SelectProps.conditions?: ConditionRule[]`.
- Produces: `useFormBuilderStore.setBlocks` now migrates its input before storing it (same signature, same external behavior for already-new-shaped data).

- [ ] **Step 1: Update `OptionItem` and add the new shared types in `src/components/Blocks/Definition.ts`**

Replace the existing `OptionItem` type (around line 161):

```ts
export type OptionItem = {
    id: string;
    label: string;
    value: string;
};

export type SelectOption = {
    id: string;
    label: string;
};

export type ConditionRule = {
    id: string;
    optionId: string;
    children: Block[];
};
```

- [ ] **Step 2: Update `ChoiceGroupProps` and `SelectProps`**

`ChoiceGroupProps` (around line 44) gains one field — add `conditions?: ConditionRule[];` right after `options: OptionItem[];`:

```ts
export interface ChoiceGroupProps extends BaseBlockProps {
    type: 'ChoiceGroup';
    label: string;
    name: string;
    helpText?: string;
    required?: boolean;
    inline?: boolean;
    multiple?: boolean;
    options: OptionItem[];
    conditions?: ConditionRule[];
}
```

`SelectProps` (around line 132) changes `options`'s type and gains `conditions`:

```ts
export interface SelectProps extends BaseBlockProps {
    type: 'Select';
    label: string;
    name: string;
    helpText?: string;
    required?: boolean;
    multiple?: boolean;
    options: SelectOption[];
    conditions?: ConditionRule[];
}
```

- [ ] **Step 3: Update the two `defaultProps` blocks in `blockDefinitions`**

`ChoiceGroup.defaultProps` (around line 304) gains `conditions: []`:

```ts
defaultProps: {
    type: "ChoiceGroup",
    label: "Libellé",
    name: labelToName("Libellé"),
    helpText: "",
    required: false,
    inline: false,
    multiple: false,
    options: [],
    conditions: [],
},
```

`Select.defaultProps` (around line 476) gains `conditions: []` (its `options: []` line is unchanged — an empty array satisfies the new `SelectOption[]` type as-is):

```ts
defaultProps: {
    type: "Select",
    label: "Libellé",
    name: labelToName("Libellé"),
    helpText: "",
    required: false,
    multiple: false,
    options: [],
    conditions: [],
},
```

- [ ] **Step 4: Generalize `recurseIntoChildren` in `src/stores/block.store.ts`**

Replace the existing function:

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

- [ ] **Step 5: Add the migration function in `src/stores/block.store.ts`**

Add this import at the top of the file, alongside the existing ones:

```ts
import { v4 as uuidv4 } from "uuid";
```

Add these two functions right after `recurseIntoChildren` (they use it, so must come after):

```ts
// Upgrades one block from a legacy shape to the current one. Idempotent —
// a block already in the new shape passes through unchanged, so this is
// safe to run on every load regardless of the input's actual shape.
const migrateBlock = (block: Block): Block => {
    if (block.type === 'ChoiceGroup') {
        const conditions: ConditionRule[] = [...(block.conditions ?? [])];

        // Legacy JSON may still carry showConditionalField/children on an
        // option even though OptionItem's type no longer declares them —
        // this cast is the intentional escape hatch for reading that.
        const legacyOptions = block.options as Array<OptionItem & { showConditionalField?: boolean; children?: Block[] }>;

        const options: OptionItem[] = legacyOptions.map((option) => {
            const { showConditionalField, children, ...rest } = option;
            if (showConditionalField && children && children.length > 0) {
                conditions.push({ id: uuidv4(), optionId: option.id, children });
            }
            return rest;
        });

        return {
            ...block,
            options,
            conditions: conditions.map((rule) => ({ ...rule, children: rule.children.map(migrateBlock) })),
        };
    }

    if (block.type === 'Select') {
        // Legacy JSON may still have options as plain strings.
        const legacyOptions = block.options as unknown as Array<string | SelectOption>;

        const options: SelectOption[] = legacyOptions.map((option) =>
            typeof option === 'string' ? { id: uuidv4(), label: option } : option
        );

        return {
            ...block,
            options,
            conditions: (block.conditions ?? []).map((rule) => ({ ...rule, children: rule.children.map(migrateBlock) })),
        };
    }

    return recurseIntoChildren(block, (children) => children.map(migrateBlock));
};

const migrateBlocks = (blocks: Block[]): Block[] => blocks.map(migrateBlock);
```

- [ ] **Step 6: Wire the migration into `setBlocks`**

Change:

```ts
setBlocks: (blocks) => {
    set({ blocks });
},
```

to:

```ts
setBlocks: (blocks) => {
    set({ blocks: migrateBlocks(blocks) });
},
```

- [ ] **Step 7: Verify**

Run `pnpm exec tsc --noEmit`. Expected: errors ONLY in `src/components/Blocks/ChoiceGroupInput.tsx`, `src/components/Blocks/Select.tsx`, and `src/components/AddMenu.tsx` (they still reference the old `showConditionalField`/`children` fields and the old `string[]` Select options — Tasks 4, 5, and 6 fix these). If `Definition.ts` or `block.store.ts` themselves appear in the error list, that's a real bug in this task — fix it before moving on.

Also run a quick manual sanity check of the migration function itself, since there's no test runner: temporarily add this snippet at the bottom of `src/stores/block.store.ts` (after the `create<FormBuilderState>(...)` call), start the dev server (`pnpm run dev`), and open the browser console on the page that renders `FormBuilder` — or, if nothing renders it yet in this repo, temporarily call it from `src/FormBuilder.tsx`'s existing `useEffect(() => setBlocks(json), [])` by logging before/after:

```ts
// TEMPORARY — remove after checking the console output
console.log(migrateBlocks([
    {
        id: "cg-1", type: "ChoiceGroup", label: "Test", name: "test", options: [
            { id: "opt-1", label: "A", value: "A", showConditionalField: true, children: [{ id: "t-1", type: "Title", text: "Hi", heading: "h2" }] } as any,
            { id: "opt-2", label: "B", value: "B", showConditionalField: false, children: [] } as any,
        ]
    } as any,
    { id: "sel-1", type: "Select", label: "Test2", name: "test2", options: ["X", "Y"] as any },
]));
```

Expected console output (ids will differ — only the shape matters): the `ChoiceGroup` block has `options: [{id:"opt-1",label:"A",value:"A"}, {id:"opt-2",label:"B",value:"B"}]` (no `showConditionalField`/`children` left on either option) and `conditions: [{id: <uuid>, optionId: "opt-1", children: [{id:"t-1", type:"Title", ...}]}]`. The `Select` block has `options: [{id: <uuid>, label:"X"}, {id: <uuid>, label:"Y"}]` and `conditions: []`.

Remove the temporary snippet once confirmed. Stage `src/components/Blocks/Definition.ts` and `src/stores/block.store.ts` (do not commit).

---

### Task 2: `OptionsEdition` — id-bearing options

**Files:**
- Modify: `src/components/Edition/OptionsEdition.tsx`

**Interfaces:**
- Consumes: `SelectOption` type from Task 1 (`src/components/Blocks/Definition.ts`).
- Produces: `OptionsEdition`'s `value`/`onChange` now operate on `SelectOption[]` instead of `string[]` — `Select.tsx` (Task 5) will pass/receive this shape.

- [ ] **Step 1: Replace the file's contents**

```tsx
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { v4 as uuidv4 } from "uuid";
import { SelectOption } from "../Blocks/Definition";

type Props = {
    label: string;
    value: SelectOption[];
    helpText?: string;
    onChange: (next: SelectOption[]) => void;
};

export const OptionsEdition = ({ label, value = [], helpText, onChange }: Props) => {
    const add = () => onChange([...value, { id: uuidv4(), label: "Nouvelle option" }]);
    const update = (idx: number, label: string) => {
        const next = [...value];
        next[idx] = { ...next[idx], label };
        onChange(next);
    };
    const remove = (idx: number) => {
        const next = value.filter((_, i) => i !== idx);
        onChange(next);
    };

    return (
        <div className="mb-3">
            <div className="flex items-center justify-between mb-1">
                <label className="block text-sm font-medium text-foreground">{label}</label>
                <Button type="button" size="sm" variant="secondary" onClick={add}>
                    + Ajouter
                </Button>
            </div>

            <div className="space-y-2">
                {value.map((opt, idx) => (
                    <div key={opt.id} className="flex items-center gap-2">
                        <Input
                            value={opt.label}
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
                <p className="mt-1 text-xs text-muted-foreground italic">{helpText}</p>
            )}
        </div>
    );
};
```

- [ ] **Step 2: Verify**

Run `pnpm exec tsc --noEmit`. Expected: the same three files from Task 1's verification (`ChoiceGroupInput.tsx`, `Select.tsx`, `AddMenu.tsx`) still error — `Select.tsx` will now ALSO show a new error where it passes `form.options` (still `string[]` until Task 5) into `<OptionsEdition value={...}>`, which is fine, same expected category. No error should appear that names `OptionsEdition.tsx` itself.

Stage `src/components/Edition/OptionsEdition.tsx` (do not commit).

---

### Task 3: Shared `ConditionRules` component

**Files:**
- Create: `src/components/Blocks/ConditionRules.tsx`

**Interfaces:**
- Consumes: `Block`, `BlockDefinition`, `ConditionRule` types from `./Definition` (Task 1); `Empty` (`../Empty`), `AddMenu` (`../AddMenu`), `ChildrenSorter` (`./ChildrenSorter`) — all pre-existing, unchanged.
- Produces:

```ts
type OptionChoice = { id: string; label: string };

type ConditionRulesProps = {
    conditions: ConditionRule[];
    options: OptionChoice[];
    onChangeRuleOption: (ruleId: string, optionId: string) => void;
    onRemoveRule: (ruleId: string) => void;
    onAddBlockToRule: (ruleId: string, def: BlockDefinition, overrides?: Record<string, any>) => void;
    onReorderRuleChildren: (ruleId: string, next: Block[]) => void;
};
```

Consumed by `ChoiceGroupInput.tsx` (Task 4) and `Select.tsx` (Task 5), both passing `options` as `{id, label}[]` derived from their own option list.

- [ ] **Step 1: Create the file**

```tsx
import { Trash } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { Select as SelectField, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { AddMenu } from "../AddMenu";
import { Empty } from "../Empty";
import { ChildrenSorter } from "./ChildrenSorter";
import { Block, BlockDefinition, ConditionRule } from "./Definition";

type OptionChoice = { id: string; label: string };

type Props = {
    conditions: ConditionRule[];
    options: OptionChoice[];
    onChangeRuleOption: (ruleId: string, optionId: string) => void;
    onRemoveRule: (ruleId: string) => void;
    onAddBlockToRule: (ruleId: string, def: BlockDefinition, overrides?: Record<string, any>) => void;
    onReorderRuleChildren: (ruleId: string, next: Block[]) => void;
};

export const ConditionRules = (
    {
        conditions,
        options,
        onChangeRuleOption,
        onRemoveRule,
        onAddBlockToRule,
        onReorderRuleChildren,
    }: Props) => {
    if (conditions.length === 0) return null;

    return (
        <div className="space-y-4">
            {conditions.map((rule) => {
                // An option already claimed by another rule is hidden from
                // this rule's picker — except the option this rule itself
                // already targets, which must stay visible in its own select.
                const availableOptions = options.filter(
                    (opt) => opt.id === rule.optionId ||
                        !conditions.some((other) => other.id !== rule.id && other.optionId === opt.id)
                );

                return (
                    <div key={rule.id} className="space-y-3 border-l-2 border-border pl-4">
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground">Si</span>

                            <SelectField
                                items={availableOptions.map((opt) => ({value: opt.id, label: opt.label || "Option sans nom"}))}
                                value={rule.optionId}
                                onValueChange={(v) => onChangeRuleOption(rule.id, v ?? "")}
                            >
                                <SelectTrigger className="h-8 w-auto min-w-40">
                                    <SelectValue placeholder="Choisir une option…"/>
                                </SelectTrigger>
                                <SelectContent>
                                    {availableOptions.map((opt) => (
                                        <SelectItem key={opt.id} value={opt.id}>
                                            {opt.label || "Option sans nom"}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </SelectField>

                            <span className="text-sm text-muted-foreground">est sélectionné</span>

                            <Button
                                type="button"
                                variant="ghost"
                                size="icon-sm"
                                onClick={() => onRemoveRule(rule.id)}
                                className="ml-auto text-destructive hover:text-destructive"
                                aria-label="Supprimer la condition"
                            >
                                <Trash/>
                            </Button>
                        </div>

                        {rule.children.length === 0 ? (
                            <Empty onPick={(def, overrides) => onAddBlockToRule(rule.id, def, overrides)}/>
                        ) : (
                            <>
                                <ChildrenSorter
                                    childrenBlocks={rule.children}
                                    onReorder={(next) => onReorderRuleChildren(rule.id, next)}
                                />

                                <div className="pt-1">
                                    <AddMenu onPick={(def, overrides) => onAddBlockToRule(rule.id, def, overrides)}>
                                        <Button type="button" size="sm">
                                            Ajouter un bloc
                                        </Button>
                                    </AddMenu>
                                </div>
                            </>
                        )}
                    </div>
                );
            })}
        </div>
    );
};
```

- [ ] **Step 2: Verify**

Run `pnpm exec tsc --noEmit`. Expected: identical error list to the end of Task 2 (this new file isn't imported anywhere yet, so it can't introduce new errors elsewhere; it should show zero errors of its own). Run `pnpm run build && rm -rf dist` — an unused-but-valid file does not break the build. Run `pnpm run lint` — expect only the same already-tolerated categories (`@typescript-eslint/no-explicit-any` on the `overrides?: Record<string, any>` parameters, matching the existing convention used by `Empty.tsx`/`AddMenu.tsx` for the same parameter).

Stage `src/components/Blocks/ConditionRules.tsx` (do not commit).

---

### Task 4: `ChoiceGroupInput.tsx` — drop per-option toggle, add conditions section

**Files:**
- Modify: `src/components/Blocks/ChoiceGroupInput.tsx`

**Interfaces:**
- Consumes: `ConditionRule`, `OptionItem` (Task 1); `ConditionRules` (Task 3).
- Produces: no external interface change — `ChoiceGroupInput`'s own prop shape gains `conditions?: ConditionRule[]` (mirroring `ChoiceGroupProps`), consumed by `ChildrenSorter`'s generic `<Comp {...child} .../>` spread (no code change needed there).

- [ ] **Step 1: Replace the file's contents**

```tsx
import { FC, useEffect, useMemo, useState } from "react";
import { FieldInput } from "./FieldInput";
import { TextEdition } from "../Edition/TextEdition";
import { CheckboxEdition } from "../Edition/CheckboxEdition";
import { ConditionRules } from "./ConditionRules";
import { Block, BlockDefinition, ConditionRule, OptionItem } from "./Definition";
import { createBlockFromTemplate } from "../../utilities/block.utiles";
import { useFormBuilderStore } from "../../stores/block.store";
import { v4 as uuidv4 } from "uuid";
import { Button } from "@/src/components/ui/button";
import { Input } from "../ui/input";
import { Checkbox } from "../ui/checkbox";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { labelToName } from "../../utilities/string.utiles";
import { Plus, Trash } from "lucide-react";

type Props = {
    id: string;
    helpText?: string;
    label?: string;
    name?: string;
    required?: boolean;
    multiple?: boolean;
    options?: OptionItem[];
    conditions?: ConditionRule[];
    useContionnalField?: boolean;
    isChildBlock?: boolean;
    preview?: boolean;
};

const ChoiceGroupInput: FC<Props> = (props) => {
    const {
        id,
        helpText: propsHelpText,
        label: propsLabel,
        name: propsName,
        required: propsRequired,
        multiple: propsMultiple,
        options: propsOptions,
        conditions: propsConditions,
        useContionnalField: propsUseContionnalField = true,
        isChildBlock,
        preview,
    } = props;

    const {updateBlock} = useFormBuilderStore();

    const [form, setForm] = useState({
        label: propsLabel || "",
        name: propsName || labelToName(propsLabel || ""),
        helpText: propsHelpText || "",
        required: propsRequired ?? false,
        multiple: propsMultiple ?? false,
        options: (propsOptions || []) as OptionItem[],
        conditions: (propsConditions || []) as ConditionRule[],
    });

    const [pendingFocusOptionId, setPendingFocusOptionId] = useState<string | null>(null);

    useEffect(() => {
        if (!pendingFocusOptionId) return;
        const el = document.querySelector<HTMLInputElement>(`[data-option-id="${pendingFocusOptionId}"]`);
        el?.focus();
        setPendingFocusOptionId(null);
    }, [pendingFocusOptionId, form.options]);

    useEffect(() => {
        setForm({
            label: propsLabel || "",
            name: propsName || labelToName(propsLabel || ""),
            helpText: propsHelpText || "",
            required: propsRequired ?? false,
            multiple: propsMultiple ?? false,
            options: (propsOptions || []) as OptionItem[],
            conditions: (propsConditions || []) as ConditionRule[],
        });
    }, [
        propsLabel,
        propsName,
        propsHelpText,
        propsRequired,
        propsMultiple,
        JSON.stringify(propsOptions),
        JSON.stringify(propsConditions),
    ]);

    useEffect(() => {
        if (form.options.length === 0) {
            const defaults: OptionItem[] = [
                {id: uuidv4(), label: "", value: ""},
            ];
            const patch = {options: defaults};
            setForm(prev => ({...prev, ...patch}));
            updateBlock(id, patch);
        }
    }, []);

    const handleChange = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) => {
        if (key === 'label') {
            const newName = labelToName(value as string);
            const patch = {label: value as string, name: newName};
            setForm(prev => ({...prev, ...patch}));
            updateBlock(id, patch);
        } else {
            const patch = {[key]: value};
            setForm(prev => ({...prev, ...patch as Partial<typeof form>}));
            updateBlock(id, patch);
        }
    };

    const addCondition = () => {
        const usedOptionIds = new Set(form.conditions.map((r) => r.optionId));
        const firstUnused = form.options.find((o) => !usedOptionIds.has(o.id));
        const newRule: ConditionRule = {id: uuidv4(), optionId: firstUnused?.id ?? "", children: []};
        const patch = {conditions: [...form.conditions, newRule]};
        setForm(prev => ({...prev, ...patch}));
        updateBlock(id, patch);
    };

    const updateRuleOption = (ruleId: string, optionId: string) => {
        const nextConditions = form.conditions.map((r) => (r.id === ruleId ? {...r, optionId} : r));
        const patch = {conditions: nextConditions};
        setForm(prev => ({...prev, ...patch}));
        updateBlock(id, patch);
    };

    const removeRule = (ruleId: string) => {
        const nextConditions = form.conditions.filter((r) => r.id !== ruleId);
        const patch = {conditions: nextConditions};
        setForm(prev => ({...prev, ...patch}));
        updateBlock(id, patch);
    };

    const addBlockToRule = (ruleId: string, def: BlockDefinition, overrides?: Record<string, any>) => {
        const newBlock = createBlockFromTemplate(def, overrides);
        const nextConditions = form.conditions.map((r) =>
            r.id === ruleId ? {...r, children: [...r.children, newBlock]} : r
        );
        const patch = {conditions: nextConditions};
        setForm(prev => ({...prev, ...patch}));
        updateBlock(id, patch);
    };

    const reorderRuleChildren = (ruleId: string, nextChildren: Block[]) => {
        const nextConditions = form.conditions.map((r) =>
            r.id === ruleId ? {...r, children: nextChildren} : r
        );
        const patch = {conditions: nextConditions};
        setForm(prev => ({...prev, ...patch}));
        updateBlock(id, patch);
    };

    const editionItems = useMemo(
        () => {
            const items = [
                <TextEdition key="label" label="Titre" value={form.label} editItem={(v) => handleChange("label", v)}/>,
                <TextEdition key="helpText" label="Message d'aide" value={form.helpText} type="textarea"
                             editItem={(v) => handleChange("helpText", v)}/>,
                <CheckboxEdition key="required" label="Requis" checked={form.required}
                                 editItem={(v) => handleChange("required", v)}/>,
                <CheckboxEdition
                    key="multiple"
                    label="Sélections multiples"
                    checked={form.multiple}
                    editItem={(v) => handleChange("multiple", v)}
                />,
            ];

            const filtered = isChildBlock ? items.filter(item => item.key !== 'required') : [...items];

            if (propsUseContionnalField) {
                filtered.push(
                    <Button
                        key="addCondition"
                        type="button"
                        variant="secondary"
                        size="sm"
                        onClick={addCondition}
                        disabled={form.options.length === 0}
                    >
                        <Plus className="size-4"/>
                        Ajouter une condition
                    </Button>
                );
            }

            return filtered;
        },
        [form.label, form.helpText, form.required, form.multiple, form.options, form.conditions, isChildBlock, propsUseContionnalField]
    );

    const addOption = () => {
        const newOption = {id: uuidv4(), label: "", value: ""};

        const patch = {options: [...form.options, newOption]};
        setForm(prev => ({...prev, ...patch}));
        updateBlock(id, patch);
        setPendingFocusOptionId(newOption.id);
    };

    const updateOption = (idx: number, optionPatch: Partial<OptionItem>) => {
        const nextOptions = form.options.map((o, i) => (i === idx ? {...o, ...optionPatch} : o));

        const patch = {options: nextOptions};
        setForm(prev => ({...prev, ...patch}));
        updateBlock(id, patch);
    };

    const removeOption = (idx: number) => {
        const removedId = form.options[idx].id;
        const nextOptions = form.options.filter((_, i) => i !== idx);
        const nextConditions = form.conditions.filter((r) => r.optionId !== removedId);

        const patch = {options: nextOptions, conditions: nextConditions};
        setForm(prev => ({...prev, ...patch}));
        updateBlock(id, patch);
    };

    const renderOptionRow = (opt: OptionItem, idx: number) => (
        <div key={opt.id} className="group/option relative rounded-md">
            <div className="flex items-center gap-2">
                {form.multiple ? (
                    <Checkbox disabled/>
                ) : (
                    <RadioGroupItem value={opt.id} disabled/>
                )}

                <Input
                    data-option-id={opt.id}
                    value={opt.label}
                    placeholder={`Option ${idx + 1}`}
                    onChange={(e) =>
                        updateOption(idx, {label: e.target.value, value: e.target.value})
                    }
                    className="border-transparent bg-transparent hover:border-input focus-visible:border-ring"
                />

                <div className="flex gap-0.5 opacity-0 transition-opacity group-hover/option:opacity-100">
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => removeOption(idx)}
                        className="text-destructive hover:text-destructive"
                        aria-label="Supprimer l'option"
                    >
                        <Trash/>
                    </Button>
                </div>
            </div>
        </div>
    );

    return (
        <FieldInput id={id} form={form} editionItems={editionItems} preview={preview}
                    onLabelChange={(v) => handleChange("label", v)}>
            <div className="space-y-3">
                {form.multiple ? (
                    <div className="space-y-1">
                        {form.options.map(renderOptionRow)}
                    </div>
                ) : (
                    <RadioGroup className="space-y-1">
                        {form.options.map(renderOptionRow)}
                    </RadioGroup>
                )}

                <div className="flex justify-start">
                    <Button type="button" variant="ghost" onClick={addOption}
                            className="text-muted-foreground">
                        <Plus/>
                        Ajouter une option
                    </Button>
                </div>

                {propsUseContionnalField && (
                    <ConditionRules
                        conditions={form.conditions}
                        options={form.options.map((o) => ({id: o.id, label: o.label}))}
                        onChangeRuleOption={updateRuleOption}
                        onRemoveRule={removeRule}
                        onAddBlockToRule={addBlockToRule}
                        onReorderRuleChildren={reorderRuleChildren}
                    />
                )}
            </div>
        </FieldInput>
    );
};

export default ChoiceGroupInput;
```

Note what's gone versus the previous version: the `Empty`/`AddMenu`/`ChildrenSorter`/`EyeClosedIcon`/`EyeIcon` imports (moved into `ConditionRules`), the per-option eye-icon toggle button, and the per-option inline conditional `<div>` block.

- [ ] **Step 2: Verify**

Run `pnpm exec tsc --noEmit`. Expected: errors ONLY in `src/components/Blocks/Select.tsx` and `src/components/AddMenu.tsx` now (Tasks 5 and 6 fix these). `ChoiceGroupInput.tsx` must show zero errors.

Run `pnpm run dev` and check the following manually in the browser (or via the dev server's served-file content if no browser is available, matching this session's established limitation — in that case, skip the interactive checks and rely on the code review instead):
1. Add a `ChoiceGroup` block, add two options ("A" and "B").
2. Open its settings (gear icon) — confirm a "+ Ajouter une condition" button appears below "Sélections multiples", enabled (options exist).
3. Click it — confirm a rule row appears below the options on the canvas, with a select defaulted to option "A", "est sélectionné" text, and a trash icon.
4. Add a block inside that rule via its "Ajouter un bloc" — confirm it appears nested under the rule with the left-border accent.
5. Add a second condition — confirm its select excludes "A" (already used) and defaults to "B".
6. Delete option "A" from the option list — confirm the first rule (which targeted "A") disappears along with it.
7. Delete the remaining rule via its trash icon — confirm the whole conditions section disappears (since `conditions.length === 0` renders nothing).

Stage `src/components/Blocks/ChoiceGroupInput.tsx` (do not commit).

---

### Task 5: `Select.tsx` — id-bearing options, conditions section

**Files:**
- Modify: `src/components/Blocks/Select.tsx`

**Interfaces:**
- Consumes: `SelectOption`, `ConditionRule`, `Block`, `BlockDefinition` (Task 1); `OptionsEdition` (Task 2); `ConditionRules` (Task 3); `createBlockFromTemplate` (`../../utilities/block.utiles`, pre-existing, not previously imported here).
- Produces: `Select`'s own prop shape gains `conditions?: ConditionRule[]` and `useContionnalField?: boolean` (new — Select didn't accept this before; needed so a `Select` block used as a follow-up, via `ChildrenSorter`'s `useContionnalField={false}`, doesn't offer its own nested conditions, matching `ChoiceGroup`'s existing behavior).

- [ ] **Step 1: Replace the file's contents**

```tsx
import { useEffect, useState } from "react";
import { SelectProps, ConditionRule, SelectOption, BlockDefinition, Block } from "./Definition";
import { useFormBuilderStore } from "../../stores/block.store";
import { FieldInput } from "./FieldInput";
import { TextEdition } from "../Edition/TextEdition";
import { CheckboxEdition } from "../Edition/CheckboxEdition";
import { OptionsEdition } from "../Edition/OptionsEdition";
import { ConditionRules } from "./ConditionRules";
import { createBlockFromTemplate } from "../../utilities/block.utiles";
import { labelToName } from "../../utilities/string.utiles";
import { Select as SelectField, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Button } from "@/src/components/ui/button";
import { v4 as uuidv4 } from "uuid";
import { Plus } from "lucide-react";

type Props = Omit<SelectProps, 'id'> & { id: string; isChildBlock?: boolean; preview?: boolean; useContionnalField?: boolean };

const Select = (
    {
        id,
        label: propsLabel,
        name: propsName,
        helpText: propsHelpText,
        required: propsRequired,
        multiple: propsMultiple,
        options: propsOptions,
        conditions: propsConditions,
        isChildBlock,
        preview,
        useContionnalField: propsUseContionnalField = true,
    }: Props) => {
    const {updateBlock} = useFormBuilderStore();

    const [form, setForm] = useState({
        label: propsLabel || "",
        name: propsName || labelToName(propsLabel || ""),
        helpText: propsHelpText || "",
        required: propsRequired ?? false,
        multiple: propsMultiple ?? false,
        options: (propsOptions || []) as SelectOption[],
        conditions: (propsConditions || []) as ConditionRule[],
    });

    useEffect(() => {
        setForm({
            label: propsLabel || "",
            name: propsName || labelToName(propsLabel || ""),
            helpText: propsHelpText || "",
            required: propsRequired ?? false,
            multiple: propsMultiple ?? false,
            options: (propsOptions || []) as SelectOption[],
            conditions: (propsConditions || []) as ConditionRule[],
        });
    }, [propsLabel, propsName, propsHelpText, propsRequired, propsMultiple, JSON.stringify(propsOptions), JSON.stringify(propsConditions)]);

    useEffect(() => {
        if (form.options.length === 0) {
            const defaults: SelectOption[] = [
                {id: uuidv4(), label: "Option 1"},
                {id: uuidv4(), label: "Option 2"},
                {id: uuidv4(), label: "Option 3"},
            ];
            setForm(prev => ({...prev, options: defaults}));
            updateBlock(id, {options: defaults});
        }
    }, []);

    const handleChange = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) => {
        if (key === 'label') {
            const newName = labelToName(value as string);
            const patch = {label: value as string, name: newName};
            setForm(prev => ({...prev, ...patch}));
            updateBlock(id, patch);
        } else if (key === 'options') {
            // `value`'s static type here is still the generic `(typeof form)[K]`,
            // not narrowed by the runtime `key === 'options'` check — the
            // `unknown` bridge is required, a direct cast won't compile.
            const nextOptions = value as unknown as SelectOption[];
            const remainingIds = new Set(nextOptions.map((o) => o.id));
            const nextConditions = form.conditions.filter((r) => remainingIds.has(r.optionId));
            const patch = {options: nextOptions, conditions: nextConditions} as Partial<typeof form>;
            setForm(prev => ({...prev, ...patch}));
            updateBlock(id, patch);
        } else {
            const patch = {[key]: value};
            setForm(prev => ({...prev, ...patch as Partial<typeof form>}));
            updateBlock(id, patch);
        }
    };

    const addCondition = () => {
        const usedOptionIds = new Set(form.conditions.map((r) => r.optionId));
        const firstUnused = form.options.find((o) => !usedOptionIds.has(o.id));
        const newRule: ConditionRule = {id: uuidv4(), optionId: firstUnused?.id ?? "", children: []};
        const patch = {conditions: [...form.conditions, newRule]};
        setForm(prev => ({...prev, ...patch}));
        updateBlock(id, patch);
    };

    const updateRuleOption = (ruleId: string, optionId: string) => {
        const nextConditions = form.conditions.map((r) => (r.id === ruleId ? {...r, optionId} : r));
        const patch = {conditions: nextConditions};
        setForm(prev => ({...prev, ...patch}));
        updateBlock(id, patch);
    };

    const removeRule = (ruleId: string) => {
        const nextConditions = form.conditions.filter((r) => r.id !== ruleId);
        const patch = {conditions: nextConditions};
        setForm(prev => ({...prev, ...patch}));
        updateBlock(id, patch);
    };

    const addBlockToRule = (ruleId: string, def: BlockDefinition, overrides?: Record<string, any>) => {
        const newBlock = createBlockFromTemplate(def, overrides);
        const nextConditions = form.conditions.map((r) =>
            r.id === ruleId ? {...r, children: [...r.children, newBlock]} : r
        );
        const patch = {conditions: nextConditions};
        setForm(prev => ({...prev, ...patch}));
        updateBlock(id, patch);
    };

    const reorderRuleChildren = (ruleId: string, nextChildren: Block[]) => {
        const nextConditions = form.conditions.map((r) =>
            r.id === ruleId ? {...r, children: nextChildren} : r
        );
        const patch = {conditions: nextConditions};
        setForm(prev => ({...prev, ...patch}));
        updateBlock(id, patch);
    };

    const editionItems = [
        <TextEdition key="label" label="Titre" value={form.label} editItem={(v) => handleChange("label", v)}/>,
        <TextEdition key="helpText" label="Message d'aide" type="textarea" value={form.helpText}
                     editItem={(v) => handleChange("helpText", v)}/>,
        ...(isChildBlock ? [] : [
            <CheckboxEdition key="required" label="Requis" checked={form.required}
                             editItem={(v: boolean) => handleChange("required", v)}/>
        ]),
        <CheckboxEdition key="multiple" label="Sélection multiple" checked={form.multiple}
                         editItem={(v) => handleChange("multiple", v)}/>,
        <OptionsEdition key="options" label="Options" value={form.options}
                        onChange={(v) => handleChange("options", v)}
                        helpText="Ajoutez, modifiez ou supprimez les options"/>,
        ...(propsUseContionnalField ? [
            <Button
                key="addCondition"
                type="button"
                variant="secondary"
                size="sm"
                onClick={addCondition}
                disabled={form.options.length === 0}
            >
                <Plus className="size-4"/>
                Ajouter une condition
            </Button>
        ] : []),
    ];

    return (
        <FieldInput id={id} form={form} editionItems={editionItems} preview={preview}
                    onLabelChange={(v) => handleChange("label", v)}>
            <SelectField
                disabled
                items={form.options.map((opt) => ({value: opt.label, label: opt.label}))}
                defaultValue={form.options[0]?.label}
            >
                <SelectTrigger className="w-full">
                    <SelectValue placeholder="Sélectionner…"/>
                </SelectTrigger>
                <SelectContent>
                    {form.options.map((opt) => (
                        <SelectItem key={opt.id} value={opt.label}>{opt.label}</SelectItem>
                    ))}
                </SelectContent>
            </SelectField>

            {propsUseContionnalField && (
                <ConditionRules
                    conditions={form.conditions}
                    options={form.options.map((o) => ({id: o.id, label: o.label}))}
                    onChangeRuleOption={updateRuleOption}
                    onRemoveRule={removeRule}
                    onAddBlockToRule={addBlockToRule}
                    onReorderRuleChildren={reorderRuleChildren}
                />
            )}
        </FieldInput>
    );
};

export default Select;
```

- [ ] **Step 2: Verify**

Run `pnpm exec tsc --noEmit`. Expected: errors ONLY in `src/components/AddMenu.tsx` now (Task 6 fixes this). `Select.tsx` must show zero errors.

Manual dev-server check, same shape as Task 4's Step 2 but on a `Select` block: add options, add a condition, add a block inside it, remove an option and confirm its rule disappears too.

Stage `src/components/Blocks/Select.tsx` (do not commit).

---

### Task 6: `AddMenu.tsx` preview fix — final cleanup task

**Files:**
- Modify: `src/components/AddMenu.tsx`

**Interfaces:**
- Consumes: the new `OptionItem`/`SelectOption` shapes (Task 1).
- Produces: nothing new consumed elsewhere — this is the last task, and after it the whole project should compile and lint clean.

- [ ] **Step 1: Update `getPreviewProps`**

Replace:

```ts
if ((def.type === "ChoiceGroup" || def.type === "Select") && (!merged.options || merged.options.length === 0)) {
    merged.options = def.type === "ChoiceGroup"
        ? [{id: "preview-1", label: "", value: "", showConditionalField: false, children: []}]
        : ["Option 1", "Option 2", "Option 3"];
}
```

with:

```ts
if ((def.type === "ChoiceGroup" || def.type === "Select") && (!merged.options || merged.options.length === 0)) {
    merged.options = def.type === "ChoiceGroup"
        ? [{id: "preview-1", label: "", value: ""}]
        : [
            {id: "preview-1", label: "Option 1"},
            {id: "preview-2", label: "Option 2"},
            {id: "preview-3", label: "Option 3"},
        ];
}
```

- [ ] **Step 2: Verify — full project clean**

Run, in order:

1. `pnpm exec tsc --noEmit` — expect **zero errors, anywhere**.
2. `pnpm run build && rm -rf dist` — expect a clean build.
3. `pnpm run lint` — expect only the categories already tolerated project-wide before this plan started (`@typescript-eslint/no-explicit-any`, `react-hooks/set-state-in-effect`, `react-hooks/exhaustive-deps`, `react-refresh/only-export-components`). No new category, and no new occurrence of an existing category in a file this plan didn't touch.

Manual dev-server check: open the `AddMenu` picker (the "+" button on the canvas or inside a rule), select `ChoiceGroup`, confirm the live preview panel renders without a console error and shows one empty option row; select `Select`, confirm the preview shows three sample options ("Option 1/2/3") in its dropdown.

Re-run the end-to-end scenario from Task 4's Step 2 once more, now against the fully finished feature, to confirm nothing regressed across the intervening tasks.

Also confirm the nesting-depth cap (Global Constraints): inside an existing rule's block-adding zone, add another `ChoiceGroup` (or `Select`) block as a follow-up block; open **its own** settings panel and confirm no "+ Ajouter une condition" button appears there — a follow-up block must not offer its own nested conditions.

Stage `src/components/AddMenu.tsx` (do not commit).

---

## Post-Plan Note

This plan does not commit anything — per this session's standing instruction, the user commits manually once they've reviewed the accumulated changes across all six tasks.
