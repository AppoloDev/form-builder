import { useDroppable } from "@dnd-kit/core";
import React from "react";

export const EmptyDropZone = () => {
    const {setNodeRef, isOver} = useDroppable({id: "work-container"});

    return (
        <div
            ref={setNodeRef}
            className={`min-h-[240px] border-2 border-dashed rounded-xl p-6 flex items-center justify-center transition-colors ${
                isOver ? "border-blue-500 bg-blue-50" : "border-gray-300 bg-white"
            }`}
        >
            <p className="text-lg text-gray-400">Déposez des éléments ici</p>
        </div>
    );
}
