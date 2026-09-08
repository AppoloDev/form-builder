import { useEffect, useState } from "react";
import { SelectProps } from "./Definition";
import { useFormBuilderStore } from "../../stores/block.store";
import { FieldInput } from "./FieldInput";
import { TextEdition } from "../Edition/TextEdition";
import { CheckboxEdition } from "../Edition/CheckboxEdition";
import { OptionsEdition } from "../Edition/OptionsEdition";
import { labelToName } from "../../utilities/string.utiles";
import { Select as SelectField, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

type Props = Omit<SelectProps, 'id'> & { id: string; isChildBlock?: boolean; preview?: boolean };

const Select = (
    {
        id,
        label: propsLabel,
        name: propsName,
        helpText: propsHelpText,
        required: propsRequired,
        multiple: propsMultiple,
        options: propsOptions,
        isChildBlock,
        preview,
    }: Props) => {
    const {updateBlock} = useFormBuilderStore();

    const [form, setForm] = useState({
        label: propsLabel || "",
        name: propsName || labelToName(propsLabel || ""),
        helpText: propsHelpText || "",
        required: propsRequired ?? false,
        multiple: propsMultiple ?? false,
        options: propsOptions || [],
    });

    useEffect(() => {
        setForm({
            label: propsLabel || "",
            name: propsName || labelToName(propsLabel || ""),
            helpText: propsHelpText || "",
            required: propsRequired ?? false,
            multiple: propsMultiple ?? false,
            options: propsOptions || [],
        });
    }, [propsLabel, propsName, propsHelpText, propsRequired, propsMultiple, JSON.stringify(propsOptions)]);

    useEffect(() => {
        if (form.options.length === 0) {
            const defaults = ["Option 1", "Option 2", "Option 3"];
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
        } else {
            const patch = {[key]: value};
            setForm(prev => ({...prev, ...patch as Partial<typeof form>}));
            updateBlock(id, patch);
        }
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
    ];

    return (
        <FieldInput id={id} form={form} editionItems={editionItems} preview={preview}
                    onLabelChange={(v) => handleChange("label", v)}>
            <SelectField
                disabled
                items={form.options.map((opt) => ({value: opt, label: opt}))}
                defaultValue={form.options[0]}
            >
                <SelectTrigger className="w-full">
                    <SelectValue placeholder="Sélectionner…"/>
                </SelectTrigger>
                <SelectContent>
                    {form.options.map((opt, idx) => (
                        <SelectItem key={`${opt}-${idx}`} value={opt}>{opt}</SelectItem>
                    ))}
                </SelectContent>
            </SelectField>
        </FieldInput>
    );
};

export default Select;
