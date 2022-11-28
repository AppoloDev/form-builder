import React from "react";
import { blocks } from "./Definition";

function FieldSet({children, editItem}: any) {
    const editChildrenItem = (item: any, key: string, value: any) => {
        item[key] = value;
        const childrenClone = [...children];
        editItem('children', childrenClone);
    };

    return (
        <fieldset>
            {children.map((item: any, i: number) => React.createElement(blocks[item.type].component, {
                key: i, ...item,
                editItem: (key: string, value: any) => editChildrenItem(item, key, value)
            }))}
        </fieldset>
    )
}

export default FieldSet;
