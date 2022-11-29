import React, { FC } from "react";
import { TextEdition } from "../Edition/TextEdition";
import { EditableBlock } from "./EditableBlock";
import { CheckboxEdition } from "../Edition/CheckboxEdition";
import { NumberEdition } from "../Edition/NumberEdition";
import { IdGenerator } from "../../utilities/String";
import { FileInputProps } from "./Types";
import { WarningCircledIcon } from "../Icons/WarningCircledIcon";
import { SelectOptionEdition } from "../Edition/SelectOptionEdition";
import { SelectEdition } from "../Edition/SelectEdition";

const FileInput: FC<FileInputProps> = ({
                                           label,
                                           helpText,
                                           maxItems,
                                           required,
                                           value,
                                           acceptedFile = [],
                                           editItem,
                                           removeItem
                                       }: FileInputProps) => {
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

                <TextEdition
                    label={"Texte d'aide"}
                    value={helpText}
                    editItem={(val) => editItem('helpText', val)}
                    key={2}
                />,

                <SelectEdition
                    label={"Fichiers acceptés"}
                    value={value}
                    options={[
                        ...acceptedFile,
                        {value: 'images/*', label: 'Fichiers images'},
                        {value: 'application/pdf', label: 'Fichier PDF'}
                    ]}
                    editItem={(val) => {
                        editItem('value', val)
                    }}
                    key={3}
                />,

                <CheckboxEdition
                    label={"Requis"}
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
                   multiple={maxItems > 1}
                   id={id}
                   accept={"image/*,application/pdf"}
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

export default FileInput;
