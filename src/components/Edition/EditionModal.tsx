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
                            <div className="alert alert-info">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Asperiores assumenda at autem debitis eius excepturi expedita facilis.</div>
                            {children}
                        </div>

                        <div className="modal-footer">
                            <button onClick={closeModal}>Fermer</button>
                        </div>
                    </div>
                </div>
            </div>) : null;
    }
