import { useSortable } from "@dnd-kit/sortable";
import React from "react";
import { Block } from "../Blocks/Definition";

type Props = Block

export const DraggableItem = ({id, title}: Props) => {
    const { attributes, listeners, setNodeRef } = useSortable({ id });

    return (
        <div
            ref={setNodeRef}
            {...attributes}
            {...listeners}
            className="flex items-center gap-3 p-3 bg-white border-2 border-gray-200 rounded-lg cursor-move hover:border-blue-400 hover:shadow-md transition-all"
        >
            <span className="font-medium text-gray-700">{title}</span>
        </div>
    );
}
