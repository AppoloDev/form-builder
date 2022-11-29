import React, { FC, useRef, useState } from "react";
import { EditionModal } from "../Edition/EditionModal";
import { EditableBlockProps } from "./Types";
import { EditIcon } from "../Icons/EditIcon";
import { TrashIcon } from "../Icons/TrashIcon";
import { DragIcon } from "../Icons/DragIcon";

export const EditableBlock: FC<EditableBlockProps> = ({editionItems, children, removeItem}) => {
    const [visible, setVisible] = useState(false);
    const modalRef = useRef<HTMLDivElement>(null);

    const closeModal = () => setVisible(false);

    return (
        <div className="stack">
            <div className="actions-control">
                <div
                    className="actions-control__item drag">
                    <DragIcon/>
                </div>

                <div
                    className="actions-control__item"
                    onClick={() => setVisible(!visible)}>
                    <EditIcon/>
                </div>

                <div
                    onClick={() => removeItem()}
                    className="actions-control__item">
                    <TrashIcon/>
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
