import React, { ChangeEvent, useEffect, useRef, useState } from "react";
import { EditableBlock } from "./EditableBlock";
import { ParagraphProps, TitleProps } from "./Definition";
import { useFormBuilderStore } from "../../stores/block.store";

const Paragraph = ({id, text}: ParagraphProps) => {
    const {updateBlock} = useFormBuilderStore();
    const [inputText, setInputText] = useState<string>(text ?? '');
    const inputRef = useRef<HTMLTextAreaElement>(null);
    const spanRef = useRef<HTMLSpanElement>(null);
    const [label, setLabel] = useState("");
    const [onEdit, setOnEdit] = useState(false);
    const [inputWidth, setInputWidth] = useState(0);

    const handleOnClick = () => {
        setOnEdit(true);
    };

    const handleOnChange = ({ target }: ChangeEvent<HTMLTextAreaElement>) => {
        setLabel(target.value);
    };

    const handleOnBlur = () => {
        setOnEdit(false);
        handleChange('text', label);
    };

    useEffect(() => {
        if (onEdit && inputRef.current) {
            inputRef.current.focus();
        }
    }, [onEdit]);

    useEffect(() => {
        if (spanRef.current) {
            const width = spanRef.current.offsetWidth;
            setInputWidth(width);
        }
    }, [label]);

    useEffect(() => {
        setInputText(inputText);
    }, [inputText]);

    const handleChange = <K extends keyof Omit<TitleProps, "id">>(field: K, value: TitleProps[K]) => {
        updateBlock(id, {[field]: value} as Partial<TitleProps>);
    };

    return (
        <EditableBlock id={id}>
            <div className="flex items-center">
                {onEdit ? (
                    <>
                        <textarea
                            value={label}
                            onChange={handleOnChange}
                            onBlur={handleOnBlur}
                            rows={2}
                            style={{resize: 'none'}}
                            className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </>
                ) : (
                    <p
                        onClick={handleOnClick}
                        className={`text-base cursor-text`}
                    >
                        {label || 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua'}
                    </p>
                )}
            </div>
        </EditableBlock>
    );
};

export default Paragraph;
