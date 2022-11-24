import { FC } from "react";

export const NumberEdition: FC<{ label: string, value: number, editItem: any }> = ({ label, value, editItem }) => {
    return (
        <div>
            <label htmlFor="">{label}</label>
            <input type="number" value={value} onChange={e => editItem(e.target.value) }/>
        </div>
    );
}
