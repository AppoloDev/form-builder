import React, { useState } from "react";
import { ParagraphProps } from "./Definition";
import { useFormBuilderStore } from "../../stores/block.store";
import { EditableBlock } from "./EditableBlock";
import { TextEdition } from "../Edition/TextEdition";

const Paragraph = ({id, text}: ParagraphProps) => {
    const {updateBlock} = useFormBuilderStore();
    const [label, setLabel] = useState(text);

    const handleChange = <K extends keyof Omit<ParagraphProps, "id">>(field: K, value: ParagraphProps[K]) => {
        updateBlock(id, {[field]: value} as Partial<ParagraphProps>);
    };

    return (
        <div className="flex items-center gap-4 ">
            <EditableBlock id={id} editionItems={[
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
                <div className="border border-gray-200 rounded-lg p-4 flex-1">
                    <p>{label}</p>
                </div>
            </EditableBlock>
        </div>
    );
};

export default Paragraph;
