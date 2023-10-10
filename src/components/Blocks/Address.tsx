import React, { FC, useEffect } from "react";
import { TextEdition } from "../Edition/TextEdition";
import { EditableBlock } from "./EditableBlock";
import { CheckboxEdition } from "../Edition/CheckboxEdition";
import { IdGenerator } from "../../utilities/String";
import { AddressProps } from "./Types";
import { WarningCircledIcon } from "../Icons/WarningCircledIcon";

const Address: FC<AddressProps> = ({id= '', label = '', helpText = '', required = false, editItem, removeItem}) => {
    useEffect(() => {
        if (id === '') {
            editItem('id', `address_${IdGenerator()}`);
        }
    }, []);

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
                    helpText={"Affiche un texte sous le champ, permettant d'aider et d'orienter l'utilisateur."}
                    value={helpText} editItem={(val) => editItem('helpText', val)}
                    key={2}
                />,

                <CheckboxEdition
                    label={"Requis"}
                    helpText={"Permet de déterminer si ce champ est requis, ainsi rentre la saisie obligatoire."}
                    checked={required}
                    editItem={(val) => editItem('required', val)}
                    key={3}
                />
            ]}>
            <label htmlFor={id}>
                {label}
                {required && <span className="required">Requis</span>}
            </label>

            <input type="text"
                   id={id}
                   placeholder={'Indiquez un lieu…'}
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

export default Address;
