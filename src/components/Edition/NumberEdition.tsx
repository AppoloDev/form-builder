import { IdGenerator } from "../../utilities/String";
import { NumberEditionProps } from "./Types";
import { FC } from "react";

export const NumberEdition: FC<NumberEditionProps> = ({ label, value, min, max, editItem }) => {
    const id = IdGenerator();

    return (
        <div className="stack">
            <label htmlFor={id}>{label}</label>
            <input
                id={id}
                type="number"
                value={value}
                min={min}
                max={max}
                onChange={e => editItem(e.target.value) }
            />
        </div>
    );
}
