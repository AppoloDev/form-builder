import React, { FC, useEffect, useMemo, useState } from "react";
import { EditableBlock } from "./EditableBlock";
import { useFormBuilderStore } from "../../stores/block.store";
import { TextEdition } from "../Edition/TextEdition";
import { CheckboxEdition } from "../Edition/CheckboxEdition";
import { Tooltip } from "../Tooltip";
import { AddMenu } from "../AddMenu";
import { Block, BlockDefinition } from "./Definition";
import { BLOCK_COMPONENTS } from "../BlockRegistry";
import { createBlockFromTemplate } from "../../utilities/block.utiles";
import { v4 as uuidv4 } from 'uuid';
import { FieldInput } from "./FieldInput";
import { EyeClosedIcon } from "../Icons/EyeClosedIcon";
import { EyeIcon } from "../Icons/EyeIcon";
import { Empty } from "../Empty";

type Props = {
    id: string;
    helpText?: string;
    label?: string;
    required?: boolean;
    multiple?: boolean;
    options?: OptionItem[];
    useContionnalField?: boolean;
};

type OptionItem = {
    id: string;
    label: string;
    value: string;
    showConditionalField: boolean;
    children: Block[];
};

const FollowUpRenderer: React.FC<{ child: Block }> = ({child}) => {
    const Comp = BLOCK_COMPONENTS[child.type];
    if (!Comp) return null;
    return <Comp {...child} useContionnalField={false}/>;
};

const ChoiceGroupInput: FC<Props> = (props) => {
    const {id, helpText, label, required, multiple, options: propsOptions, useContionnalField = true} = props;
    const {updateBlock} = useFormBuilderStore();

    const [form, setForm] = useState({
        label: label || "",
        helpText: helpText || "",
        required: required || false,
        multiple: multiple || false,
        options: propsOptions || [] as OptionItem[],
        useContionnalField: useContionnalField || true
    });

    const [selected, setSelected] = useState<Set<string>>(new Set());

    const setFormAndUpdate = (patch: Partial<typeof form>) => {
        setForm((prev) => {
            const next = {...prev, ...patch};
            updateBlock(id, patch);
            return next;
        });
    };

    const handleChange = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) => {
        setFormAndUpdate({[key]: value} as Partial<typeof form>);
    };

    useEffect(() => {
        if (form.options.length === 0) {
            const defaults: OptionItem[] = Array.from({length: 3}, (_, i) => {
                const label = `Option ${i + 1}`;

                return {id: uuidv4(), label, value: label, showConditionalField: false, children: []};
            });
            setFormAndUpdate({options: defaults});
        }
    }, []);

    const addOption = () => {
        const n = form.options.length + 1;
        const label = `Option ${n}`;
        setFormAndUpdate({
            options: [...form.options, {id: uuidv4(), label, value: label, showConditionalField: false, children: []}],
        });
    };

    const editionItems = useMemo(
        () => [
            <TextEdition key="label" label="Titre" value={form.label} editItem={(v) => handleChange("label", v)}/>,
            <TextEdition
                key="helpText" label="Message d'aide" value={form.helpText}
                type="textarea"
                         editItem={(v) => handleChange("helpText", v)}
            />,
            <CheckboxEdition key="required" label="Requis" checked={form.required}
                             editItem={(v) => handleChange("required", v)}/>,
            <CheckboxEdition
                key="multiple"
                label="Sélections multiples"
                checked={form.multiple}
                editItem={(v) => {
                    handleChange("multiple", v);
                    setSelected(new Set());
                }}
            />
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
            options: form.options.map((opt, i) => (i === idx ? {
                ...opt,
                showConditionalField: !opt.showConditionalField
            } : opt)),
        });
    };

    const addFollowUpFromDef = (idx: number, def: BlockDefinition) => {
        const newBlock = createBlockFromTemplate(def);

        const next = form.options.map((opt, i) =>
            i === idx ? {...opt, children: [...opt.children, newBlock], showConditionalField: true} : opt
        );
        setFormAndUpdate({options: next});
    };

    return (

        <FieldInput id={id} form={form} editionItems={editionItems}>
            <div className="space-y-3">
                <div className="flex flex-col gap-3">
                    {form.options.map((opt, idx) => (
                        <div key={opt.id} className="relative rounded-lg border border-gray-200 p-3 bg-white">
                            <div className="flex items-start justify-between gap-2">
                                <div className="flex items-center gap-2">
                                    <input
                                        name={groupName}
                                        type={form.multiple ? "checkbox" : "radio"}
                                        checked={selected.has(opt.id)}
                                        onChange={() => toggleSelectById(opt.id)}
                                        disabled
                                    />

                                    <input
                                        type="text"
                                        value={opt.label}
                                        onChange={(e) => {
                                            const next = form.options.map((o, i) =>
                                                i === idx ? {...o, label: e.target.value, value: e.target.value} : o
                                            );
                                            setFormAndUpdate({options: next});
                                        }}
                                    />
                                </div>

                                {useContionnalField && <div className="flex items-center gap-2">
                                    <button
                                        type="button"
                                        onClick={() => toggleFollowUp(idx)}
                                        className={'btn btn-size-small btn-color-appolo btn-mode-ghost'}
                                    >
                                        {opt.showConditionalField ? <EyeClosedIcon size={22}/> : <EyeIcon size={22}/>}
                                        Champs conditionnés
                                    </button>
                                </div>}
                            </div>

                            {(useContionnalField && opt.showConditionalField) && (
                                <div
                                    className="mt-3 rounded-lg border border-gray-200 bg-gray-50 p-3 space-y-3">
                                    {opt.children.length === 0 ? (
                                        <Empty onPick={(def) => addFollowUpFromDef(idx, def)}/>
                                    ) : (
                                        <>
                                            {opt.children.map((child) => (
                                                <div key={child.id}>
                                                    <FollowUpRenderer child={child}/>
                                                </div>
                                            ))}

                                            <AddMenu
                                                onPick={(def) => addFollowUpFromDef(idx, def)}
                                            >
                                                <button
                                                    type="button"
                                                    className="btn btn-size-small btn-color-appolo btn-mode-solid"
                                                >
                                                    Ajouter un bloc
                                                </button>
                                            </AddMenu>
                                        </>
                                    )}
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                <div className="flex justify-end">
                    <button
                        type="button"
                        onClick={addOption}
                        className="btn btn-size-small btn-color-appolo btn-mode-solid"
                    >
                        Ajouter une option
                    </button>
                </div>
            </div>
        </FieldInput>
    );
};

export default ChoiceGroupInput;
