import { FC, useEffect, useMemo, useState } from "react";
import { FieldInput } from "./FieldInput";
import { TextEdition } from "../Edition/TextEdition";
import { CheckboxEdition } from "../Edition/CheckboxEdition";
import { Empty } from "../Empty";
import { AddMenu } from "../AddMenu";
import { Block, BlockDefinition, OptionItem } from "./Definition";
import { createBlockFromTemplate } from "../../utilities/block.utiles";
import { useFormBuilderStore } from "../../stores/block.store";
import { v4 as uuidv4 } from "uuid";
import { ChildrenSorter } from "./ChildrenSorter";
import { Button } from "@/src/components/ui/button";
import { Input } from "../ui/input";
import { Checkbox } from "../ui/checkbox";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { EyeClosedIcon } from "../Icons/EyeClosedIcon";
import { EyeIcon } from "../Icons/EyeIcon";
import { labelToName } from "../../utilities/string.utiles";
import { Trash } from "lucide-react";

type Props = {
    id: string;
    helpText?: string;
    label?: string;
    name?: string;
    required?: boolean;
    multiple?: boolean;
    options?: OptionItem[];
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
        useContionnalField: propsUseContionnalField ?? true,
    });

    useEffect(() => {
        setForm({
            label: propsLabel || "",
            name: propsName || labelToName(propsLabel || ""),
            helpText: propsHelpText || "",
            required: propsRequired ?? false,
            multiple: propsMultiple ?? false,
            options: (propsOptions || []) as OptionItem[],
            useContionnalField: propsUseContionnalField ?? true,
        });
    }, [
        propsLabel,
        propsName,
        propsHelpText,
        propsRequired,
        propsMultiple,
        JSON.stringify(propsOptions),
        propsUseContionnalField,
    ]);

    useEffect(() => {
        if (form.options.length === 0) {
            const defaults: OptionItem[] = Array.from({length: 3}, (_, i) => {
                const lbl = `Option ${i + 1}`;
                return {id: uuidv4(), label: lbl, value: lbl, showConditionalField: false, children: []};
            });
            const patch = { options: defaults };
            setForm(prev => ({ ...prev, ...patch }));
            updateBlock(id, patch);
        }
    }, []);

    const handleChange = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) => {
        if (key === 'label') {
            const newName = labelToName(value as string);
            const patch = { label: value as string, name: newName };
            setForm(prev => ({ ...prev, ...patch }));
            updateBlock(id, patch);
        } else {
            const patch = { [key]: value };
            setForm(prev => ({ ...prev, ...patch as Partial<typeof form> }));
            updateBlock(id, patch);
        }
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

            if (isChildBlock) {
                return items.filter(item => item.key !== 'required');
            }

            return items;
        },
        [form.label, form.helpText, form.required, form.multiple, isChildBlock]
    );

    const addOption = () => {
        const n = form.options.length + 1;
        const lbl = `Option ${n}`;
        const newOption = {id: uuidv4(), label: lbl, value: lbl, showConditionalField: false, children: []};

        const patch = { options: [...form.options, newOption] };
        setForm(prev => ({ ...prev, ...patch }));
        updateBlock(id, patch);
    };

    const updateOption = (idx: number, optionPatch: Partial<OptionItem>) => {
        const nextOptions = form.options.map((o, i) => (i === idx ? {...o, ...optionPatch} : o));

        const patch = { options: nextOptions };
        setForm(prev => ({ ...prev, ...patch }));
        updateBlock(id, patch);
    };

    const removeOption = (idx: number) => {
        const nextOptions = form.options.filter((_, i) => i !== idx);

        const patch = { options: nextOptions };
        setForm(prev => ({ ...prev, ...patch }));
        updateBlock(id, patch);
    };

    const addFollowUpFromDef = (idx: number, def: BlockDefinition, overrides?: Record<string, any>) => {
        const newBlock = createBlockFromTemplate(def, overrides);
        const nextOptions = form.options.map((opt, i) =>
            i === idx ? {...opt, children: [...opt.children, newBlock], showConditionalField: true} : opt
        );

        const patch = { options: nextOptions };
        setForm(prev => ({ ...prev, ...patch }));
        updateBlock(id, patch);
    };

    const handleReorderChildren = (optionIndex: number, reorderedChildren: Block[]) => {
        const nextOptions = [...form.options];
        nextOptions[optionIndex] = { ...nextOptions[optionIndex], children: reorderedChildren };

        const patch = { options: nextOptions };
        setForm(prev => ({ ...prev, ...patch }));
        updateBlock(id, patch);
    };

    const renderOptionRow = (opt: OptionItem, idx: number) => (
                    <div key={opt.id} className="rounded-lg border border-border p-3 bg-card">
                        <div className="flex items-center gap-2">
                            {form.multiple ? (
                                <Checkbox disabled/>
                            ) : (
                                <RadioGroupItem value={opt.id} disabled/>
                            )}

                            <Input
                                value={opt.label}
                                onChange={(e) =>
                                    updateOption(idx, {label: e.target.value, value: e.target.value})
                                }
                                className="min-w-0 flex-1"
                            />

                            <Button
                                type="button"
                                variant="ghost"
                                size="icon-lg"
                                onClick={() => removeOption(idx)}
                                className="text-destructive hover:text-destructive"
                                aria-label="Supprimer l'option"
                            >
                                <Trash />
                            </Button>

                            {propsUseContionnalField && <Button
                                type="button"
                                variant="ghost"
                                onClick={() => updateOption(idx, {showConditionalField: !opt.showConditionalField})}
                            >
                                {opt.showConditionalField ? <EyeClosedIcon size={22}/> : <EyeIcon size={22}/>}
                                Champs conditionnés
                            </Button>}
                        </div>

                        {propsUseContionnalField && opt.showConditionalField && (
                            <div className="mt-3 rounded-lg border border-border bg-muted p-3 space-y-3">
                                {opt.children.length === 0 ? (
                                    <Empty onPick={(def, overrides) => addFollowUpFromDef(idx, def, overrides)}/>
                                ) : (
                                    <>
                                        <ChildrenSorter
                                            childrenBlocks={opt.children}
                                            onReorder={(next) => {
                                                handleReorderChildren(idx, next);
                                            }}
                                        />

                                        <div className="pt-1">
                                            <AddMenu onPick={(def, overrides) => addFollowUpFromDef(idx, def, overrides)}>
                                                <Button type="button" size="sm">
                                                    Ajouter un bloc
                                                </Button>
                                            </AddMenu>
                                        </div>
                                    </>
                                )}
                            </div>
                        )}
                    </div>
    );

    return (
        <FieldInput id={id} form={form} editionItems={editionItems} preview={preview}>
            <div className="space-y-3">
                {form.multiple ? (
                    <div className="space-y-3">
                        {form.options.map(renderOptionRow)}
                    </div>
                ) : (
                    <RadioGroup className="space-y-3">
                        {form.options.map(renderOptionRow)}
                    </RadioGroup>
                )}

                <div className="flex justify-end">
                    <Button type="button" size="sm" onClick={addOption}>
                        Ajouter une option
                    </Button>
                </div>
            </div>
        </FieldInput>
    );
};

export default ChoiceGroupInput;
