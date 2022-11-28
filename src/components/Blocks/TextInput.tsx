import React from "react";
import { TextEdition } from "../Edition/TextEdition";
import { EditableBlock } from "./EditableBlock";
import { CheckboxEdition } from "../Edition/CheckboxEdition";
import { IdGenerator } from "../../utilities/String";

function TextInput({label, placeHolder, tooltip, required, editItem}: any) {
    const id = IdGenerator();

    return (
        <EditableBlock editionItems={[
            <TextEdition label={"Label"} value={label} editItem={(val: string) => editItem('label', val)} key={1}/>,
            <TextEdition label={"PlaceHolder"} value={placeHolder}
                         editItem={(val: string) => editItem('placeHolder', val)} key={2}/>,
            <TextEdition label={"Info bulle"} value={tooltip} editItem={(val: string) => editItem('tooltip', val)}
                         key={3}/>,
            <CheckboxEdition label={"Requis"} checked={required} editItem={(val: boolean) => editItem('required', val)}
                             key={5}/>
        ]}>
            <label htmlFor={id}>{label}</label>
            <input type="text"
                   id={id}
                   placeholder={placeHolder}
                   required={required}/>
        </EditableBlock>
    )
}

export default TextInput;
