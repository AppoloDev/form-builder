import React, { useState } from "react";
import { TitleProps } from "./Definition";
import { useFormBuilderStore } from "../../stores/block.store";
import { EditableBlock } from "./EditableBlock";
import { TextEdition } from "../Edition/TextEdition";
import { SelectEdition } from "../Edition/SelectEdition";

const Title = ({id, text, heading}: TitleProps) => {
    const {updateBlock} = useFormBuilderStore();
    const [label, setLabel] = useState(text);
    const [headingLevel, setHeadingLevel] = useState(heading);

    const handleChange = <K extends keyof Omit<TitleProps, "id">>(field: K, value: TitleProps[K]) => {
        updateBlock(id, {[field]: value} as Partial<TitleProps>);
    };

    const renderClass = (headingLevel: string) => {
        switch (headingLevel) {
            case 'h1':
                return 'text-4xl';
            case 'h2':
                return 'text-3xl';
            case 'h3':
                return 'text-2xl';
            case 'h4':
                return 'text-xl';
            case 'h5':
                return 'text-lg';
            case 'h6':
                return 'text-base';
        }
    }

    return (
        <div className="flex items-center gap-4 ">
            <EditableBlock id={id} editionItems={[
                <TextEdition
                    label={'Titre'}
                    value={label}
                    editItem={(v) => {
                        handleChange('text', v)
                        setLabel(v);
                    }}
                />,
                <SelectEdition
                    label={'Niveau de titre'}
                    value={headingLevel}
                    options={[
                        {value: 'h1', label: 'Titre de niveau 1'},
                        {value: 'h2', label: 'Titre de niveau 2'},
                        {value: 'h3', label: 'Titre de niveau 3'},
                        {value: 'h4', label: 'Titre de niveau 4'},
                        {value: 'h5', label: 'Titre de niveau 5'},
                        {value: 'h6', label: 'Titre de niveau 6'},
                    ]}
                    editItem={(v) => {
                        handleChange('heading', v)
                        setHeadingLevel(v);
                    }}
                />
            ]}>
                <div className="border border-border rounded-lg p-4 flex-1">
                    {React.createElement(headingLevel, {className: renderClass(headingLevel)}, label)}
                </div>
            </EditableBlock>
        </div>
    );
};

export default Title;
