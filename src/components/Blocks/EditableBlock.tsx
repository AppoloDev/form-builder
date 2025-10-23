import React, { ReactElement, ReactNode, useState, MouseEvent, useCallback } from "react";
import { EditIcon } from "../Icons/EditIcon";
import { TrashIcon } from "../Icons/TrashIcon";
import { Tooltip } from "../Tooltip";
import { UniqueIdentifier } from "@dnd-kit/core";
import { ContextMenu, ContextMenuItem } from "../ContextMenu";
import { useBlockOperations } from "../../hooks/useBlockOperations";

interface EditableBlockProps {
    id: UniqueIdentifier;
    editionItems?: ReactElement | ReactElement[];
    children: ReactNode;
    onDelete?: () => void;
    className?: string;
}

export const EditableBlock = ({
                                  id,
                                  editionItems = [],
                                  children,
                                  onDelete,
                                  className = "",
                              }: EditableBlockProps) => {
    const [contextMenuVisible, setContextMenuVisible] = useState(false);
    const [contextMenuPosition, setContextMenuPosition] = useState({x: 0, y: 0});

    const {handleRemove} = useBlockOperations(id);

    const handleOpenContextMenu = useCallback((e: MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        setContextMenuPosition({
            x: e.clientX,
            y: e.clientY,
        });
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

    return (
        <>
            <div className={`relative group ${className}`}>
                {items.length > 0 && <Tooltip content="Paramètres">
                    <button
                        type="button"
                        className="actions-control__item"
                        onClick={handleOpenContextMenu}
                        aria-label="Ouvrir les paramètres"
                    >
                        <EditIcon/>
                    </button>
                </Tooltip>}

                <Tooltip content="Supprimer">
                    <button
                        type="button"
                        className="actions-control__item"
                        onClick={handleDelete}
                        aria-label="Supprimer le bloc"
                    >
                        <TrashIcon/>
                    </button>
                </Tooltip>
            </div>

            <div className="form-content">
                {children}
            </div>

            {items.length > 0 && <ContextMenu
                visible={contextMenuVisible}
                x={contextMenuPosition.x}
                y={contextMenuPosition.y}
                onClose={handleCloseContextMenu}
            >
                {items.map((item, index) => (
                    <ContextMenuItem key={item.key || index}>
                        {item}
                    </ContextMenuItem>
                ))}
            </ContextMenu>}
        </>
    );
};
