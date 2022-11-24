import { FC } from "react";

export const CheckboxEdition: FC<{ label: string, checked: boolean, editItem: any }> = ({ label, checked, editItem }) => {
    return (
        <div>
            <label htmlFor="">{label}</label>
            <input type="checkbox" checked={checked} onChange={e => editItem(e.target.checked) }/>
        </div>
    );
}
