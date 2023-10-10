import React, { FC, useEffect, useState } from "react";
import { TextEdition } from "../Edition/TextEdition";
import { EditableBlock } from "./EditableBlock";
import { TitleProps } from "./Types";
import { IdGenerator } from "../../utilities/String";

const Title: FC<TitleProps> = ({id = '', text, editItem, removeItem }) => {
    const [visible, setVisible] = useState<boolean>(false);

    useEffect(() => {
        if (id === '') {
            editItem('id', `title_${IdGenerator()}`);
        }
    }, [id])

    return (
        <EditableBlock
            removeItem={removeItem}
            editionItems={<TextEdition label={"Texte"} value={text} editItem={(val) => editItem('text', val)} />}>
            <h2 id={id} onClick={() => setVisible(!visible)}>{text}</h2>
        </EditableBlock>
    )
}

export default Title;
