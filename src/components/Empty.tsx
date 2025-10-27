import { AddMenu } from "./AddMenu";
import React from "react";
import { BlockDefinition } from "./Blocks/Definition";

type Props = {
    onPick: (def: BlockDefinition) => void;
}

export const Empty = ({onPick}: Props) => {
    return (
        <div className="max-w-sm w-full flex flex-col justify-center mx-auto space-y-5 p-8">
            <div className="flex flex-col items-center gap-2">
                <div className="font-semibold text-gray-800 text-center">
                    Aucun bloc pour le moment !
                </div>

                <p className="text-sm text-gray-600 text-center">
                    Pour ajouter un nouveau bloc, veuillez cliquer sur le bouton ci-dessous.
                </p>
            </div>

            <div className="flex justify-center mt-5">
                <AddMenu
                    onPick={onPick}
                >
                    <button className="btn btn-size-default btn-color-appolo btn-mode-solid">
                        Ajouter un bloc
                    </button>
                </AddMenu>
            </div>
        </div>
    )
}
