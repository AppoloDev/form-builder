import React, { FC, useEffect } from "react";
import { blocks } from "./Definition";
import { FieldSetProps } from "./Types";
import { SortableList } from "../Sortable/ListSortable";
import { TrashIcon } from "../Icons/TrashIcon";
import { IdGenerator } from "../../utilities/String";


const FieldSet: FC<FieldSetProps> = ({id = '', children, editItem, removeItem}) => {
    useEffect(() => {
        if (id === '') {
            editItem('id', `fieldset_${IdGenerator()}`);
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
        <fieldset id={id}>
            <div className="actions-control">
                <div
                    onClick={() => removeItem()}
                    className="actions-control__item">
                    <TrashIcon/>
                </div>
            </div>

            <SortableList
                name={"FieldSet"}
                canAddChildren={(item: any) => item !== undefined && item.type !== "FieldSet"}
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
        </fieldset>
    )
}

export default FieldSet;
