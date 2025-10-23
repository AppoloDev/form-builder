// DraggableItem.tsx
import { useDraggable } from "@dnd-kit/core";
import React from "react";
import { BlockDefinition } from "../Blocks/Definition"; // 👈 corrige le type

type Props = BlockDefinition;

export const DraggableItem = ({ id, title, type }: Props) => {
    const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
        id,                         // ex: "drag-textinput"
        data: {
            from: "palette",          // 👈 on marque bien la source
            blockType: type,          // 👈 "TextInput" | "NumberInput" | ...
            label: title,             // 👈 titre par défaut pour le chip
        },
    });

    return (
        <div
            ref={setNodeRef}
            {...attributes}
            {...listeners}
            className={`flex items-center gap-3 p-3 bg-white border-2 rounded-lg cursor-grab hover:shadow-md transition-all
        ${isDragging ? "opacity-60 border-blue-400" : "border-gray-200 hover:border-blue-400"}`}
        >
            <span className="font-medium text-gray-700">{title}</span>
        </div>
    );
};
