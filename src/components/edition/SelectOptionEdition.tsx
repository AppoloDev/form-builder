import { FC } from "react";
import {TextEdition} from "./TextEdition";

export const SelectOptionEdition: FC<{ label: string, options: any[], editItem: any }> = ({ label, options, editItem }) => {

    const editChildrenItem = (item: any, key: string, value: string) => {
        item[key] = value;
        editItem([...options]);
    };

    const removeChildrenItem = (item: any) => {
        const clone = [...options];
        clone.splice(options.indexOf(item), 1)
        editItem(clone);
    };

    const addChildrenItem = () => {
        const clone = [...options, { label: "", value: "" }];
        editItem(clone);
    };

    return (
        <div>
            <label htmlFor="">{label}</label>
            <div>
                {options.map((item, i) => <div key={i}>
                    <TextEdition label={'Label'} value={item.label} editItem={(val: string) => editChildrenItem(item, 'label', val)} />
                    <TextEdition label={'Valeur'} value={item.value} editItem={(val: string) => editChildrenItem(item, 'value', val)} />
                    test <button onClick={() => removeChildrenItem(item)}>Supprimer</button>
                </div>)}

                <button onClick={addChildrenItem}>Ajouter</button>
            </div>
        </div>
    );
}
