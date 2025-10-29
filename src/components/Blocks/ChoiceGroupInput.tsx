import React, { FC, useEffect, useMemo, useState, useCallback, useRef } from "react";
import { FieldInput } from "./FieldInput";
import { TextEdition } from "../Edition/TextEdition";
import { CheckboxEdition } from "../Edition/CheckboxEdition";
import { Empty } from "../Empty";
import { AddMenu } from "../AddMenu";
import { Block, BlockDefinition, OptionItem } from "./Definition";
import { BLOCK_COMPONENTS } from "../BlockRegistry";
import { createBlockFromTemplate } from "../../utilities/block.utiles";
import { useFormBuilderStore } from "../../stores/block.store";
import { v4 as uuidv4 } from "uuid";
import { DragHandleContext } from "../../FormBuilder";

import {
    DndContext,
    DragStartEvent,
    DragEndEvent,
    DragOverlay,
    PointerSensor,
    UniqueIdentifier,
    useSensor,
    useSensors,
    closestCenter
} from "@dnd-kit/core";
import {
    SortableContext,
    useSortable,
    verticalListSortingStrategy,
    arrayMove
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { EyeClosedIcon } from "../Icons/EyeClosedIcon";
import { EyeIcon } from "../Icons/EyeIcon";
import { TrashIcon } from "../Icons/TrashIcon";
import { labelToName } from "../../utilities/string.utiles";

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
};

const FollowUpRenderer: React.FC<{ child: Block }> = ({child}) => {
    const Comp = BLOCK_COMPONENTS[child.type];
    if (!Comp) return null;
    return <Comp {...child} useContionnalField={false} isChildBlock={true} />;
};

const SortableChildBlock: React.FC<{
    id: UniqueIdentifier;
    children: React.ReactNode;
}> = ({id, children}) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        setActivatorNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({id});

    const style: React.CSSProperties = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.6 : 1,
    };

    return (
        <DragHandleContext.Provider
            value={{attributes, listeners, setActivatorNodeRef, isDragging}}
        >
            <div ref={setNodeRef} style={style} data-child-id={String(id)}>
                {children}
            </div>
        </DragHandleContext.Provider>
    );
};

const ChildrenSorter: React.FC<{
    childrenBlocks: Block[];
    onReorder: (next: Block[]) => void;
}> = ({childrenBlocks, onReorder}) => {
    const sensors = useSensors(
        useSensor(PointerSensor, {activationConstraint: {distance: 2}})
    );

    const childIds = useMemo(() => childrenBlocks.map((c) => c.id), [childrenBlocks]);

    const [activeChildId, setActiveChildId] = useState<UniqueIdentifier | null>(null);
    const [activeSize, setActiveSize] = useState<{ width: number; height: number } | null>(null);

    const onDragStart = useCallback((e: DragStartEvent) => {
        setActiveChildId(e.active.id);
        const el = document.querySelector<HTMLElement>(`[data-child-id="${String(e.active.id)}"]`);
        if (el) {
            const r = el.getBoundingClientRect();
            setActiveSize({width: r.width, height: r.height});
        } else {
            setActiveSize(null);
        }
    }, []);

    const onDragEnd = useCallback((e: DragEndEvent) => {
        const {active, over} = e;
        if (over && active.id !== over.id) {
            const oldIndex = childrenBlocks.findIndex((b) => b.id === active.id);
            const newIndex = childrenBlocks.findIndex((b) => b.id === over.id);
            if (oldIndex !== -1 && newIndex !== -1) {
                onReorder(arrayMove(childrenBlocks, oldIndex, newIndex));
            }
        }
        setActiveChildId(null);
        setActiveSize(null);
    }, [childrenBlocks, onReorder]);

    const onDragCancel = useCallback(() => {
        setActiveChildId(null);
        setActiveSize(null);
    }, []);

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
            onDragCancel={onDragCancel}
        >
            <SortableContext items={childIds} strategy={verticalListSortingStrategy}>
                <div className="flex flex-col gap-3">
                    {childrenBlocks.map((child) => (
                        <SortableChildBlock key={child.id} id={child.id}>
                            <FollowUpRenderer child={child}/>
                        </SortableChildBlock>
                    ))}
                </div>
            </SortableContext>

            <DragOverlay dropAnimation={null}>
                {activeChildId && activeSize ? (
                    <div
                        className="bg-appolo-50"
                        style={{
                            width: activeSize.width,
                            height: activeSize.height,
                            borderRadius: 8,
                            background: "",
                            opacity: .6,
                            boxShadow:
                                "0 4px 14px rgba(0,0,0,0.12), 0 2px 6px rgba(0,0,0,0.08)",
                        }}
                    />
                ) : null}
            </DragOverlay>
        </DndContext>
    );
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
            const patch = { label: value, name: newName };
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

    const addFollowUpFromDef = (idx: number, def: BlockDefinition) => {
        const newBlock = createBlockFromTemplate(def);
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

    return (
        <FieldInput id={id} form={form} editionItems={editionItems}>
            <div className="space-y-3">
                {form.options.map((opt, idx) => (
                    <div key={opt.id} className="rounded-lg border border-gray-200 p-3 bg-white">
                        <div className="flex items-center gap-2">
                            <input
                                type={form.multiple ? "checkbox" : "radio"}
                                disabled
                            />

                            <input
                                type="text"
                                value={opt.label}
                                onChange={(e) =>
                                    updateOption(idx, {label: e.target.value, value: e.target.value})
                                }
                                className="min-w-0 flex-1"
                            />

                            <button
                                type="button"
                                onClick={() => removeOption(idx)}
                                className="btn btn-size-small btn-color-red btn-mode-ghost"
                                aria-label="Supprimer l'option"
                            >
                                <TrashIcon size={20} />
                            </button>

                            {propsUseContionnalField && <button
                                type="button"
                                onClick={() => updateOption(idx, {showConditionalField: !opt.showConditionalField})}
                                className={'btn btn-size-small btn-color-appolo btn-mode-ghost'}
                            >
                                {opt.showConditionalField ? <EyeClosedIcon size={22}/> : <EyeIcon size={22}/>}
                                Champs conditionnés
                            </button>}
                        </div>

                        {propsUseContionnalField && opt.showConditionalField && (
                            <div className="mt-3 rounded-lg border border-gray-200 bg-gray-50 p-3 space-y-3">
                                {opt.children.length === 0 ? (
                                    <Empty onPick={(def) => addFollowUpFromDef(idx, def)}/>
                                ) : (
                                    <>
                                        <ChildrenSorter
                                            childrenBlocks={opt.children}
                                            onReorder={(next) => {
                                                handleReorderChildren(idx, next);
                                            }}
                                        />

                                        <div className="pt-1">
                                            <AddMenu onPick={(def) => addFollowUpFromDef(idx, def)}>
                                                <button
                                                    type="button"
                                                    className="btn btn-size-small btn-color-appolo btn-mode-solid"
                                                >
                                                    Ajouter un bloc
                                                </button>
                                            </AddMenu>
                                        </div>
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                ))}

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
