import React, { FC } from "react";
import { blocks } from "./Definition";
import { FieldSetProps } from "./Types";
import { SortableList } from "../Sortable/ListSortable";

const FieldSet: FC<FieldSetProps> = ({ children, editItem }) => {
    const editChildrenItem = (item: JSX.Element, key: keyof JSX.Element, value: JSX.Element[]) => {
        item[key] = value;
        const childrenClone = [...children];
        editItem('children', childrenClone);
    };

    return (
        <fieldset style={{ border: '1px solid black' }}>
            <SortableList
               renderItem={(item: any, key: number) => React.createElement(blocks[item.type].component, {
                   ...item,
                   key,
                   editItem: (key: keyof JSX.Element, value: JSX.Element[]) => editChildrenItem(item, key, value)
               })}
               items={children}>
            </SortableList>
        </fieldset>
    )
}

export default FieldSet;
