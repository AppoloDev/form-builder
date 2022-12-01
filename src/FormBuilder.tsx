import React, { useState } from 'react';
import { Block, blocks as blockDefinition } from "./components/Blocks/Definition";
import DndContext from "./components/Sortable/DndContext";
import { SortableList } from "./components/Sortable/ListSortable";
import { DroppableList } from "./components/Sortable/ListDroppable";
import { FormBuilderProps } from "./components/Blocks/Types";
import { merge } from "./utilities/Object";
import useDebounce from "./utilities/Debounce";
import { CancelIcon } from "./components/Icons/CancelIcon";

function FormBuilder({blocks, onChange, onClose}: FormBuilderProps) {
    const [items, setItems] = useState([
        {
            type: "TextInput",
            label: "Label",
            placeHolder: "Lets go",
            value: "je suis une value",
            required: true,
        },
        {
            type: "DateTimeInput",
            label: "Datetime input",
            placeHolder: "Lets go",
            value: "",
            required: true,
        },

        {
            type: "HourMinuteInput",
            label: "HourMinute input",
            placeHolder: "Lets go",
            value: "",
            required: true,
        },
        {
            type: "Repeatable",
            maxItems: 5,
            children: [
                {
                    type: "TextInput",
                    label: "Nom",
                    required: true,
                },
                {
                    type: "TextInput",
                    label: "Prénom",
                    required: true,
                },
            ]
        },
        {
            type: "FieldSet",
            children: [
                {
                    type: "Title",
                    text: "Au petit matin, les oiseaux se réveillent"
                },
                {
                    type: "Paragraph",
                    text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
                },
                {
                    type: "EmailInput",
                    label: "Number input",
                    helpText: "Text d'aide",
                },
                {
                    type: "TextInput",
                    label: "champ 2",
                    placeHolder: "inside !",
                    helpText: "",
                    required: true,
                },
                {
                    type: "TextAreaInput",
                    label: "champ 2",
                    defaultValue: 'Plop coin',
                    placeHolder: "inside !",
                    helpText: "",
                    required: true,
                },
                {
                    type: "FileInput",
                    label: "Fichier",
                    maxItems: 5,
                    helpText: "Fichier PDF",
                    acceptedFile: [],
                    value: ['application/pdf'],
                    required: true,
                },
                {
                    type: "Repeatable",
                    maxItems: 5,
                    children: [
                        {
                            type: "TextInput",
                            label: "Nom",
                            required: true,
                        },
                        {
                            type: "TextInput",
                            label: "Prénom",
                            required: true,
                        },
                    ]
                },
            ]
        }
    ]);

    const [isLoaded, setIsLoaded] = useState<boolean>(false)
    let mergedBlocks: any = blockDefinition

    if (blocks) {
        mergedBlocks = merge(blockDefinition, blocks);
    }

    const editItem = (item: any, key: string, value: any) => {
        item[key] = value;
        setItems([...items]);
    }

    const removeItem = (item: any) => {
        const index = items.indexOf(item)

        if (index > -1) {
            setItems((current) => {
                current.splice(index, 1);

                return [...current];
            })
        }
    }

    useDebounce(() => {
        if (isLoaded) {
            onChange(items);
        } else {
            setIsLoaded(true);
        }
    }, [items], 250);

    return (
        <>
            <div className="form-builder">
                <DndContext
                    items={items}
                    setReorder={(items: any[]) => setItems(items)}
                >
                    <DroppableList
                        items={Object.values(mergedBlocks)}
                        dropItem={(block: Block) => {
                            return {
                                type: block.component.name,
                                ...block.base
                            }
                        }}
                        renderItem={(block: Block) => <div draggable={true}>{block.title}</div>}
                    />

                    <div className="container">
                        <SortableList
                            renderItem={(item: any, key: number) => React.createElement(mergedBlocks[item.type].component, {
                                key,
                                ...item,
                                editItem: (key: string, value: any) => editItem(item, key, value),
                                removeItem: () => removeItem(item)
                            })}
                            items={items}
                        />
                    </div>
                </DndContext>

                <div className="close" onClick={() => onClose(items)}>
                    <CancelIcon height={32} width={32}/>
                </div>
            </div>

            <p style={{fontSize: 12, marginTop: 20}}>{JSON.stringify(items)}</p>
        </>

    )
}

export default FormBuilder;
