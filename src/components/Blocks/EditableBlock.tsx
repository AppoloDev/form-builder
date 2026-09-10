import React, { ReactElement, ReactNode, useState, MouseEvent, useCallback, useContext, useEffect, createContext } from "react";
import { Tooltip } from "../Tooltip";
import { UniqueIdentifier } from "@dnd-kit/core";
import { ContextMenu, ContextMenuItem } from "../ContextMenu";
import { useBlockOperations } from "../../hooks/useBlockOperations";
import { DragHandleContext } from "../../FormBuilder";
import { Button } from "@/src/components/ui/button";
import { GripVertical, SquarePen, Trash } from "lucide-react";
import { BlockType, blockDefinitions } from "./Definition";

interface EditableBlockProps {
    id: UniqueIdentifier;
    type?: BlockType;
    editionItems?: ReactElement | ReactElement[];
    children: ReactNode;
    onDelete?: () => void;
    className?: string;
    preview?: boolean;
    isChildBlock?: boolean;
}

const DescendantHoverContext = createContext<(delta: 1 | -1) => void>(() => {
});

export const EditableBlock = (
    {
        id,
        type,
        editionItems = [],
        children,
        onDelete,
        className = "",
        preview = false,
        isChildBlock = false,
    }: EditableBlockProps) => {
    const typeLabel = type ? blockDefinitions[type]?.title : undefined;
    const [contextMenuVisible, setContextMenuVisible] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const [isContentHovered, setIsContentHovered] = useState(false);
    const [activeDescendants, setActiveDescendants] = useState(0);

    const notifyParent = useContext(DescendantHoverContext);
    const isActive = isContentHovered || activeDescendants > 0;

    useEffect(() => {
        if (!isActive) return;
        notifyParent(1);
        return () => notifyParent(-1);
    }, [isActive, notifyParent]);

    const reportDescendantHover = useCallback((delta: 1 | -1) => {
        setActiveDescendants((count) => count + delta);
    }, []);

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

    const showControls = isHovered && activeDescendants === 0;

    return (
        <div
            className={`relative ${className}`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className="absolute top-0 right-full h-full w-24" aria-hidden="true"/>

            <div
                className={`absolute right-full z-10 flex items-center gap-0.5 p-0.5 transition-opacity ${
                    isChildBlock ? "top-8 mr-7" : "top-0 mr-2"
                } ${
                    showControls ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
                }`}
            >
                {items.length > 0 && (
                    <Tooltip content="Paramètres">
                        <Button
                            variant="ghost"
                            size="icon-sm"
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
                        size="icon-sm"
                        className="text-destructive"
                        onClick={handleDelete}
                        aria-label="Supprimer le bloc"
                    >
                        <Trash />
                    </Button>
                </Tooltip>

                <Tooltip content="Déplacer le bloc">
                    <Button
                        variant="ghost"
                        size="icon-sm"
                        ref={setActivatorNodeRef}
                        {...(attributes || {})}
                        {...(listeners || {})}
                        className="cursor-grab active:cursor-grabbing"
                    >
                        <GripVertical />
                    </Button>
                </Tooltip>
            </div>

            <div
                onMouseEnter={() => setIsContentHovered(true)}
                onMouseLeave={() => setIsContentHovered(false)}
            >
                <DescendantHoverContext.Provider value={reportDescendantHover}>
                    {children}
                </DescendantHoverContext.Provider>
            </div>

            {items.length > 0 && (
                <ContextMenu
                    visible={contextMenuVisible}
                    onClose={handleCloseContextMenu}
                    title={typeLabel ? `Configuration du champ — ${typeLabel}` : undefined}
                >
                    {items.map((item, index) => (
                        <ContextMenuItem key={item.key || index}>{item}</ContextMenuItem>
                    ))}
                </ContextMenu>
            )}
        </div>
    );
};
