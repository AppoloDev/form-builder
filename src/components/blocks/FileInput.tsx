import React from "react";
import { useUniqueId } from "@dnd-kit/utilities";
import { TextEdition } from "../edition/TextEdition";
import { EditableBlock } from "./EditableBlock";
import { CheckboxEdition } from "../edition/CheckboxEdition";
import {NumberEdition} from "../edition/NumberEdition";

function FileInput({ label, tooltip, maxItems, required, editItem }: any) {
    const id = useUniqueId('file-');

    return (
        <>
            <EditableBlock editionItems={[
                <TextEdition label={"Label"} value={label} editItem={(val: string) => editItem('label', val)} key={1}/>,
                <TextEdition label={"Info bulle"} value={tooltip} editItem={(val: string) => editItem('tooltip', val)} key={2} />,
                <CheckboxEdition label={"Requis"} checked={required} editItem={(val: boolean) => editItem('required', val)} key={3} />,
                <NumberEdition label={"Nombre maximal de fichiers"} value={maxItems} editItem={(val: boolean) => editItem('maxItems', val)} key={4} />
            ]}>
                <label htmlFor={id}>{label}</label>
                <input type="file"
                       multiple={maxItems > 1}
                       disabled={true}
                       id={id}
                       required={required} />
            </EditableBlock>
        </>
    )
}

export default FileInput;
