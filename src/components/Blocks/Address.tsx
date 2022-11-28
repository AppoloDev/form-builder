import React, { FC } from "react";
import { TextEdition } from "../Edition/TextEdition";
import { EditableBlock } from "./EditableBlock";
import { CheckboxEdition } from "../Edition/CheckboxEdition";
import { IdGenerator } from "../../utilities/String";
import { AddressProps } from "./Types";

const TextInput: FC<AddressProps> = ({label, tooltip, required, editItem}) => {
    const id = IdGenerator();

    return (
        <EditableBlock editionItems={[
            <TextEdition label={"Label"} value={label} editItem={(val) => editItem('label', val)} key={1}/>,
            <TextEdition label={"Info bulle"} value={tooltip} editItem={(val) => editItem('tooltip', val)}
                         key={3}/>,
            <CheckboxEdition label={"Requis"} checked={required} editItem={(val) => editItem('required', val)}
                             key={5}/>
        ]}>
            <label htmlFor={id}>{label}</label>
            <input type="text"
                   id={id}
                   placeholder={'Indiquez un lieu…'}
                   required={required}/>
        </EditableBlock>
    )
}

export default TextInput;
