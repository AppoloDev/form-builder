import React, { FC, useEffect, useState } from "react";
import { TextEdition } from "../Edition/TextEdition";
import { EditableBlock } from "./EditableBlock";
import { CheckboxEdition } from "../Edition/CheckboxEdition";
import { IdGenerator } from "../../utilities/String";
import { DateTimeInputProps } from "./Types";
import { WarningCircledIcon } from "../Icons/WarningCircledIcon";

const DateTimeInput: FC<DateTimeInputProps> = ({id= '', label = '', helpText  = '', readOnly = false, required = false, showDate = false, showHour = false, hasCurrentDate = false, editItem, removeItem}) => {
    const [inputType, setInputType] = useState('datetime-local');

    useEffect(() => {
        if (id === '') {
            editItem('id', `datetime_${IdGenerator()}`);
        }
    }, []);

    useEffect(() => {
        if (showDate && !showHour) {
            setInputType('date');
        } else if (!showDate && showHour) {
            setInputType('time');
        } else {
            setInputType('datetime-local');
        }
    }, [showDate, showHour])

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
                    label={"Texte d'aide"}
                    value={helpText}
                    helpText={"Affiche un texte sous le champ, permettant d'aider et d'orienter l'utilisateur."}
                    editItem={(val) => editItem('helpText', val)}
                    key={2}
                />,

                <CheckboxEdition
                    label={"Afficher la date ?"}
                    checked={showDate}
                    editItem={(val) => editItem('showDate', val)}
                    key={3}
                />,

                <CheckboxEdition
                    label={"Afficher l'heure ?"}
                    checked={showHour}
                    editItem={(val) => editItem('showHour', val)}
                    key={4}
                />,

                <CheckboxEdition
                    label={"Afficher l'heure ou la date courante ?"}
                    checked={hasCurrentDate}
                    editItem={(val) => editItem('hasCurrentDate', val)}
                    key={5}
                />,

                <CheckboxEdition
                    label={"Requis"}
                    helpText={"Permet de déterminer si ce champ est requis, ainsi rentre la saisie obligatoire."}
                    checked={required}
                    editItem={(val) => editItem('required', val)}
                    key={6}
                />,

                <CheckboxEdition
                    label={"Lecture seule"}
                    checked={readOnly}
                    helpText={"Permet de déterminer si ce champ est seulement visible, mais non modifiable."}
                    editItem={(val) => editItem('readOnly', val)}
                    key={7}
                />,
            ]}
        >
            <label htmlFor={id}>
                {label}
                {required && <span className="required">Requis</span>}
            </label>

            <input type={inputType}
                   id={id}
                   disabled={readOnly}
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

export default DateTimeInput;
