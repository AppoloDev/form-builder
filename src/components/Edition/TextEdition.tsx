import { FC } from "react";
import { IdGenerator } from "../../utilities/String";

export const TextEdition: FC<{ label: string, value: string, editItem: any }> = ({ label, value, editItem }) => {
    const id = IdGenerator();

    return (
        <div className="stack">
            <label htmlFor={id}>{label}</label>
            <input id={id} type="text" value={value} onChange={e => editItem(e.target.value) }/>
        </div>
    );
}
