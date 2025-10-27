import React, { ReactElement, ReactNode, useState, MouseEvent, useCallback } from "react";
import { EditIcon } from "../Icons/EditIcon";
import { TrashIcon } from "../Icons/TrashIcon";
import { Tooltip } from "../Tooltip";
import { UniqueIdentifier } from "@dnd-kit/core";
import { ContextMenu, ContextMenuItem } from "../ContextMenu";
import { useBlockOperations } from "../../hooks/useBlockOperations";
import { AddMenu } from "../AddMenu";
import { BlockDefinition } from "./Definition";
import { createBlockFromTemplate } from "../../utilities/block.utiles";
import { useFormBuilderStore } from "../../stores/block.store";
import { PlusIcon } from "../Icons/PlusIcon";

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
    const {addBlock} = useFormBuilderStore();
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

    const handleAddAt = (afterIndex: number, def: BlockDefinition) => {
        const newBlock = createBlockFromTemplate(def);
        addBlock(newBlock, afterIndex + 1);
    };

    const handleDelete = useCallback(() => {
        onDelete?.();
        handleRemove();
        handleCloseContextMenu();
    }, [onDelete, handleRemove, handleCloseContextMenu]);

    const items = Array.isArray(editionItems) ? editionItems : [editionItems];

    return (
        <>
            <div className={`flex flex-col gap-1.5 ${className}`}>
                {items.length > 0 && (
                    <Tooltip content="Paramètres">
                        <button
                            type="button"
                            className="cursor-pointer"
                            onClick={handleOpenContextMenu}
                            aria-label="Ouvrir les paramètres"
                        >
                            <EditIcon size={22}/>
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
                        <TrashIcon size={22}/>
                    </button>
                </Tooltip>

                <Tooltip content="Ajouter un bloc">
                    <AddMenu onPick={(def) => handleAddAt(id, def)}>
                        <PlusIcon size={22}/>
                    </AddMenu>
                </Tooltip>
            </div>

            {children}

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
