import { FC } from "react";
import { IdGenerator } from "../../utilities/String";

export const CheckboxEdition: FC<{ label: string, checked: boolean, editItem: any }> = ({label, checked, editItem}) => {
    const id = IdGenerator();

    return (
        <div className="stack checkbox">
            <input type="checkbox" id={id} checked={checked}
                   onChange={e => editItem(e.target.checked)}/>
            <label htmlFor={id}>{label}</label>
        </div>
    );
}
