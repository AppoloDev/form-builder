import { FC } from "react";
import { TextEdition } from "./TextEdition";
import { CancelIcon } from "../Icons/CancelIcon";
import { SelectOptionEditionProps } from "./Types";
import { OptionProps } from "../Blocks/Types";

export const SelectOptionEdition: FC<SelectOptionEditionProps> = ({label, options, editItem}) => {
    const editChildrenItem = (item: OptionProps, key: keyof OptionProps, value: string) => {
        item[key] = value;
        editItem([...options]);
    };

    const removeChildrenItem = (item: OptionProps) => {
        const clone = [...options];
        clone.splice(options.indexOf(item), 1)
        editItem(clone);
    };

    const addChildrenItem = () => {
        const clone = [...options, {label: "", value: ""}];
        editItem(clone);
    };

    return (
        <div className="stack">
            <div className="stack-heading">
                <h3>{label}</h3>
                <button onClick={addChildrenItem}>Ajouter une option</button>
            </div>

            <div className="stack-content">
                {options.map((item, i) => (
                    <div className="stack stack-horizontal" key={i}>
                        <TextEdition label={'Label'} value={item.label}
                                     editItem={(val) => editChildrenItem(item, 'label', val)}/>
                        <TextEdition label={'Valeur'} value={item.value}
                                     editItem={(val) => editChildrenItem(item, 'value', val)}/>

                        <div className="delete">
                            <button onClick={() => removeChildrenItem(item)}>
                                <CancelIcon/>
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
