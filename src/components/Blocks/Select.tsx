import React, { FC, useEffect, useState } from "react";
import { TextEdition } from "../Edition/TextEdition";
import { EditableBlock } from "./EditableBlock";
import { CheckboxEdition } from "../Edition/CheckboxEdition";
import { SelectOptionEdition } from "../Edition/SelectOptionEdition";
import { IdGenerator } from "../../utilities/String";
import { SelectProps } from "./Types";
import { WarningCircledIcon } from "../Icons/WarningCircledIcon";

const Select: FC<SelectProps> = ({id = '', label = '', placeHolder = '', helpText = '', multiple = false, customOption = false, checkCases = false, required = false,options , editItem, removeItem}) => {
    const [enabledCustomOption, enableCustomOption] = useState<boolean>(false)

    useEffect(() => {
        if (id === '') {
            editItem('id', `select_${IdGenerator()}`);
        }
    }, [])

    useEffect(() => {
        if (checkCases) {
            enableCustomOption(false);
            editItem('customOption', false);
        } else {
            enableCustomOption(true);
        }
    }, [checkCases])

    const defaultValue = options.filter((el) => el.isSelected).map((el) => el.label);

    return (
        <EditableBlock
            removeItem={removeItem}
            editionItems={[
                <TextEdition
                    label={"Label"}
                    value={label}
                    editItem={(val) => editItem('label', val)}
                    key={1}
                />,

                <TextEdition
                    label={"PlaceHolder"}
                    value={placeHolder}
                    editItem={(val) => editItem('placeHolder', val)}
                    key={2}
                />,

                <TextEdition
                    label={"Texte d'aide"}
                    value={helpText}
                    editItem={(val) => editItem('helpText', val)}
                    key={3}
                />,

                <CheckboxEdition
                    label={"Requis"}
                    checked={required}
                    editItem={(val) => editItem('required', val)}
                    key={4}
                />,

                <CheckboxEdition
                    label={"Choix multiple"}
                    checked={multiple}
                    editItem={(val) => editItem('multiple', val)}
                    key={5}
                />,

                <CheckboxEdition
                    label={"Cases à cocher"}
                    checked={checkCases}
                    editItem={(val) => editItem('checkCases', val)}
                    key={6}
                />,

                <CheckboxEdition
                    label={"Autoriser l'ajout d'une option personnalisée"}
                    disabled={!enabledCustomOption}
                    checked={customOption}
                    editItem={(val) => editItem('customOption', val)}
                    key={7}
                />,

                <SelectOptionEdition
                    label={"Options"}
                    multiple={multiple}
                    options={options}
                    editItem={(val) => editItem('options', val)}
                    key={8}
                />
            ]}>
            <label htmlFor={id}>
                {label}
                {required && <span className="required">Requis</span>}
            </label>
            <>
                {checkCases ?
                    (options.map((option, i) => {
                        const radioID = IdGenerator();
                        return option.label ? (
                            <div className="stack checkbox" key={i}>
                                <input type={multiple ? 'checkbox' : 'radio'}
                                       id={radioID}
                                       name={id}
                                       defaultValue={option.label}
                                       checked={option.isSelected}
                                       onChange={() => {}}
                                />
                                <label htmlFor={radioID}>{option.label}</label>
                            </div>) : null
                    })) :
                    (<select
                        id={id}
                        placeholder={placeHolder}
                        value={multiple ? defaultValue : defaultValue[0]}
                        onChange={() => {}}
                        multiple={multiple}
                        required={required}>
                        {options.map((option, i) => option.label ?
                            <option
                                value={option.label}
                                key={i}
                            >
                                {option.label}
                            </option> : null)
                        }
                    </select>)
                }
            </>

            <>
                {helpText && <div className="help-text">
                    <WarningCircledIcon/>
                    {helpText}
                </div>}
            </>
        </EditableBlock>
    )
}

export default Select;
