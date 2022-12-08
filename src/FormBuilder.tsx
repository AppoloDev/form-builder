import React, { useState } from 'react';
import { Block, blocks as blockDefinition } from "./components/Blocks/Definition";
import DndContext from "./components/Sortable/DndContext";
import { SortableList } from "./components/Sortable/ListSortable";
import { DroppableList } from "./components/Sortable/ListDroppable";
import { FormBuilderProps } from "./components/Blocks/Types";
import { merge } from "./utilities/Object";
import useDebounce from "./utilities/Debounce";
import { CancelIcon } from "./components/Icons/CancelIcon";

function FormBuilder({blocks, onChange, onClose, modalLayout, json}: FormBuilderProps) {
    const [items, setItems] = useState(json);

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

    console.log(items);

    return (
        <>
            <div className={`form-builder ${modalLayout ? 'modal-layout' : ''}`}>
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

                    <div className="form-builder__wrapper">
                        <SortableList
                            renderItem={(item: any, key: number) => React.createElement(mergedBlocks[item.type].component, {
                                key,
                                ...item,
                                editItem: (key: string, value: any) => editItem(item, key, value),
                                removeItem: () => removeItem(item)
                            })}
                            items={items}
                        >
                            {items.length === 0 && <div className="no-items">Déplacer un élément dans la zone…</div>}
                        </SortableList>
                    </div>
                </DndContext>

                {modalLayout && <div className="close" onClick={() => onClose(items)}>
                    <CancelIcon height={32} width={32}/>
                </div>}
            </div>
        </>

    )
}

export default FormBuilder;
