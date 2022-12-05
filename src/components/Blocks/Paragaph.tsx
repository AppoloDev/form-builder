import React, { FC, useState } from "react";
import { EditableBlock } from "./EditableBlock";
import { TextAreaEdition } from "../Edition/TextAreaEdition";
import { ParagraphProps } from "./Types";

const Paragraph: FC<ParagraphProps> = ({text = '', editItem, removeItem}) => {
    const [visible, setVisible] = useState<boolean>(false);

    return (
        <EditableBlock
            removeItem={removeItem}
            editionItems={<TextAreaEdition label={"Paragraphe"} value={text} rows={10}
                                           editItem={(val) => editItem('text', val)}/>}>
            <p onClick={() => setVisible(!visible)}>{text}</p>
        </EditableBlock>
    )
}

export default Paragraph;
