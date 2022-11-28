import React, { FC } from "react";
import { blocks } from "./Definition";
import { FieldSetProps } from "./Types";


const FieldSet: FC<FieldSetProps> = ({children, editItem}) => {
    const editChildrenItem = (item: JSX.Element, key: keyof JSX.Element, value: JSX.Element[]) => {
        item[key] = value;
        const childrenClone = [...children];
        editItem('children', childrenClone);
    };

    return (
        <fieldset>
            {children.map((item: JSX.Element, i: number) => React.createElement(blocks[item.type].component, {
                    ...item,
                    key: i,
                    editItem: (key: keyof JSX.Element, value: JSX.Element[]) => editChildrenItem(item, key, value)
                })
            )}
        </fieldset>
    )
}

export default FieldSet;
