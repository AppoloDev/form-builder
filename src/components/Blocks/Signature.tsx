import React, { FC, useEffect } from "react";
import { TextEdition } from "../Edition/TextEdition";
import { EditableBlock } from "./EditableBlock";
import { CheckboxEdition } from "../Edition/CheckboxEdition";
import { IdGenerator } from "../../utilities/String";
import { SignatureProps } from "./Types";
import { WarningCircledIcon } from "../Icons/WarningCircledIcon";

const Signature: FC<SignatureProps> = ({id = '', label = '', helpText = '', required = false, editItem, removeItem}) => {
    useEffect(() => {
        if (id === '') {
            editItem('id', `signature_${IdGenerator()}`);
        }
    }, [])

    return (
        <EditableBlock
            removeItem={removeItem}
            editionItems={[
            <TextEdition label={"Label"} value={label} editItem={(val) => editItem('label', val)} key={1}/>,
            <TextEdition label={"Texte d'aide"} value={helpText} editItem={(val) => editItem('helpText', val)}
                         key={3}/>,
            <CheckboxEdition label={"Requis"} checked={required} editItem={(val) => editItem('required', val)}
                             key={5}/>
        ]}>
            <label htmlFor={id}>
                {label}
                {required && <span className="required">Requis</span>}
            </label>
            <div className={"sign-area"}>
                Zone de signature
            </div>

            <>
                {helpText && <div className="help-text">
                    <WarningCircledIcon />
                    {helpText}
                </div>}
            </>
        </EditableBlock>
    )
}

export default Signature;
