import { FC } from "react";

export const EditionModal: FC<{ visible: boolean, children: JSX.Element|JSX.Element[], closeModal: () => void }> = ({ visible, closeModal, children }) => {
    return visible ? <div className={"modal"}>
        <div className="modal-content">
            {children}
            <button onClick={closeModal}>Fermer</button>
        </div>
    </div> : null;
}
