import { IdGenerator } from "../../utilities/String";
import { NumberEditionProps } from "./Types";
import { FC } from "react";

export const NumberEdition: FC<NumberEditionProps> = ({ label, value, editItem }) => {
    const id = IdGenerator();

    return (
        <div className="stack">
            <label htmlFor={id}>{label}</label>
            <input id={id} type="number" value={value} onChange={e => editItem(e.target.value) }/>
        </div>
    );
}
