import React, { FC, useEffect } from "react";
import { TextEdition } from "../Edition/TextEdition";
import { EditableBlock } from "./EditableBlock";
import { CheckboxEdition } from "../Edition/CheckboxEdition";
import { NumberEdition } from "../Edition/NumberEdition";
import { IdGenerator } from "../../utilities/String";
import { FileInputProps } from "./Types";
import { WarningCircledIcon } from "../Icons/WarningCircledIcon";
import { SelectEdition } from "../Edition/SelectEdition";

const FileInput: FC<FileInputProps> = ({id = '', label = '', helpText = '', maxItems = 1, required = false, acceptedFile = 'image', editItem, removeItem}) => {
    useEffect(() => {
        if (id === '') {
            editItem('id', `file_${IdGenerator()}`);
        }
    }, [])

    return (
        <EditableBlock
            removeItem={removeItem}
            editionItems={[
                <TextEdition
                    label={"Label"}
                    value={label}
                    helpText={"Permet de définir le nom du champ."}
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

                <SelectEdition
                    label={"Fichiers acceptés"}
                    value={acceptedFile}
                    options={[
                        {value: 'image', label: 'Fichiers images'},
                        {value: 'file', label: 'Fichier PDF'},
                        {value: 'both', label: 'Fichier images et PDF'}
                    ]}
                    editItem={(val) => editItem('acceptedFile', val)}
                    key={3}
                />,

                <CheckboxEdition
                    label={"Requis"}
                    helpText={"Permet de déterminer si ce champ est requis, ainsi rentre la saisie obligatoire."}
                    checked={required}
                    editItem={(val) => editItem('required', val)}
                    key={4}
                />,

                <NumberEdition
                    label={"Nombre maximal de fichiers"}
                    value={maxItems}
                    editItem={(val) => editItem('maxItems', val)}
                    key={5}
                />
            ]}>
            <label htmlFor={id}>
                {label}
                {required && <span className="required">Requis</span>}
            </label>

            <input type="file"
                   id={id}
                   required={required}
            />

            <>
                {helpText && <div className="help-text">
                    <WarningCircledIcon/>
                    {helpText}
                </div>}
            </>

            <>
                {maxItems > 1 && (<div className="add-more">Ajouter un fichier…</div>)}
            </>
        </EditableBlock>
    )
}

export default FileInput;
