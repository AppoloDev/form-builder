import { useDroppable } from "@dnd-kit/core";
import React from "react";

export const DropEndZone = () => {
    const {setNodeRef, isOver} = useDroppable({id: "drop-end-zone"});

    return (
        <div ref={setNodeRef} className="h-8 mt-3 mb-3">
            {isOver && (
                <div
                    className="h-14 border-2 border-dashed border-green-500 bg-green-50 rounded-lg flex items-center justify-center animate-pulse">
                    <span className="text-green-600 font-medium">↓ Insérer ici ↓</span>
                </div>
            )}
        </div>
    );
}
