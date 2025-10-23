import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import React from "react";
import { Block } from "../Blocks/Definition";

type Props = Block;

export const SortableItem = (props: Props) => {
    const {id, component} = props;

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({id});

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className="flex items-center gap-3 p-4 bg-white border-2 border-gray-300 rounded-lg shadow-sm"
        >
            <div {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing">
                <span className="text-gray-400 text-xl">☰</span>
            </div>

            {React.createElement(component, {...props})}
        </div>
    );
};
