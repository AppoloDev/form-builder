import { IdGenerator } from "../../utilities/String";
import { TextEditionProps } from "./Types";

export const TextEdition = ({label, value, helpText, editItem}: TextEditionProps) => {
    const id = IdGenerator();

    return (
        <div className="stack">
            <label htmlFor={id}>{label}</label>
            <input id={id} type="text" value={value} onChange={e => editItem(e.target.value)}/>
            <small className="form-text text-muted">{helpText}</small>
        </div>
    );
}
