import React, { FC, useState } from "react";
import { EditableBlock } from "./EditableBlock";
import { TextAreaEdition } from "../Edition/TextAreaEdition";
import { ParagraphProps } from "./Types";

const Paragraph: FC<ParagraphProps> = ({ text, editItem }) => {
    const [visible, setVisible] = useState<boolean>(false);

    return (
        <EditableBlock editionItems={<TextAreaEdition label={"Paragraphe"} value={text} editItem={(val) => editItem('text', val)} />}>
            <p onClick={() => setVisible(!visible)}>{text}</p>
        </EditableBlock>
    )
}

export default Paragraph;
