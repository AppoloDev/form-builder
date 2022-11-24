import { FC } from "react";

export const TextEdition: FC<{ label: string, value: string, editItem: any }> = ({ label, value, editItem }) => {
    return (
        <div>
            <label htmlFor="">{label}</label>
            <input type="text" value={value} onChange={e => editItem(e.target.value) }/>
        </div>
    );
}
