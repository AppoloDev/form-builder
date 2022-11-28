import React, { useState } from "react";
import { EditableBlock } from "./EditableBlock";
import { TextAreaEdition } from "../Edition/TextAreaEdition";

function Paragraph({ text, editItem }: any) {

    const [visible, setVisible] = useState<boolean>(false);

    return (
        <EditableBlock editionItems={<TextAreaEdition label={"Paragraphe"} value={text} editItem={(val: string) => editItem('text', val)} />}>
            <p onClick={() => setVisible(!visible)}>{text}</p>
        </EditableBlock>
    )
}

export default Paragraph;
