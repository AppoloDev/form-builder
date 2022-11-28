import React from "react";
import { TextEdition } from "../Edition/TextEdition";
import { EditableBlock } from "./EditableBlock";
import { CheckboxEdition } from "../Edition/CheckboxEdition";
import { IdGenerator } from "../../utilities/String";

function Signature({label, tooltip, required, editItem}: any) {
    const id = IdGenerator();

    return (
        <EditableBlock editionItems={[
            <TextEdition label={"Label"} value={label} editItem={(val: string) => editItem('label', val)} key={1}/>,
            <TextEdition label={"Info bulle"} value={tooltip} editItem={(val: string) => editItem('tooltip', val)}
                         key={3}/>,
            <CheckboxEdition label={"Requis"} checked={required} editItem={(val: boolean) => editItem('required', val)}
                             key={5}/>
        ]}>
            <label htmlFor={id}>{label}</label>
            <div>Signature</div>
        </EditableBlock>
    )
}

export default Signature;
