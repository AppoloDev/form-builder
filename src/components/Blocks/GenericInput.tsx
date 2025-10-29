import React, { FC, HTMLInputTypeAttribute, useMemo, useState, useEffect } from "react";
import { useFormBuilderStore } from "../../stores/block.store";
import { TextEdition } from "../Edition/TextEdition";
import { CheckboxEdition } from "../Edition/CheckboxEdition";
import { SelectEdition } from "../Edition/SelectEdition";
import { FieldInput } from "./FieldInput";
import { labelToName } from "../../utilities/string.utiles";

type CommonProps = {
    id: string;
    helpText?: string;
    label?: string;
    placeHolder?: string;
    required?: boolean;
    isChildBlock?: boolean;
    [key: string]: any;
};

type FormStateBase = {
    label: string;
    placeHolder: string;
    helpText: string;
    required: boolean;
};

export type EditionItem =
    | { key: keyof FormStateBase | string; label: string; type: "text" | "textarea"; helpText?: string; rows?: number }
    | { key: keyof FormStateBase | string; label: string; type: "checkbox" }
    | {
    key: keyof FormStateBase | string;
    label: string;
    type: "select";
    options: { value: string; label: string }[];
    helpText?: string
};

const baseSchema: EditionItem[] = [
    {key: "label", label: "Titre", type: "text"},
    {key: "placeHolder", label: "Placeholder", type: "text"},
    {key: "helpText", label: "Message d'aide", type: "textarea"},
    {key: "required", label: "Requis", type: "checkbox"},
];

type MakeOpts = {
    extraSchema?: EditionItem[];
    toInputAttrs?: (form: Record<string, any>) => React.InputHTMLAttributes<HTMLInputElement>;
};

export const makeInputBlock = (
    inputType: React.HTMLInputTypeAttribute | HTMLTextAreaElement,
    opts: MakeOpts = {}
) => {
    const InputBlock: FC<CommonProps> = (props) => {
        const {id, index, isChildBlock, ...restProps} = props;
        const {updateBlock} = useFormBuilderStore();

        const [form, setForm] = useState<Record<string, any>>({
            ...restProps,
            label: restProps.label || "",
            placeHolder: restProps.placeHolder || "",
            helpText: restProps.helpText || "",
            required: restProps.required || false,
            name: restProps.name || labelToName(restProps.label || ""),
        });

        useEffect(() => {
            setForm({
                ...restProps,
                label: restProps.label || "",
                placeHolder: restProps.placeHolder || "",
                helpText: restProps.helpText || "",
                required: restProps.required || false,
                name: restProps.name || labelToName(restProps.label || ""),
            });
        }, [JSON.stringify(restProps)]);

        const editionSchema = useMemo(
            () => {
                let schema = [...baseSchema, ...(opts.extraSchema ?? [])];
                if (isChildBlock) {
                    schema = schema.filter(item => item.key !== 'required');
                }
                return schema;
            },
            [opts.extraSchema, isChildBlock]
        );

        const handleChange = (key: string, value: any) => {
            if (key === 'label') {
                const newName = labelToName(value);
                const patch = { label: value, name: newName };
                setForm(prev => ({ ...prev, ...patch }));
                updateBlock(id, patch);
            } else {
                const patch = { [key]: value };
                setForm(prev => ({ ...prev, ...patch }));
                updateBlock(id, patch);
            }
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
                            type={def.type || "text"}
                            helpText={def.helpText || ""}
                            rows={def.rows}
                            editItem={(v: string) => handleChange(def.key as string, v)}
                        />
                    );
                }),
            [editionSchema, form]
        );

        const rawInputAttrs = opts.toInputAttrs?.(form) ?? {};
        const {type: overrideType, ...restInputAttrs} = rawInputAttrs;
        const finalType = (overrideType as HTMLInputTypeAttribute) ?? inputType;

        return (
            <FieldInput
                editionItems={editionItems}
                form={form}
                id={id}
            >
                {finalType === 'textarea' ?
                    <textarea
                        id={id}
                        placeholder={form.placeHolder}
                        rows={props.rows}
                        disabled
                        {...restInputAttrs}
                    />
                    :
                    <input
                        id={id}
                        type={finalType}
                        placeholder={form.placeHolder}
                        disabled
                        {...restInputAttrs}
                    />
                }
            </FieldInput>
        );
    };

    return InputBlock;
};
