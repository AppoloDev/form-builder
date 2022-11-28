import React, { FC } from "react";
import { TextEdition } from "../Edition/TextEdition";
import { EditableBlock } from "./EditableBlock";
import { CheckboxEdition } from "../Edition/CheckboxEdition";
import { IdGenerator } from "../../utilities/String";
import { AddressProps } from "./Types";
import { WarningCircledIcon } from "../Icons/WarningCircledIcon";

const TextInput: FC<AddressProps> = ({label, helpText, required, editItem}) => {
    const id = IdGenerator();

    return (
        <EditableBlock editionItems={[
            <TextEdition label={"Label"} value={label} editItem={(val) => editItem('label', val)} key={1}/>,
            <TextEdition label={"Texte d'aide"} value={helpText} editItem={(val) => editItem('helpText', val)}
                         key={3}/>,
            <CheckboxEdition label={"Requis"} checked={required} editItem={(val) => editItem('required', val)}
                             key={5}/>
        ]}>
            <label htmlFor={id}>
                {label}
                {required && <span className="required">Requis</span>}
            </label>
            <input type="text"
                   id={id}
                   placeholder={'Indiquez un lieu…'}
                   required={required}/>

            <>
                {helpText && <div className="help-text">
                    <WarningCircledIcon />
                    {helpText}
                </div>}
            </>
        </EditableBlock>
    )
}

export default TextInput;
