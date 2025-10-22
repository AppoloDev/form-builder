import React, { ChangeEvent } from "react";

type Props = {
    label: string;
    value: string;
    type?: "text" | "number";
    helpText?: string;
    editItem: (text: string) => void
}

export const TextEdition = ({ label, value, helpText, editItem, type = 'text' }: Props) => {
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        editItem(e.target.value);
    };

    return (
        <div className="space-y-1">
            <label className="block mb-2 text-sm font-medium text-gray-900">
                {label}
            </label>
            <input type={type}
                   value={value}
                   onChange={handleChange}
                   className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            />
            {helpText && (
                <p className="text-xs text-gray-500 mt-1">{helpText}</p>
            )}
        </div>
    );
};
