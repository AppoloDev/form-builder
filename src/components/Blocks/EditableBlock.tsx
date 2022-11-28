import React, { FC, useRef, useState } from "react";
import { EditionModal } from "../Edition/EditionModal";
import { EditableBlockProps } from "./Types";

export const EditableBlock: FC<EditableBlockProps> = ({editionItems, children}) => {
    const [visible, setVisible] = useState(false);
    const modalRef = useRef<HTMLDivElement>(null);

    const closeModal = () => setVisible(false);

    return (
        <div
            className="stack"
            onClick={e => {
                const target = e.target as HTMLElement;
                if (!modalRef.current?.contains(target) && !isFormField(target.tagName)) setVisible(!visible)
            }}
        >
            <div className="modal-container" ref={modalRef}>
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
