import React from "react";

type Option = { value: string; label: string };

type Props = {
    label: string;
    value: string;
    options: Option[];
    helpText?: string;
    editItem: (value: string) => void;
};

export const SelectEdition: React.FC<Props> = ({ label, value, options, helpText, editItem }) => {
    return (
        <div className="mb-3">
            <label className="block mb-2 text-sm font-medium text-gray-900">{label}</label>
            <select
                value={value ?? ""}
                onChange={(e) => editItem(e.target.value)}
                className="bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            >
                {options.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
            </select>
            {helpText && <p className="mt-1 text-xs text-gray-500 italic">{helpText}</p>}
        </div>
    );
};
