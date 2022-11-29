import React, { FC } from "react";
import { blocks } from "./Definition";
import { FieldSetProps } from "./Types";


const FieldSet: FC<FieldSetProps> = ({children, editItem}) => {
    const editChildrenItem = (item: JSX.Element, key: keyof JSX.Element, value: JSX.Element[]) => {
        item[key] = value;
        const childrenClone = [...children];
        editItem('children', childrenClone);
    };

    const removeItem = (item: JSX.Element) => {
        const index = children.indexOf(item);

        if (index > -1) {
            children.splice(index, 1);
            editItem('children', [...children]);
        }
    }

    return (
        <fieldset>
            {children.map((item: JSX.Element, i: number) => React.createElement(blocks[item.type].component, {
                    ...item,
                    key: i,
                    editItem: (key: keyof JSX.Element, value: JSX.Element[]) => editChildrenItem(item, key, value),
                    removeItem: () => removeItem(item)
                })
            )}
        </fieldset>
    )
}

export default FieldSet;
