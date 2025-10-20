import React, { useContext, useRef } from "react";
import { Context } from "./DndContext";
import { Tooltip } from "../Tooltip";

export function DroppableList({items, renderItem, dropItem}: any) {
    const {setMovingItem, setMovingItemHeight} = useContext(Context);

    const ref = useRef(null);

    const onDragStart = (e: any, item: any) => {
        setMovingItem(dropItem(item));
        setMovingItemHeight(ref.current.children[items.indexOf(item)].getBoundingClientRect().height + 30);
        e.stopPropagation();
    }

    const onDragEnd = (e: any) => {
        setMovingItem(null);
    }

    return (
        <div
            className="droppable-list"
            onDragEnd={onDragEnd}
            ref={ref}>
            {items.map((item: any, i: number) => (
                <Tooltip content={item.tooltip} key={i}>
                    <div
                        className="droppable-item"
                        draggable
                        onDragStart={e => onDragStart(e, item)}
                    >
                        {renderItem(item, i)}
                    </div>
                </Tooltip>
            ))
            }
        </div>);
}
