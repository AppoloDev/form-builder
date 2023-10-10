import { EditionModalProps } from "./Types";
import { FC } from "react";

export const EditionModal: FC<EditionModalProps> = ({visible, closeModal, children}) => {
        return visible ?
            (<div className="modal show" role="dialog">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Modifier la configuration de ce champs</h5>
                        </div>

                        <div className="modal-body">
                            {children}
                        </div>

                        <div className="modal-footer">
                            <button onClick={closeModal}>Fermer</button>
                        </div>
                    </div>
                </div>
            </div>) : null;
    }
