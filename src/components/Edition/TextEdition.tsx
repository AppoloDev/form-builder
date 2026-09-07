import { ChangeEvent } from "react";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";

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
                <Textarea
                    value={value}
                    onChange={handleChange}
                    rows={rows}
                />
            ) : (
                <Input
                    type={type}
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
