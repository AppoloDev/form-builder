import React, { useEffect, useState } from "react";
import { ParagraphProps } from "./Definition";
import { useFormBuilderStore } from "../../stores/block.store";
import { EditableBlock } from "./EditableBlock";
import { TextEdition } from "../Edition/TextEdition";

type Props = ParagraphProps & { preview?: boolean };

const Paragraph = ({id, text, preview}: Props) => {
    const {updateBlock} = useFormBuilderStore();
    const [label, setLabel] = useState(text);

    useEffect(() => {
        setLabel(text);
    }, [text]);

    const handleChange = <K extends keyof Omit<ParagraphProps, "id">>(field: K, value: ParagraphProps[K]) => {
        updateBlock(id, {[field]: value} as Partial<ParagraphProps>);
    };

    return (
        <EditableBlock id={id} preview={preview} editionItems={[
            <TextEdition
                label={'Texte'}
                type={'textarea'}
                value={label}
                editItem={(v) => {
                    handleChange('text', v)
                    setLabel(v);
                }}
            />,
        ]}>
            <div className={preview ? "" : "rounded-lg p-2 transition-colors group-hover:bg-muted/50"}>
                <p>{label}</p>
            </div>
        </EditableBlock>
    );
};

export default Paragraph;
