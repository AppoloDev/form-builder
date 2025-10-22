import React, { FC, useMemo, useState } from "react";
import { EditableBlock } from "./EditableBlock";
import { useFormBuilderStore } from "../../stores/block.store";
import { TextEdition } from "../Edition/TextEdition";
import { CheckboxEdition } from "../Edition/CheckboxEdition";
import { OptionsEdition } from "../Edition/OptionsEdition";
import { Tooltip } from "../Tooltip";

type Props = { id: string; helpText?: string };

const ChoiceGroupInput: FC<Props> = ({ id, helpText }) => {
    const { updateBlock } = useFormBuilderStore();

    const [form, setForm] = useState({
        label: "",
        helpText: "",
        required: false,  // interprétation: au moins une sélection requise si multiple, sinon une sélection requise
        inline: false,    // disposition visuelle
        multiple: false,  // false => radios, true => checkboxes
        options: [] as string[],
    });

    const handleChange = (key: keyof typeof form, value: any) => {
        setForm(prev => ({ ...prev, [key]: value }));
        updateBlock(id, { [key]: value });
    };

    const editionItems = useMemo(
        () => [
            <TextEdition
                key="label"
                label="Titre"
                value={form.label}
                editItem={(v) => handleChange("label", v)}
            />,
            <TextEdition
                key="helpText"
                label="Message d'aide"
                value={form.helpText}
                editItem={(v) => handleChange("helpText", v)}
            />,
            <CheckboxEdition
                key="required"
                label="Requis"
                checked={form.required}
                editItem={(v) => handleChange("required", v)}
            />,
            <CheckboxEdition
                key="multiple"
                label="Plusieurs sélections (checkboxes)"
                checked={form.multiple}
                editItem={(v) => handleChange("multiple", v)}
            />,
            <OptionsEdition
                key="options"
                label="Options"
                value={form.options}
                onChange={(v) => handleChange("options", v)}
                helpText="Ajoutez, modifiez ou supprimez les options"
            />,
        ],
        [form]
    );

    const groupName = `choice-${id}`;

    return (
        <EditableBlock id={id} editionItems={editionItems}>
            <label
                className={`flex mb-1 text-sm font-medium ${
                    form.label ? "text-gray-900" : "text-gray-400"
                }`}
            >
                {form.label || "Titre"}
                {form.required && (
                    <Tooltip content="Requis">
                        <span className="ml-1 text-red-500">*</span>
                    </Tooltip>
                )}
            </label>

            <div className="flex flex-col">
                {form.options.map((opt, idx) => {
                    const inputId = `${groupName}-${idx}`;
                    const type = form.multiple ? "checkbox" : "radio";
                    return (
                        <label key={inputId} htmlFor={inputId} className="inline-flex items-center gap-2 text-sm text-gray-700">
                            <input id={inputId} name={groupName} type={type} disabled />
                            <span>{opt}</span>
                        </label>
                    );
                })}
            </div>

            {(helpText || form.helpText) && (
                <div className="flex items-center gap-2 italic text-s text-gray-400 mt-1">
                    {helpText || form.helpText}
                </div>
            )}
        </EditableBlock>
    );
};

export default ChoiceGroupInput;
