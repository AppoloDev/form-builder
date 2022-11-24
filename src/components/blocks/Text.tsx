import React, { useState } from "react";
import { TextEdition } from "../edition/TextEdition";
import { EditableBlock } from "./EditableBlock";

function Text({ text, editItem }: any) {

    const [visible, setVisible] = useState<boolean>(false);

    return (
        <EditableBlock editionItems={<TextEdition label={"Texte"} value={text} editItem={(val: string) => editItem('text', val)} />}>
            <h3 onClick={() => setVisible(!visible)}>{text}</h3>
        </EditableBlock>
    )
}

export default Text;
