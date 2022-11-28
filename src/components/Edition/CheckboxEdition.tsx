import { IdGenerator } from "../../utilities/String";
import { CheckboxEditionProps } from "./Types";
import { FC } from "react";

export const CheckboxEdition: FC<CheckboxEditionProps> = ({label, checked, editItem}) => {
    const id = IdGenerator();

    return (
        <div className="stack checkbox">
            <input type="checkbox" id={id} checked={checked}
                   onChange={e => editItem(e.target.checked)}/>
            <label htmlFor={id}>{label}</label>
        </div>
    );
}
