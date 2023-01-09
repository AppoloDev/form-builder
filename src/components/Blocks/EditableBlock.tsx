import React, { FC, useRef, useState } from "react";
import { EditionModal } from "../Edition/EditionModal";
import { EditableBlockProps } from "./Types";
import { EditIcon } from "../Icons/EditIcon";
import { TrashIcon } from "../Icons/TrashIcon";
import Tippy from "@tippyjs/react";

export const EditableBlock: FC<EditableBlockProps> = ({editionItems, children, className = 'stack', removeItem}) => {
    const [visible, setVisible] = useState(false);
    const modalRef = useRef<HTMLDivElement>(null);

    const closeModal = () => setVisible(false);

    return (
        <div className={`${className}`}>
            <div className="actions-control">
                <div
                    className="actions-control__item"
                    onClick={() => setVisible(!visible)}>
                    <Tippy content="Éditer les paramètres du champs">
                        <EditIcon/>
                    </Tippy>
                </div>

                <div
                    onClick={() => removeItem()}
                    className="actions-control__item">
                    <Tippy content="Supprimer le champs">
                        <TrashIcon/>
                    </Tippy>
                </div>
            </div>

            <div className="modal-container" ref={modalRef}>
                <EditionModal visible={visible} closeModal={closeModal}>
                    {editionItems}
                </EditionModal>
            </div>

            <div className="form-content">
                {children}
            </div>
        </div>
    )
}
