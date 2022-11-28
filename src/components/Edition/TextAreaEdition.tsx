import { IdGenerator } from "../../utilities/String";
import { TextAreaEditionProps } from "./Types";

export const TextAreaEdition = ({label, value, editItem}: TextAreaEditionProps) => {
    const id = IdGenerator();

    return (
        <div className="stack">
            <label htmlFor={id}>{label}</label>
            <textarea
                id={id}
                value={value}
                onChange={e => editItem(e.target.value)}
                rows={10}
            />
        </div>
    );
}
