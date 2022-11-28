import { FC } from "react";
import { IdGenerator } from "../../utilities/String";

export const TextAreaEdition: FC<{ label: string, value: string, editItem: any }> = ({label, value, editItem}) => {
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
