import React, { FC, useEffect, useState } from "react";
import { TextEdition } from "../Edition/TextEdition";
import { EditableBlock } from "./EditableBlock";
import { TitleProps } from "./Types";
import { IdGenerator } from "../../utilities/String";

const Title: FC<TitleProps> = ({ text, editItem, removeItem }) => {
    const [visible, setVisible] = useState<boolean>(false);
    const idInput = `title_${IdGenerator()}`;

    useEffect(() => {
        editItem('id', idInput);
    }, [])

    return (
        <EditableBlock
            removeItem={removeItem}
            editionItems={<TextEdition label={"Texte"} value={text} editItem={(val) => editItem('text', val)} />}>
            <h2 id={idInput} onClick={() => setVisible(!visible)}>{text}</h2>
        </EditableBlock>
    )
}

export default Title;
