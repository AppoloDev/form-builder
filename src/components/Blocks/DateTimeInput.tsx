import React, { FC, useEffect, useState } from "react";
import { TextEdition } from "../Edition/TextEdition";
import { EditableBlock } from "./EditableBlock";
import { CheckboxEdition } from "../Edition/CheckboxEdition";
import { IdGenerator } from "../../utilities/String";
import { DateTimeInputProps } from "./Types";
import { WarningCircledIcon } from "../Icons/WarningCircledIcon";

const DateTimeInput: FC<DateTimeInputProps> = ({label, placeHolder, helpText, defaultValue, readOnly, required, showHour, editItem, removeItem}) => {
    const id = IdGenerator();
    const [value, setValue] = useState(defaultValue);

    useEffect(() => {
        setValue(defaultValue);
    }, [defaultValue]);

    return (
        <EditableBlock
            removeItem={removeItem}
            editionItems={[
            <TextEdition
                label={"Label"}
                value={label}
                editItem={(val) => editItem('label', val)}
                key={1}
            />,

            <TextEdition
                label={"PlaceHolder"}
                value={placeHolder}
                editItem={(val) => editItem('placeHolder', val)}
                key={2}
            />,

            <TextEdition
                label={"Texte par défaut"}
                value={defaultValue}
                editItem={(val) => editItem('defaultValue', val)}
                key={3}
            />,

            <TextEdition
                label={"Texte d'aide"}
                value={helpText}
                editItem={(val) => editItem('helpText', val)}
                key={4}
            />,

            <CheckboxEdition
                label={"Afficher l'heure ?"}
                checked={showHour}
                editItem={(val) => editItem('showHour', val)}
                key={5}
            />,

            <CheckboxEdition
                label={"Requis"}
                checked={required}
                editItem={(val) => editItem('required', val)}
                key={6}
            />,

            <CheckboxEdition
                label={"Lecture seule"}
                checked={readOnly}
                editItem={(val) => editItem('readOnly', val)}
                key={7}
            />,
        ]}>
            <label htmlFor={id}>
                {label}
                {required && <span className="required">Requis</span>}
            </label>

            <input type={showHour ? 'datetime-local' : 'date'}
                   id={id}
                   placeholder={placeHolder}
                   disabled={readOnly}
                   value={value}
                   onChange={({target}) => setValue(target.value)}
                   required={required}
            />

            <>
                {helpText && <div className="help-text">
                    <WarningCircledIcon/>
                    {helpText}
                </div>}
            </>
        </EditableBlock>
    )
}

export default DateTimeInput;
