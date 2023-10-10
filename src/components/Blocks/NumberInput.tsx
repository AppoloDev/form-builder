import React, { FC, useEffect } from "react";
import { TextEdition } from "../Edition/TextEdition";
import { EditableBlock } from "./EditableBlock";
import { CheckboxEdition } from "../Edition/CheckboxEdition";
import { IdGenerator } from "../../utilities/String";
import { NumberInputProps } from "./Types";
import { WarningCircledIcon } from "../Icons/WarningCircledIcon";
import { NumberEdition } from "../Edition/NumberEdition";

const NumberInput: FC<NumberInputProps> = ({id= '', label = '', helpText = '', defaultValue = '', readOnly = false, required = false, allowDecimal = false, editItem, removeItem}) => {
    useEffect(() => {
        if (id === '') {
            editItem('id', `number_${IdGenerator()}`);
        }
    }, [id])

    return (
        <EditableBlock
            removeItem={removeItem}
            editionItems={[
            <TextEdition
                label={"Libellé"}
                value={label}
                editItem={(val) => editItem('label', val)}
                key={1}
            />,

            <NumberEdition
                label={"Valeur par défaut"}
                value={defaultValue}
                helpText={"Saisie une valeur par défaut que l'utilisateur pourra remplacer."}
                editItem={(val) => editItem('defaultValue', val)}
                key={2}
            />,

            <TextEdition
                label={"Texte d'aide"}
                value={helpText}
                helpText={"Affiche un texte sous le champ, permettant d'aider et d'orienter l'utilisateur."}
                editItem={(val) => editItem('helpText', val)}
                key={3}
            />,

            <CheckboxEdition
                label={"Requis"}
                helpText={"Permet de déterminer si ce champ est requis, ainsi rentre la saisie obligatoire."}
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
                helpText={"Permet de déterminer si ce champ est seulement visible, mais non modifiable."}
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
