import React, {FC, useRef, useState} from "react";
import { EditionModal } from "../edition/EditionModal";

export const EditableBlock: FC<{ editionItems: JSX.Element|JSX.Element[], children: JSX.Element|JSX.Element[] }> = ({ editionItems, children }: any) => {
    const [visible, setVisible] = useState(false);
    const modalRef = useRef<HTMLDivElement>(null);

    const closeModal = () => setVisible(false);

    return (
        <div onClick={e => {
            const target = e.target as HTMLElement;
            if(!modalRef.current?.contains(target) && !isFormField(target.tagName)) setVisible(!visible)
        }}>
            <div ref={modalRef}>
                <EditionModal visible={visible} closeModal={closeModal}>
                    {editionItems}
                </EditionModal>
            </div>
            {children}
        </div>
    )
}

const isFormField = (tagName: string) => {
    return ['INPUT', 'SELECT', 'OPTION', 'TEXTAREA'].includes(tagName);
}
