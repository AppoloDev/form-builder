import React, { FC, useEffect } from "react";
import { blocks } from "./Definition";
import { RepeatableProps } from "./Types";
import { EditableBlock } from "./EditableBlock";
import { NumberEdition } from "../Edition/NumberEdition";
import { SortableList } from "../Sortable/ListSortable";
import { IdGenerator } from "../../utilities/String";

const Repeatable: FC<RepeatableProps> = ({id = '', children, maxItems, editItem, removeItem }) => {
    useEffect(() => {
        if (id === '') {
            editItem('id', `repeatable_${IdGenerator()}`);
        }
    }, [id])

    const editChildrenItem = (item: JSX.Element, key: keyof JSX.Element, value: JSX.Element[]) => {
        item[key] = value;
        const childrenClone = [...children];
        editItem('children', childrenClone);
    };

    const removeChildrenItem = (item: JSX.Element) => {
        const index = children.indexOf(item);

        if (index > -1) {
            children.splice(index, 1);
            editItem('children', [...children]);
        }
    }

    return (
        <EditableBlock
            removeItem={removeItem}
            className={'repeatable'}
            editionItems={[
                <NumberEdition
                    label={'Nombre maximum de répétition'}
                    value={maxItems}
                    min={0}
                    editItem={(val) => editItem('maxItems', val)}
                    key={1}
                />
            ]}
        >
            <SortableList
                name={"Repeatable"}
                canAddChildren={(item: any) => item !== undefined && !('children' in item)}
                renderItem={(item: any, key: number) => React.createElement(blocks[item.type].component, {
                    ...item,
                    key,
                    editItem: (key: keyof JSX.Element, value: JSX.Element[]) => editChildrenItem(item, key, value),
                    removeItem: () => removeChildrenItem(item)
                })}
                items={children}>
                <>
                    {children.length === 0 && <div className="add-more">Déplacer un élément dans la zone…</div>}
                </>
            </SortableList>
            <>
                {(maxItems > 1 || maxItems === 0 || maxItems === '') && (<div className="add-more repeatable-more">Ajouter une nouvelle entrée…</div>)}
            </>
        </EditableBlock>
    )
}

export default Repeatable;
