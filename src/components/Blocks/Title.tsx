import React, { ChangeEvent, useEffect, useRef, useState } from "react";
import { EditableBlock } from "./EditableBlock";
import { TitleProps } from "./Definition";
import { useFormBuilderStore } from "../../stores/block.store";

const Title = ({id, text}: TitleProps) => {
    const {updateBlock} = useFormBuilderStore();
    const [inputText, setInputText] = useState<string>(text ?? '');
    const inputRef = useRef<HTMLInputElement>(null);
    const spanRef = useRef<HTMLSpanElement>(null);
    const [label, setLabel] = useState("");
    const [onEdit, setOnEdit] = useState(false);
    const [inputWidth, setInputWidth] = useState(0);

    const handleOnClick = () => {
        setOnEdit(true);
    };

    const handleOnChange = ({target}: ChangeEvent<HTMLInputElement>) => {
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
        <div className="flex items-center">
            {onEdit ? (
                <>
                        <span
                            ref={spanRef}
                            className="invisible absolute whitespace-pre text-gray-700 font-bold"
                        >
                            {label || "Renseigner un titre"}
                        </span>

                    <input
                        ref={inputRef}
                        value={label}
                        onChange={handleOnChange}
                        onBlur={handleOnBlur}
                        style={{width: inputWidth || 50}}
                        className="text-base font-bold text-gray-700 focus:border-gray-300 focus:outline-none"
                    />
                </>
            ) : (
                <div
                    onClick={handleOnClick}
                    className={`text-base cursor-text font-bold ${label ? "" : "text-slate-400 italic"}`}
                >
                    {label || "Renseigner un titre"}
                </div>
            )}
        </div>
    );
};

export default Title;
