import React, { FC, useEffect } from "react";
import { TextEdition } from "../Edition/TextEdition";
import { EditableBlock } from "./EditableBlock";
import { CheckboxEdition } from "../Edition/CheckboxEdition";
import { IdGenerator } from "../../utilities/String";
import { EmailInputProps } from "./Types";
import { WarningCircledIcon } from "../Icons/WarningCircledIcon";

const EmailInput: FC<EmailInputProps> = ({id = '', label = '', placeHolder= '', helpText = '', defaultValue = '', readOnly = false, required = false, editItem, removeItem}) => {
    useEffect(() => {
        if (id === '') {
            editItem('id', `email_${IdGenerator()}`);
        }
    }, [])

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

            <input type="email"
                   id={id}
                   placeholder={placeHolder}
                   disabled={readOnly}
                   defaultValue={defaultValue}
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

export default EmailInput;
