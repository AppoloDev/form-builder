type Props = {
    label: string;
    checked: boolean;
    editItem: (editable: boolean) => void;
}

export const CheckboxEdition = ({label, checked, editItem}: Props) => {
    return (
        <label className="flex items-center cursor-pointer justify-between">
            <input type="checkbox" value="" className="sr-only peer"
                   checked={checked}
                   onChange={({target}) => editItem(target.checked)}
            />
            <span className=" text-sm font-medium text-gray-900">{label}</span>

            <div
                className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-appolo-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-200 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-appolo-600"></div>

        </label>
    );
}
