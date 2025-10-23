import React, { FC, useMemo, useState } from "react";
import { EditableBlock } from "./EditableBlock";
import { useFormBuilderStore } from "../../stores/block.store";
import { TextEdition } from "../Edition/TextEdition";
import { CheckboxEdition } from "../Edition/CheckboxEdition";
import { Tooltip } from "../Tooltip";
import { OptionsEdition } from "../Edition/OptionsEdition";

type Props = {
    id: string;
    helpText?: string;
};

export const SelectInput: FC<Props> = ({ id, helpText }) => {
    const { updateBlock } = useFormBuilderStore();

    const [form, setForm] = useState({
        label: "",
        placeHolder: "",
        helpText: "",
        required: false,
        multiple: false,
        options: [] as string[],
    });

    const handleChange = (key: keyof typeof form, value: any) => {
        setForm((prev) => ({ ...prev, [key]: value }));
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
                key="placeholder"
                label="Placeholder"
                value={form.placeHolder}
                editItem={(v) => handleChange("placeHolder", v)}
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
                label="Sélection multiple"
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

            <select
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg
                   focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                multiple={form.multiple}
            >
                {form.placeHolder && !form.multiple && (
                    <option value="">{form.placeHolder}</option>
                )}
                {form.options.map((opt, idx) => (
                    <option key={`${opt}-${idx}`} value={opt}>
                        {opt}
                    </option>
                ))}
            </select>

            {(helpText || form.helpText) && (
                <div className="flex items-center gap-2 italic text-s text-gray-400 mt-1">
                    {helpText || form.helpText}
                </div>
            )}
        </EditableBlock>
    );
};

export default SelectInput;
