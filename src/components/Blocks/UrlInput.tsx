import React, { FC, useEffect } from "react";
import { TextEdition } from "../Edition/TextEdition";
import { EditableBlock } from "./EditableBlock";
import { CheckboxEdition } from "../Edition/CheckboxEdition";
import { IdGenerator } from "../../utilities/String";
import { UrlInputProps } from "./Types";
import { WarningCircledIcon } from "../Icons/WarningCircledIcon";

const UrlInput: FC<UrlInputProps> = ({label = '', placeHolder = '', helpText = '', defaultValue = '', readOnly = false, required = false, editItem, removeItem}) => {
    const idInput = `url_${IdGenerator()}`;

    useEffect(() => {
        editItem('id', idInput);
    }, [])

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
                label={"Texte par défaut"}
                value={defaultValue}
                editItem={(val) => editItem('defaultValue', val)}
                key={3}
            />,

            <TextEdition
                label={"Texte d'aide"}
                value={helpText}
                editItem={(val) => editItem('helpText', val)}
                key={4}
            />,

            <CheckboxEdition
                label={"Requis"}
                checked={required}
                editItem={(val) => editItem('required', val)}
                key={5}
            />,

            <CheckboxEdition
                label={"Lecture seule"}
                checked={readOnly}
                editItem={(val) => editItem('readOnly', val)}
                key={6}
            />,
        ]}>
            <label htmlFor={idInput}>
                {label}
                {required && <span className="required">Requis</span>}
            </label>

            <input type="url"
                   id={idInput}
                   placeholder={placeHolder}
                   disabled={readOnly}
                   defaultValue={defaultValue}
                   required={required}
            />

            <>
                {helpText && <div className="help-text">
                    <WarningCircledIcon/>
                    {helpText}
                </div>}
            </>
        </EditableBlock>
    )
}

export default UrlInput;
