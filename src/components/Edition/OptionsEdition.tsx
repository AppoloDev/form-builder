import React from "react";

type Props = {
    label: string;
    value: string[];
    helpText?: string;
    onChange: (next: string[]) => void;
};

export const OptionsEdition: React.FC<Props> = ({ label, value = [], helpText, onChange }) => {
    const add = () => onChange([...value, "Nouvelle option"]);
    const update = (idx: number, v: string) => {
        const next = [...value];
        next[idx] = v;
        onChange(next);
    };
    const remove = (idx: number) => {
        const next = value.filter((_, i) => i !== idx);
        onChange(next);
    };

    return (
        <div className="mb-3">
            <div className="flex items-center justify-between mb-1">
                <label className="block text-sm font-medium text-gray-700">{label}</label>
                <button
                    type="button"
                    onClick={add}
                    className="text-xs px-2 py-1 rounded-lg bg-gray-200 hover:bg-gray-300"
                >
                    + Ajouter
                </button>
            </div>

            <div className="space-y-2">
                {value.map((opt, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                        <input
                            value={opt}
                            onChange={(e) => update(idx, e.target.value)}
                            className="flex-1 bg-white border border-gray-200 text-sm rounded-lg px-2 py-1
                         focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button
                            type="button"
                            onClick={() => remove(idx)}
                            className="text-xs px-2 py-1 rounded-lg bg-red-100 text-red-700 hover:bg-red-200"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 256 256"><path d="M216,48H176V40a24,24,0,0,0-24-24H104A24,24,0,0,0,80,40v8H40a8,8,0,0,0,0,16h8V208a16,16,0,0,0,16,16H192a16,16,0,0,0,16-16V64h8a8,8,0,0,0,0-16ZM96,40a8,8,0,0,1,8-8h48a8,8,0,0,1,8,8v8H96Zm96,168H64V64H192ZM112,104v64a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Zm48,0v64a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Z"></path></svg>
                        </button>
                    </div>
                ))}
            </div>

            {helpText && (
                <p className="mt-1 text-xs text-gray-500 italic">{helpText}</p>
            )}
        </div>
    );
};
