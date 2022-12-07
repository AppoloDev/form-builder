import React, { FC, useEffect } from "react";
import { TextEdition } from "../Edition/TextEdition";
import { EditableBlock } from "./EditableBlock";
import { CheckboxEdition } from "../Edition/CheckboxEdition";
import { IdGenerator } from "../../utilities/String";
import { TextAreaProps } from "./Types";
import { WarningCircledIcon } from "../Icons/WarningCircledIcon";
import { NumberEdition } from "../Edition/NumberEdition";
import { TextAreaEdition } from "../Edition/TextAreaEdition";

const TextAreaInput: FC<TextAreaProps> = ({label = '', placeHolder = '', helpText = '', required = false, defaultValue = '', readOnly = false, rows = 5, editItem, removeItem}) => {
    const idInput = `textarea_${IdGenerator()}`;

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

                <TextAreaEdition
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

                <NumberEdition
                    label={'Nombre de lignes'}
                    value={rows}
                    editItem={(val) => editItem('rows', val)}
                    key={7}
                />
            ]}>
            <label htmlFor={idInput}>
                {label}
                {required && <span className="required">Requis</span>}
            </label>

            <textarea
                id={idInput}
                placeholder={placeHolder}
                rows={rows}
                defaultValue={defaultValue}
                required={required}
                disabled={readOnly}
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

export default TextAreaInput;
