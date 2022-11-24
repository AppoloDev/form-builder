import React from "react";
import { useUniqueId } from "@dnd-kit/utilities";
import { TextEdition } from "../edition/TextEdition";
import { EditableBlock } from "./EditableBlock";
import { CheckboxEdition } from "../edition/CheckboxEdition";
import {SelectOptionEdition} from "../edition/SelectOptionEdition";

function Select({ label, placeHolder, tooltip, multiple, checkCases, required, editItem, options }: any) {
    const id = useUniqueId('select-');

    return (
        <>
            <EditableBlock editionItems={[
                <TextEdition label={"Label"} value={label} editItem={(val: string) => editItem('label', val)} key={1}/>,
                <TextEdition label={"PlaceHolder"} value={placeHolder} editItem={(val: string) => editItem('placeHolder', val)} key={2} />,
                <TextEdition label={"Info bulle"} value={tooltip} editItem={(val: string) => editItem('tooltip', val)} key={3} />,
                <CheckboxEdition label={"Requis"} checked={required} editItem={(val: boolean) => editItem('required', val)} key={4} />,
                <CheckboxEdition label={"Multiple"} checked={multiple} editItem={(val: boolean) => editItem('multiple', val)} key={5} />,
                <CheckboxEdition label={"Cases à cocher"} checked={checkCases} editItem={(val: boolean) => editItem('checkCases', val)} key={6} />,
                <SelectOptionEdition label={"Options"} options={options} editItem={(val: boolean) => editItem('options', val)} key={7} />
            ]}>
                <label htmlFor={id}>{label}</label>
                {checkCases ? options.map((o: any, i: number) => <div key={i}><input type="radio"
                                                                        name={id}
                                                                        value={o.value} />
                        <label htmlFor="huey">{o.label}</label>
                    </div>)
                    :
                    <select
                        id={id}
                        placeholder={placeHolder}
                        multiple={multiple}
                        required={required}>
                        {options.map((o: any, i: number) => <option value={o.value} key={i}>{o.label}</option>)}
                    </select>}
            </EditableBlock>
        </>
    )
}

export default Select;
