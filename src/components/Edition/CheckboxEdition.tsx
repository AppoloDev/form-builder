import { IdGenerator } from "../../utilities/String";
import { CheckboxEditionProps } from "./Types";
import { FC } from "react";

export const CheckboxEdition: FC<CheckboxEditionProps> = ({label, checked, editItem, disabled}) => {
    const id = IdGenerator();

    return (
        <div className="stack checkbox">
            <input
                type="checkbox"
                id={id}
                checked={checked}
                disabled={disabled}
                onChange={e => editItem(e.target.checked)}/>
            <label htmlFor={id}>{label}</label>
        </div>
    );
}
