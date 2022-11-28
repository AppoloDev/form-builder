import React, { FC } from "react";
import { TextEdition } from "../Edition/TextEdition";
import { EditableBlock } from "./EditableBlock";
import { CheckboxEdition } from "../Edition/CheckboxEdition";
import { SelectOptionEdition } from "../Edition/SelectOptionEdition";
import { IdGenerator } from "../../utilities/String";
import { SelectProps } from "./Types";
import { WarningCircledIcon } from "../Icons/WarningCircledIcon";

const Select: FC<SelectProps> = ({label, placeHolder, helpText, multiple, checkCases, required, editItem, options}) => {
    const id = IdGenerator();

    return (
        <EditableBlock editionItems={[
            <TextEdition label={"Label"} value={label} editItem={(val) => editItem('label', val)} key={1}/>,
            <TextEdition label={"PlaceHolder"} value={placeHolder}
                         editItem={(val) => editItem('placeHolder', val)} key={2}/>,
            <TextEdition label={"Texte d'aide"} value={helpText} editItem={(val) => editItem('helpText', val)}
                         key={3}/>,
            <CheckboxEdition label={"Requis"} checked={required} editItem={(val) => editItem('required', val)}
                             key={4}/>,
            <CheckboxEdition label={"Choix multiple"} checked={multiple}
                             editItem={(val) => editItem('multiple', val)} key={5}/>,
            <CheckboxEdition label={"Cases à cocher"} checked={checkCases}
                             editItem={(val) => editItem('checkCases', val)} key={6}/>,
            <SelectOptionEdition label={"Options"} options={options}
                                 editItem={(val) => editItem('options', val)} key={7}/>
        ]}>
            <label htmlFor={id}>{label}</label>
            <>
                {checkCases ?
                    (options.map((o, i) => {
                        const radioID = IdGenerator();
                        return o.label ? (
                            <div className="stack checkbox" key={i}>
                                <input type={multiple ? 'checkbox' : 'radio'}
                                       id={radioID}
                                       name={id}
                                       value={o.value}/>
                                <label htmlFor={radioID}>{o.label}</label>
                            </div>) : null
                    })) :
                    (<select
                        id={id}
                        placeholder={placeHolder}
                        multiple={multiple}
                        required={required}>
                        {options.map((o, i) => o.label ?
                            <option value={o.value} key={i}>{o.label}</option> : null)}
                    </select>)
                }
            </>

            <>
                {helpText && <div className="help-text">
                    <WarningCircledIcon />
                    {helpText}
                </div>}
            </>
        </EditableBlock>
    )
}

export default Select;
