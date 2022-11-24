import React from "react";
import { useUniqueId } from "@dnd-kit/utilities";
import { TextEdition } from "../edition/TextEdition";
import { EditableBlock } from "./EditableBlock";
import { CheckboxEdition } from "../edition/CheckboxEdition";

function Signature({ label, tooltip, required, editItem }: any) {
    const id = useUniqueId('textarea-');

    return (
        <>
            <EditableBlock editionItems={[
                <TextEdition label={"Label"} value={label} editItem={(val: string) => editItem('label', val)} key={1}/>,
                <TextEdition label={"Info bulle"} value={tooltip} editItem={(val: string) => editItem('tooltip', val)} key={3} />,
                <CheckboxEdition label={"Requis"} checked={required} editItem={(val: boolean) => editItem('required', val)} key={5} />
            ]}>
                <label htmlFor={id}>{label}</label>
                <div>Signature</div>
            </EditableBlock>
        </>
    )
}

export default Signature;
