import React, { ReactElement, ReactNode, useState, MouseEvent, useCallback, useContext } from "react";
import { EditIcon } from "../Icons/EditIcon";
import { TrashIcon } from "../Icons/TrashIcon";
import { Tooltip } from "../Tooltip";
import { UniqueIdentifier } from "@dnd-kit/core";
import { ContextMenu, ContextMenuItem } from "../ContextMenu";
import { useBlockOperations } from "../../hooks/useBlockOperations";
import { BlockDefinition } from "./Definition";
import { DragHandleContext } from "../../FormBuilder";
import { DotsIcon } from "../Icons/DotsIcon";

interface EditableBlockProps {
    id: UniqueIdentifier;
    editionItems?: ReactElement | ReactElement[];
    children: ReactNode;
    onDelete?: () => void;
    className?: string;
}

export const EditableBlock = (
    {
        id,
        editionItems = [],
        children,
        onDelete,
        className = "",
    }: EditableBlockProps) => {
    const [contextMenuVisible, setContextMenuVisible] = useState(false);

    const {handleRemove} = useBlockOperations(id);

    const handleOpenContextMenu = useCallback((e: MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        setContextMenuVisible(true);
    }, []);

    const handleCloseContextMenu = useCallback(() => {
        setContextMenuVisible(false);
    }, []);

    const handleDelete = useCallback(() => {
        onDelete?.();
        handleRemove();
        handleCloseContextMenu();
    }, [onDelete, handleRemove, handleCloseContextMenu]);

    const items = Array.isArray(editionItems) ? editionItems : [editionItems];

    const {attributes, listeners, setActivatorNodeRef} = useContext(DragHandleContext);

    return (
        <>
            <div className={`flex gap-2 ${className}`}>
                {items.length > 0 && (
                    <Tooltip content="Paramètres">
                        <button
                            type="button"
                            className="cursor-pointer"
                            onClick={handleOpenContextMenu}
                            aria-label="Ouvrir les paramètres"
                        >
                            <EditIcon size={20}/>
                        </button>
                    </Tooltip>
                )}

                <Tooltip content="Supprimer">
                    <button
                        type="button"
                        className="cursor-pointer"
                        onClick={handleDelete}
                        aria-label="Supprimer le bloc"
                    >
                        <TrashIcon size={20}/>
                    </button>
                </Tooltip>

                <Tooltip content="Déplacer le bloc">
                    <button
                        type="button"
                        ref={setActivatorNodeRef}
                        {...(attributes || {})}
                        {...(listeners || {})}
                        className={`cursor-grab active:cursor-grabbing`}
                    >
                        <DotsIcon size={20}/>
                    </button>
                </Tooltip>
            </div>

            {children}

            {items.length > 0 && (
                <ContextMenu
                    visible={contextMenuVisible}
                    onClose={handleCloseContextMenu}
                >
                    {items.map((item, index) => (
                        <ContextMenuItem key={item.key || index}>{item}</ContextMenuItem>
                    ))}
                </ContextMenu>
            )}
        </>
    );
};
