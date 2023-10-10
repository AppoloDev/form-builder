import React, { FC, useEffect } from "react";
import { TextEdition } from "../Edition/TextEdition";
import { EditableBlock } from "./EditableBlock";
import { CheckboxEdition } from "../Edition/CheckboxEdition";
import { IdGenerator } from "../../utilities/String";
import { TextAreaProps } from "./Types";
import { WarningCircledIcon } from "../Icons/WarningCircledIcon";
import { NumberEdition } from "../Edition/NumberEdition";
import { TextAreaEdition } from "../Edition/TextAreaEdition";

const TextAreaInput: FC<TextAreaProps> = ({id = '', label = '', placeHolder = '', helpText = '', required = false, defaultValue = '', readOnly = false, rows = 5, editItem, removeItem}) => {
    useEffect(() => {
        if (id === '') {
            editItem('id', `textarea_${IdGenerator()}`);
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

                <TextEdition
                    label={"Placeholder"}
                    value={placeHolder}
                    helpText={"Affiche un texte dans le champ lorsqu'aucune valeur n'y est saisie."}
                    editItem={(val) => editItem('placeHolder', val)}
                    key={2}
                />,

                <TextAreaEdition
                    label={"Valeur par défaut"}
                    value={defaultValue}
                    helpText={"Saisie une valeur par défaut que l'utilisateur pourra remplacer."}
                    editItem={(val) => editItem('defaultValue', val)}
                    key={3}
                />,

                <TextEdition
                    label={"Texte d'aide"}
                    value={helpText}
                    helpText={"Affiche un texte sous le champ, permettant d'aider et d'orienter l'utilisateur."}
                    editItem={(val) => editItem('helpText', val)}
                    key={4}
                />,

                <CheckboxEdition
                    label={"Requis"}
                    helpText={"Permet de déterminer si ce champ est requis, ainsi rentre la saisie obligatoire."}
                    checked={required}
                    editItem={(val) => editItem('required', val)}
                    key={5}
                />,

                <CheckboxEdition
                    label={"Lecture seule"}
                    checked={readOnly}
                    helpText={"Permet de déterminer si ce champ est seulement visible, mais non modifiable."}
                    editItem={(val) => editItem('readOnly', val)}
                    key={6}
                />,

                <NumberEdition
                    label={'Nombre de lignes'}
                    value={rows}
                    helpText={"Permet de déterminer le nombre de ligne visible pour l'utilisateur."}
                    editItem={(val) => editItem('rows', val)}
                    key={7}
                />
            ]}>
            <label htmlFor={id}>
                {label}
                {required && <span className="required">Requis</span>}
            </label>

            <textarea
                id={id}
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
