import React, { FC } from "react";
import { TextEdition } from "../Edition/TextEdition";
import { EditableBlock } from "./EditableBlock";
import { CheckboxEdition } from "../Edition/CheckboxEdition";
import { NumberEdition } from "../Edition/NumberEdition";
import { IdGenerator } from "../../utilities/String";
import { FileInputProps } from "./Types";

const FileInput: FC<FileInputProps> = ({label, tooltip, maxItems, required, editItem}: FileInputProps) => {
    const id = IdGenerator();

    return (
        <EditableBlock editionItems={[
            <TextEdition label={"Label"} value={label} editItem={(val) => editItem('label', val)} key={1}/>,
            <TextEdition label={"Info bulle"} value={tooltip} editItem={(val) => editItem('tooltip', val)}
                         key={2}/>,
            <CheckboxEdition label={"Requis"} checked={required} editItem={(val) => editItem('required', val)}
                             key={3}/>,
            <NumberEdition label={"Nombre maximal de fichiers"} value={maxItems}
                           editItem={(val) => editItem('maxItems', val)} key={4}/>
        ]}>
            <label htmlFor={id}>{label}</label>
            <input type="file"
                   multiple={maxItems > 1}
                   disabled={true}
                   id={id}
                   required={required}/>
        </EditableBlock>
    )
}

export default FileInput;
