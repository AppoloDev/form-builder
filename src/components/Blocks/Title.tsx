import React, { useState } from "react";
import { TextEdition } from "../Edition/TextEdition";
import { EditableBlock } from "./EditableBlock";

function Title({ text, editItem }: any) {

    const [visible, setVisible] = useState<boolean>(false);

    return (
        <EditableBlock editionItems={<TextEdition label={"Texte"} value={text} editItem={(val: string) => editItem('text', val)} />}>
            <h2 onClick={() => setVisible(!visible)}>{text}</h2>
        </EditableBlock>
    )
}

export default Title;
