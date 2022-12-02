import React, { FC, useState } from "react";
import { TextEdition } from "../Edition/TextEdition";
import { EditableBlock } from "./EditableBlock";
import { TitleProps } from "./Types";

const Title: FC<TitleProps> = ({ text, editItem, removeItem }) => {
    const [visible, setVisible] = useState<boolean>(false);

    return (
        <EditableBlock
            removeItem={removeItem}
            editionItems={<TextEdition label={"Texte"} value={text} editItem={(val) => editItem('text', val)} />}>
            <h2 onClick={() => setVisible(!visible)}>{text}</h2>
        </EditableBlock>
    )
}

export default Title;
