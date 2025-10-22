import { useCallback, useMemo } from "react";
import { Block, getAllBlockDefinitions } from "./components/Blocks/Definition";
import { useFormBuilderStore } from "./stores/block.store";
import {
    DndContext,
    DragEndEvent,
    DragOverEvent, DragOverlay,
    DragStartEvent,
    PointerSensor,
    useSensor,
    useSensors
} from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { DraggableItem } from "./components/Sortable/DraggableItem";
import { EmptyDropZone } from "./components/Sortable/EmptyDropZone";
import React from "react";
import { SortableItem } from "./components/Sortable/SortableItem";
import { createBlockFromTemplate, isValidDropTarget } from "./utilities/block.utiles";
import { DropEndZone } from "./components/Sortable/DropEndZone";

const WORK_CONTAINER_ID = "work-container";
const DROP_END_ZONE_ID = "drop-end-zone";

export const FormBuilder = () => {
    const SIDEBAR_ITEMS = useMemo(() => getAllBlockDefinitions(), []);

    const {
        blocks,
        activeId,
        overId,
        setActiveId,
        setOverId,
        addBlock,
        moveBlock,
        moveBlockToEnd,
    } = useFormBuilderStore();

    console.log(blocks);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: { distance: 8 },
        })
    );

    const isDragging = !!activeId;
    const isDraggingFromSidebar = useMemo(
        () => !!activeId && SIDEBAR_ITEMS.some((i) => i.id === activeId),
        [activeId, SIDEBAR_ITEMS]
    );

    const validDropIds = useMemo(
        () =>
            new Set([
                WORK_CONTAINER_ID,
                DROP_END_ZONE_ID,
                ...blocks.map((i) => String(i.id)),
            ]),
        [blocks]
    );

    const handleDragStart = useCallback(
        (event: DragStartEvent) => {
            setActiveId(event.active.id);
        },
        [setActiveId]
    );

    const handleDragOver = useCallback(
        (event: DragOverEvent) => {
            const id = event.over?.id ?? null;
            setOverId(
                isValidDropTarget(id, validDropIds) ? String(id) : null
            );
        },
        [setOverId, validDropIds]
    );

    const handleDragEnd = useCallback(
        (event: DragEndEvent) => {
            const { active, over } = event;

            setActiveId(null);
            setOverId(null);

            if (!over) return;

            const aId = String(active.id);
            const oId = String(over.id);

            if (!validDropIds.has(oId)) return;

            const fromSidebar = SIDEBAR_ITEMS.some((i) => i.id === aId);
            const fromList = blocks.some((i) => i.id === aId);

            // Handle drop from sidebar
            if (fromSidebar) {
                const template = SIDEBAR_ITEMS.find((i) => i.id === aId);
                if (!template) return;

                const newBlock = createBlockFromTemplate(template as Block);

                let targetIndex = blocks.length;
                if (oId !== WORK_CONTAINER_ID && oId !== DROP_END_ZONE_ID) {
                    const idx = blocks.findIndex((i) => i.id === oId);
                    if (idx !== -1) targetIndex = idx;
                }

                addBlock(newBlock, targetIndex);
                return;
            }

            // Handle reorder within list
            if (fromList) {
                if (oId === DROP_END_ZONE_ID) {
                    moveBlockToEnd(aId);
                    return;
                }
                if (oId === WORK_CONTAINER_ID) {
                    return;
                }
                moveBlock(aId, oId);
            }
        },
        [
            setActiveId,
            setOverId,
            validDropIds,
            SIDEBAR_ITEMS,
            blocks,
            addBlock,
            moveBlock,
            moveBlockToEnd,
        ]
    );

    const activeItem = useMemo(() => {
        if (!activeId) return null;
        return (
            SIDEBAR_ITEMS.find((i) => i.id === activeId) ||
            blocks.find((i) => i.id === activeId) ||
            null
        );
    }, [activeId, blocks, SIDEBAR_ITEMS]);

    return (
        <DndContext
            sensors={sensors}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragEnd={handleDragEnd}
        >
            <div className="flex h-screen bg-gray-50">
                {/* Sidebar */}
                <aside className="w-80 bg-white border-r border-gray-200 p-6 overflow-y-auto">
                    <h2 className="text-lg font-semibold text-gray-800 mb-4">
                        Composants
                    </h2>
                    <SortableContext
                        items={SIDEBAR_ITEMS.map((item) => item.id)}
                        strategy={verticalListSortingStrategy}
                    >
                        <div className="space-y-3">
                            {SIDEBAR_ITEMS.map((item) => (
                                <DraggableItem key={item.id} {...item} />
                            ))}
                        </div>
                    </SortableContext>
                </aside>

                {/* Main work area */}
                <main className="flex-1 p-8 overflow-y-auto">
                    {blocks.length === 0 ? (
                        <EmptyDropZone />
                    ) : (
                        <div
                            id={WORK_CONTAINER_ID}
                            className="min-h-[240px] border-2 border-dashed rounded-xl p-6 bg-blue-50/50 border-blue-200"
                        >
                            <SortableContext
                                items={blocks.map((i) => i.id)}
                                strategy={verticalListSortingStrategy}
                            >
                                <div className="space-y-3 pb-3">
                                    {blocks.map((item) => (
                                        <React.Fragment key={item.id}>
                                            {isDraggingFromSidebar && overId === item.id && (
                                                <div className="h-14 border-2 border-dashed border-green-500 bg-green-50 rounded-lg flex items-center justify-center animate-pulse">
                          <span className="text-green-600 font-medium">
                            ↓ Insérer ici ↓
                          </span>
                                                </div>
                                            )}

                                            <SortableItem {...item} />
                                        </React.Fragment>
                                    ))}

                                    {isDragging && <DropEndZone />}
                                </div>
                            </SortableContext>
                        </div>
                    )}
                </main>
            </div>

            <DragOverlay>
                {activeItem ? (
                    isDraggingFromSidebar ? (
                        <DraggableItem {...activeItem} />
                    ) : (
                        <SortableItem {...activeItem} />
                    )
                ) : null}
            </DragOverlay>
        </DndContext>
    );
};

export default FormBuilder;
