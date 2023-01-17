import { IdGenerator } from "../../utilities/String";
import { TextAreaEditionProps } from "./Types";
import { FC } from "react";

export const TextAreaEdition: FC<TextAreaEditionProps> = ({label, value, helpText, rows = 5, editItem}) => {
    const id = IdGenerator();

    return (
        <div className="stack">
            <label htmlFor={id}>{label}</label>
            <textarea
                id={id}
                value={value}
                onChange={e => editItem(e.target.value)}
                rows={rows}
            />
            <small className="form-text text-muted">{helpText}</small>
        </div>
    );
}
