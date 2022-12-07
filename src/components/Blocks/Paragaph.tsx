import React, { FC, Fragment, useEffect, useState } from "react";
import { EditableBlock } from "./EditableBlock";
import { TextAreaEdition } from "../Edition/TextAreaEdition";
import { ParagraphProps } from "./Types";
import { IdGenerator } from "../../utilities/String";

const Paragraph: FC<ParagraphProps> = ({id = '', text = '', editItem, removeItem}) => {
    const [visible, setVisible] = useState<boolean>(false);

    useEffect(() => {
        if (id === '') {
            editItem('id', `paragraph_${IdGenerator()}`);
        }
    }, [])

    return (
        <EditableBlock
            removeItem={removeItem}
            editionItems={<TextAreaEdition label={"Paragraphe"} value={text} rows={10}
                                           editItem={(val) => editItem('text', val)}/>}>
            <p id={id} onClick={() => setVisible(!visible)}>
                {text.split('\n').map((item, key) => <Fragment key={key}>{item}<br/></Fragment>)}
            </p>
        </EditableBlock>
    )
}

export default Paragraph;
