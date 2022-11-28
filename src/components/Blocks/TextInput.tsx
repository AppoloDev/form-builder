import React, { FC } from "react";
import { TextEdition } from "../Edition/TextEdition";
import { EditableBlock } from "./EditableBlock";
import { CheckboxEdition } from "../Edition/CheckboxEdition";
import { IdGenerator } from "../../utilities/String";
import { TextInputProps } from "./Types";
import { WarningCircledIcon } from "../Icons/WarningCircledIcon";

const TextInput: FC<TextInputProps> = ({label, placeHolder, helpText, defaultValue, readOnly, required, editItem}) => {
    const id = IdGenerator();

    return (
        <EditableBlock editionItems={[
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
                label={"Requis"}
                checked={required}
                editItem={(val) => editItem('required', val)}
                key={5}
            />,

            <CheckboxEdition
                label={"Lecture seule"}
                checked={readOnly}
                editItem={(val) => editItem('readOnly', val)}
                key={6}
            />,
        ]}>
            <label htmlFor={id}>
                {label}
                {required && <span className="required">Requis</span>}
            </label>

            <input type="text"
                   id={id}
                   placeholder={placeHolder}
                   disabled={readOnly}
                   value={defaultValue}
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

export default TextInput;
