import { IdGenerator } from "../../utilities/String";
import { SelectEditionProps } from "./Types";
import { FC, useEffect, useState } from "react";

export const SelectEdition: FC<SelectEditionProps> = ({label, value, options, editItem}) => {
    const id = IdGenerator();
    const [optionValue, setOptionValue] = useState<string>(value);

    useEffect(() => {
        editItem(optionValue);
    }, [optionValue])

    return (
        <div className="stack">
            <label htmlFor={id}>{label}</label>
            <select
                id={id} value={optionValue}
                onChange={({target}) => {
                    setOptionValue(target.value);
                }}
            >
                {options.map((option, index) => (
                    <option value={option.value} key={index}>{option.label}</option>
                ))}
            </select>
        </div>
    );
}
