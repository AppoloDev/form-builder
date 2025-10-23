import React, { FC, useEffect, useMemo, useState } from "react";
import { EditableBlock } from "./EditableBlock";
import { useFormBuilderStore } from "../../stores/block.store";
import { TextEdition } from "../Edition/TextEdition";
import { CheckboxEdition } from "../Edition/CheckboxEdition";
import { Tooltip } from "../Tooltip";
import { AddMenu } from "../AddMenu";

import TextInput from "../Blocks/TextInput";
import EmailInput from "../Blocks/EmailInput";
import UrlInput from "../Blocks/UrlInput";
import NumberInput from "../Blocks/NumberInput";
import DateTimeInput from "../Blocks/DateTimeInput";
import TextareaInput from "../Blocks/TextareaInput";
import Select from "../Blocks/Select";
import { BlockDefinition } from "./Definition";

type Props = { id: string; helpText?: string };

type FollowUpType =
    | "TextInput"
    | "NumberInput"
    | "EmailInput"
    | "UrlInput"
    | "DateTimeInput"
    | "TextareaInput"
    | "Select";

type FollowUpChild = {
    id: string;
    type: FollowUpType;
};

type OptionItem = {
    id: string;
    label: string;
    value: string;
    followUpEnabled: boolean;
    children: FollowUpChild[];
};

const makeId = () =>
    (typeof crypto !== "undefined" && "randomUUID" in crypto
        ? (crypto as any).randomUUID()
        : `${Date.now()}-${Math.random().toString(36).slice(2)}`);

// --------- Résolveur de composants blocs réels ----------
const BLOCK_COMPONENTS: Record<FollowUpType, React.ComponentType<{ id: string }>> = {
    TextInput,
    EmailInput,
    UrlInput,
    NumberInput,
    DateTimeInput,
    TextareaInput,
    Select,
};

// Rend le VRAI composant bloc (hérite donc du même ContextMenu et des mêmes éditions que les parents)
const FollowUpRenderer: React.FC<{ child: FollowUpChild }> = ({ child }) => {
    const Comp = BLOCK_COMPONENTS[child.type];
    if (!Comp) return null;
    return <Comp id={child.id} />;
};

const ChoiceGroupInput: FC<Props> = ({ id, helpText }) => {
    const { updateBlock } = useFormBuilderStore();

    const [form, setForm] = useState({
        label: "",
        helpText: "",
        required: false,
        multiple: false,
        options: [] as OptionItem[],
    });

    const [selected, setSelected] = useState<Set<string>>(new Set());

    // -- helpers
    const setFormAndUpdate = (patch: Partial<typeof form>) => {
        setForm((prev) => {
            const next = { ...prev, ...patch };
            updateBlock(id, patch);
            return next;
        });
    };

    const handleChange = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) => {
        setFormAndUpdate({ [key]: value } as Partial<typeof form>);
    };

    // 3 options par défaut
    useEffect(() => {
        if (form.options.length === 0) {
            const defaults: OptionItem[] = Array.from({ length: 3 }, (_, i) => {
                const label = `Option ${i + 1}`;
                return { id: makeId(), label, value: label, followUpEnabled: false, children: [] };
            });
            setFormAndUpdate({ options: defaults });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const addOption = () => {
        const n = form.options.length + 1;
        const label = `Option ${n}`;
        setFormAndUpdate({
            options: [...form.options, { id: makeId(), label, value: label, followUpEnabled: false, children: [] }],
        });
    };

    // — édition du bloc parent (comme avant)
    const editionItems = useMemo(
        () => [
            <TextEdition key="label" label="Titre" value={form.label} editItem={(v) => handleChange("label", v)} />,
            <TextEdition key="helpText" label="Message d'aide" value={form.helpText} editItem={(v) => handleChange("helpText", v)} />,
            <CheckboxEdition key="required" label="Requis" checked={form.required} editItem={(v) => handleChange("required", v)} />,
            <CheckboxEdition
                key="multiple"
                label="Sélections multiples"
                checked={form.multiple}
                editItem={(v) => {
                    handleChange("multiple", v);
                    setSelected(new Set());
                }}
            />,
            <div key="hint" className="text-xs text-gray-500">
                Ajoutez des options via le bouton ci-dessous. Activez “Zone suivis” puis utilisez “Ajouter un bloc” pour insérer des champs.
            </div>,
        ],
        [form]
    );

    const groupName = `choice-${id}`;

    const toggleSelectById = (idToToggle: string) => {
        setSelected((prev) => {
            const s = new Set(prev);
            if (form.multiple) {
                s.has(idToToggle) ? s.delete(idToToggle) : s.add(idToToggle);
            } else {
                s.clear();
                s.add(idToToggle);
            }
            return s;
        });
    };

    const toggleFollowUp = (idx: number) => {
        setFormAndUpdate({
            options: form.options.map((opt, i) => (i === idx ? { ...opt, followUpEnabled: !opt.followUpEnabled } : opt)),
        });
    };

    // 👉 Ajout d’un VRAI bloc enfant : on stocke uniquement {id,type} et on laisse le composant gérer sa config via son ContextMenu
    const addFollowUpFromDef = (idx: number, def: BlockDefinition) => {
        // On accepte uniquement les types autorisés en zone de suivi
        const allowed: FollowUpType[] = ["TextInput", "NumberInput", "EmailInput", "UrlInput", "DateTimeInput", "TextareaInput", "Select"];
        const type = def.type as FollowUpType;
        if (!allowed.includes(type)) return;

        const child: FollowUpChild = { id: makeId(), type };
        const next = form.options.map((opt, i) =>
            i === idx ? { ...opt, children: [...opt.children, child], followUpEnabled: true } : opt
        );
        setFormAndUpdate({ options: next });

        // NB: si tes blocs ont besoin d'une initialisation dans le store,
        // fais-le ici (ex: createBlock(child.id, type, def.defaultProps)).
        // Sinon, la logique interne du bloc (via makeInputBlock) prend le relais.
    };

    return (
        <EditableBlock id={id} editionItems={editionItems}>
            <label className={`flex mb-2 text-sm font-medium ${form.label ? "text-gray-900" : "text-gray-400"}`}>
                {form.label || "Titre"}
                {form.required && (
                    <Tooltip content="Requis">
                        <span className="ml-1 text-red-500">*</span>
                    </Tooltip>
                )}
            </label>

            <div className="flex flex-col gap-3">
                {form.options.map((opt, idx) => (
                    <div key={opt.id} className="group relative rounded-lg border border-gray-200 p-3 bg-white">
                        <div className="flex items-start justify-between gap-2">
                            <div className="flex items-center gap-2">
                                <input
                                    name={groupName}
                                    type={form.multiple ? "checkbox" : "radio"}
                                    checked={selected.has(opt.id)}
                                    onChange={() => toggleSelectById(opt.id)}
                                />
                                <input
                                    type="text"
                                    value={opt.label}
                                    onChange={(e) => {
                                        const next = form.options.map((o, i) =>
                                            i === idx ? { ...o, label: e.target.value, value: e.target.value } : o
                                        );
                                        setFormAndUpdate({ options: next });
                                    }}
                                    className="border-0 border-b border-transparent focus:border-blue-400 focus:ring-0 text-sm text-gray-800 bg-transparent"
                                />
                            </div>

                            <div className="flex items-center gap-2">
                                {opt.followUpEnabled && (
                                    <span className="text-[11px] px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 border border-blue-200">
                    Zone suivis activée
                  </span>
                                )}
                                <button
                                    type="button"
                                    onClick={() => toggleFollowUp(idx)}
                                    className={`text-xs px-2 py-1 rounded border ${opt.followUpEnabled ? "bg-white hover:bg-gray-50" : "bg-gray-100 hover:bg-gray-200"}`}
                                >
                                    {opt.followUpEnabled ? "Retirer la zone" : "+ Zone suivis"}
                                </button>
                            </div>
                        </div>

                        {opt.followUpEnabled && (
                            <div className="mt-3 rounded-md border border-gray-200 bg-gray-50 p-3 space-y-3 relative">
                                {opt.children.length === 0 ? (
                                    <div className="text-xs italic text-gray-400">Aucun champ ajouté pour cette option.</div>
                                ) : (
                                    opt.children.map((child) => (
                                        <div key={child.id} className="relative rounded border border-gray-200 bg-white p-2">
                                            {/* ⚡️ On rend le VRAI bloc (TextInput, EmailInput, etc.) */}
                                            <FollowUpRenderer child={child} />
                                        </div>
                                    ))
                                )}

                                {/* Bouton "Ajouter un bloc" qui ouvre la même liste que le builder */}
                                <AddMenu
                                    onPick={(def) => addFollowUpFromDef(idx, def)}
                                    allowTypes={["TextInput", "NumberInput", "EmailInput", "UrlInput", "DateTimeInput", "TextareaInput", "Select"]}
                                    placeholder="Rechercher un bloc…"
                                    trigger={
                                        <button
                                            type="button"
                                            className="inline-flex items-center gap-2 text-sm px-3 py-1.5 rounded-lg border border-gray-300 bg-white hover:bg-gray-50"
                                        >
                                            <span className="text-lg leading-none">＋</span> Ajouter un bloc
                                        </button>
                                    }
                                />
                            </div>
                        )}
                    </div>
                ))}
            </div>

            <div className="mt-3">
                <button
                    type="button"
                    onClick={addOption}
                    className="inline-flex items-center gap-2 text-sm px-3 py-1.5 rounded-lg border border-gray-300 bg-white hover:bg-gray-50"
                >
                    <span className="text-lg leading-none">＋</span> Ajouter une option
                </button>
            </div>

            {(helpText || form.helpText) && (
                <div className="flex items-center gap-2 italic text-s text-gray-400 mt-2">{helpText || form.helpText}</div>
            )}
        </EditableBlock>
    );
};

export default ChoiceGroupInput;
