import React, { FC, useEffect, useState } from "react";
import { EditableBlock } from "./EditableBlock";
import { TextAreaEdition } from "../Edition/TextAreaEdition";
import { ParagraphProps } from "./Types";
import { IdGenerator } from "../../utilities/String";

const Paragraph: FC<ParagraphProps> = ({text = '', editItem, removeItem}) => {
    const [visible, setVisible] = useState<boolean>(false);
    const idInput = `paragraph_${IdGenerator()}`;

    useEffect(() => {
        editItem('id', idInput);
    }, [])

    return (
        <EditableBlock
            removeItem={removeItem}
            editionItems={<TextAreaEdition label={"Paragraphe"} value={text} rows={10}
                                           editItem={(val) => editItem('text', val)}/>}>
            <p id={idInput} onClick={() => setVisible(!visible)}>{text}</p>
        </EditableBlock>
    )
}

export default Paragraph;
