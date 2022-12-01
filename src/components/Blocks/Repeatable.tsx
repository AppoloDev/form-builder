import React, { FC } from "react";
import { blocks } from "./Definition";
import { RepeatableProps } from "./Types";
import { EditableBlock } from "./EditableBlock";
import { NumberEdition } from "../Edition/NumberEdition";
import {SortableList} from "../Sortable/ListSortable";

const Repeatable: FC<RepeatableProps> = ({ children, maxItems, editItem, removeItem }) => {
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
                    editItem={(val) => editItem('maxItems', val)}
                    key={1}
                />
            ]}
        >
            <SortableList
                name={"Repeatable"}
                renderItem={(item: any, key: number) => React.createElement(blocks[item.type].component, {
                    ...item,
                    key,
                    editItem: (key: keyof JSX.Element, value: JSX.Element[]) => editChildrenItem(item, key, value),
                    removeItem: () => removeChildrenItem(item)
                })}
                items={children}>
                <>
                    {children.length === 0 && <div className="add-more">Ajouter un nouveau bloc…</div>}
                </>
            </SortableList>
            <>
                {maxItems > 1 && (<div className="add-more">Ajouter une nouvelle entrée…</div>)}
            </>
        </EditableBlock>
    )
}

export default Repeatable;
