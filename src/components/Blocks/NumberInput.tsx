import React, { FC } from "react";
import { TextEdition } from "../Edition/TextEdition";
import { EditableBlock } from "./EditableBlock";
import { CheckboxEdition } from "../Edition/CheckboxEdition";
import { IdGenerator } from "../../utilities/String";
import { NumberInputProps } from "./Types";
import { WarningCircledIcon } from "../Icons/WarningCircledIcon";
import { NumberEdition } from "../Edition/NumberEdition";

const NumberInput: FC<NumberInputProps> = ({label = '', helpText = '', defaultValue = '', readOnly = false, required = false, allowDecimal = true, editItem, removeItem}) => {
    const id = IdGenerator();

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

            <NumberEdition
                label={"Valeur par défaut"}
                value={defaultValue}
                editItem={(val) => editItem('defaultValue', val)}
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
                label={"Autoriser les décimales ?"}
                checked={allowDecimal}
                editItem={(val) => editItem('allowDecimal', val)}
                key={5}
            />,

            <CheckboxEdition
                label={"Lecture seule"}
                checked={readOnly}
                editItem={(val) => editItem('readOnly', val)}
                key={6}
            />,
        ]}>
            <label htmlFor={id}>
                {label}
                {required && <span className="required">Requis</span>}
            </label>

            <input type="number"
                   id={id}
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

export default NumberInput;
