import React, { ChangeEvent } from "react";

type Props = {
    label: string;
    value: string;
    type?: "text" | "textarea";
    helpText?: string;
    rows?: number;
    editItem: (text: string) => void
}

export const TextEdition = ({label, value, helpText, editItem, type = 'text', rows = 3}: Props) => {
    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        editItem(e.target.value);
    };

    return (
        <div className="space-y-.5 form_row">
            <label>
                {label}
            </label>

            {type === "textarea" ? (
                    <textarea
                        value={value}
                        onChange={handleChange}
                        rows={rows}
                    />
                ) :
                (
                    <input type={type}
                           value={value}
                           onChange={handleChange}
                    />
                )}

            {helpText && (
                <p className="help-text">{helpText}</p>
            )}
        </div>
    );
};
