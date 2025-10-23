import React, { FC, useMemo, useState } from "react";
import { EditableBlock } from "./EditableBlock";
import { useFormBuilderStore } from "../../stores/block.store";
import { TextEdition } from "../Edition/TextEdition";
import { CheckboxEdition } from "../Edition/CheckboxEdition";
import { SelectEdition } from "../Edition/SelectEdition";
import { Tooltip } from "../Tooltip";

type CommonProps = { id: string; helpText?: string };

type FormStateBase = {
    label: string;
    placeHolder: string;
    helpText: string;
    required: boolean;
};

export type EditionItem =
    | { key: keyof FormStateBase | string; label: string; type: "text"; helpText?: string }
    | { key: keyof FormStateBase | string; label: string; type: "checkbox" }
    | { key: keyof FormStateBase | string; label: string; type: "select"; options: { value: string; label: string }[]; helpText?: string };

const baseSchema: EditionItem[] = [
    { key: "label",       label: "Titre",          type: "text" },
    { key: "placeHolder", label: "Placeholder",    type: "text" },
    { key: "helpText",    label: "Message d'aide", type: "text" },
    { key: "required",    label: "Requis",         type: "checkbox" },
];

type MakeOpts = {
    extraSchema?: EditionItem[];
    toInputAttrs?: (form: Record<string, any>) => React.InputHTMLAttributes<HTMLInputElement>;
};

export const makeInputBlock = (
    inputType: React.HTMLInputTypeAttribute | HTMLTextAreaElement,
    opts: MakeOpts = {}
) => {
    const InputBlock: FC<CommonProps> = ({ id, helpText }) => {
        const { updateBlock } = useFormBuilderStore();

        const [form, setForm] = useState<Record<string, any>>({
            label: "",
            placeHolder: "",
            helpText: "",
            required: false,
        });

        const editionSchema = useMemo(
            () => [...baseSchema, ...(opts.extraSchema ?? [])],
            [opts.extraSchema]
        );

        const handleChange = (key: string, value: any) => {
            setForm(prev => ({ ...prev, [key]: value }));
            updateBlock(id, { [key]: value });
        };

        const editionItems = useMemo(
            () =>
                editionSchema.map(def => {
                    const value = form[def.key as string];

                    if (def.type === "checkbox") {
                        return (
                            <CheckboxEdition
                                key={String(def.key)}
                                label={def.label}
                                checked={Boolean(value)}
                                editItem={(v: boolean) => handleChange(def.key, v)}
                            />
                        );
                    }

                    if (def.type === "select") {
                        return (
                            <SelectEdition
                                key={String(def.key)}
                                label={def.label}
                                value={value ?? ""}
                                options={def.options}
                                helpText={def.helpText}
                                editItem={(v: string) => handleChange(def.key, v)}
                            />
                        );
                    }

                    return (
                        <TextEdition
                            key={String(def.key)}
                            label={def.label}
                            value={value ?? ""}
                            helpText={def.helpText || ""}
                            editItem={(v: string) => handleChange(def.key as string, v)}
                        />
                    );
                }),
            [editionSchema, form]
        );

        const rawInputAttrs = opts.toInputAttrs?.(form) ?? {};
        const { type: overrideType, ...restInputAttrs } = rawInputAttrs;
        const finalType = (overrideType as React.HTMLInputTypeAttribute) ?? inputType;

        return (
            <EditableBlock id={id} editionItems={editionItems}>
                <label className={`flex mb-1 text-sm font-medium ${form.label ? "text-gray-900" : "text-gray-400"}`}>
                    {form.label || "Titre"}
                    {form.required && (
                        <Tooltip content={"Requis"}>
                            <span className="ml-1 text-red-500">*</span>
                        </Tooltip>
                    )}
                </label>

                <input
                    type={finalType}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg
                     focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                    placeholder={form.placeHolder}
                    disabled
                    {...restInputAttrs}
                />

                {(helpText || form.helpText) && (
                    <div className="flex items-center gap-2 italic text-s text-gray-400">
                        {helpText || form.helpText}
                    </div>
                )}
            </EditableBlock>
        );
    };

    return InputBlock;
};
