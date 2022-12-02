import React, { useContext, useRef } from "react";
import { Context } from "./DndContext";

export function DroppableList({items, renderItem, dropItem}: any) {
    const {movingItem, setMovingItem, setMovingItemHeight} = useContext(Context);

    const ref = useRef<any>();

    const onDragStart = (e: any, item: any) => {
        setMovingItem(dropItem(item));
        setMovingItemHeight(ref.current.children[items.indexOf(item)].getBoundingClientRect().height);
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
                <div
                    className="droppable-item"
                    key={i}
                    draggable
                    onDragStart={e => onDragStart(e, item)}
                >{renderItem(item, i)}</div>))
            }
        </div>);
}
