import React from "react";
import { TextEdition } from "../Edition/TextEdition";
import { EditableBlock } from "./EditableBlock";
import { CheckboxEdition } from "../Edition/CheckboxEdition";
import { SelectOptionEdition } from "../Edition/SelectOptionEdition";
import { IdGenerator } from "../../utilities/String";

function Select({label, placeHolder, tooltip, multiple, checkCases, required, editItem, options}: any) {
    const id = IdGenerator();

    return (
        <EditableBlock editionItems={[
            <TextEdition label={"Label"} value={label} editItem={(val: string) => editItem('label', val)} key={1}/>,
            <TextEdition label={"PlaceHolder"} value={placeHolder}
                         editItem={(val: string) => editItem('placeHolder', val)} key={2}/>,
            <TextEdition label={"Info bulle"} value={tooltip} editItem={(val: string) => editItem('tooltip', val)}
                         key={3}/>,
            <CheckboxEdition label={"Requis"} checked={required} editItem={(val: boolean) => editItem('required', val)}
                             key={4}/>,
            <CheckboxEdition label={"Choix multiple"} checked={multiple}
                             editItem={(val: boolean) => editItem('multiple', val)} key={5}/>,
            <CheckboxEdition label={"Cases à cocher"} checked={checkCases}
                             editItem={(val: boolean) => editItem('checkCases', val)} key={6}/>,
            <SelectOptionEdition label={"Options"} options={options}
                                 editItem={(val: boolean) => editItem('options', val)} key={7}/>
        ]}>
            <label htmlFor={id}>{label}</label>
            {checkCases ? options.map((o: any, i: number) => {
                    const radioID = IdGenerator();
                    return o.label ? (
                        <div className="stack checkbox" key={i}>
                            <input type={multiple ? 'checkbox' : 'radio'}
                                   id={radioID}
                                   name={id}
                                   value={o.value}/>
                            <label htmlFor={radioID}>{o.label}</label>
                        </div>) : null
                }) :
                <select
                    id={id}
                    placeholder={placeHolder}
                    multiple={multiple}
                    required={required}>
                    {options.map((o: any, i: number) => o.label ?
                        <option value={o.value} key={i}>{o.label}</option> : null)}
                </select>}
        </EditableBlock>
    )
}

export default Select;
