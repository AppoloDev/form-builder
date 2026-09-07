import React, { ReactElement, ReactNode, useState, MouseEvent, useCallback, useContext } from "react";
import { Tooltip } from "../Tooltip";
import { UniqueIdentifier } from "@dnd-kit/core";
import { ContextMenu, ContextMenuItem } from "../ContextMenu";
import { useBlockOperations } from "../../hooks/useBlockOperations";
import { DragHandleContext } from "../../FormBuilder";
import { Button } from "@/src/components/ui/button";
import { GripVertical, SquarePen, Trash } from "lucide-react";

interface EditableBlockProps {
    id: UniqueIdentifier;
    editionItems?: ReactElement | ReactElement[];
    children: ReactNode;
    onDelete?: () => void;
    className?: string;
    preview?: boolean;
}

export const EditableBlock = (
    {
        id,
        editionItems = [],
        children,
        onDelete,
        className = "",
        preview = false,
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

    if (preview) {
        return <>{children}</>;
    }

    return (
        <>
            <div className={`flex ${className}`}>
                {items.length > 0 && (
                    <Tooltip content="Paramètres">
                        <Button
                            variant="ghost"
                            size="icon-lg"
                            onClick={handleOpenContextMenu}
                            aria-label="Ouvrir les paramètres"
                        >
                            <SquarePen />
                        </Button>
                    </Tooltip>
                )}

                <Tooltip content="Supprimer">
                    <Button
                        variant="ghost"
                        size="icon-lg"
                        onClick={handleDelete}
                        aria-label="Supprimer le bloc"
                    >
                        <Trash />
                    </Button>
                </Tooltip>

                <Tooltip content="Déplacer le bloc">
                    <Button
                        variant="ghost"
                        size="icon-lg"
                        ref={setActivatorNodeRef}
                        {...(attributes || {})}
                        {...(listeners || {})}
                        className={`cursor-grab active:cursor-grabbing`}
                    >
                        <GripVertical />
                    </Button>
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
