import React, { DragEvent, useContext, useEffect, useRef, useState } from "react";
import { Context } from "./DndContext";

export function SortableList({ items, renderItem, margin = 16, name = "Parent", children, canAddChildren = (item: any) => true }: any) {
    const { movingItem, setMovingItem, movingItemHeight, setMovingItemHeight, movingItemWidth, setMovingItemWidth, movingItemContainer, setMovingItemContainer, moveItem } = useContext(Context);

    const ref = useRef<any>();

    useEffect(() => {
        setPlaceholderIndex(null);
    }, [movingItem]);

    const [placeholder, setPlaceholderIndex] = useState<number | null>(null);
    const isHoverDragging = movingItem !== null && placeholder !== null;

    const onDrop = (e: DragEvent<HTMLDivElement>) => {
        if (canAddChildren(movingItem)) {
            setMovingItem(null);
            moveItem(movingItem, items, getIndexOfItem(e.clientY));
        }
        e.stopPropagation();
    }

    const onDragStart = (e: DragEvent<HTMLDivElement>, item: any) => {
        setMovingItem(item);
        if (ref.current) {
            const bounds = ref.current.children[items.indexOf(item)].getBoundingClientRect();
            setMovingItemHeight(bounds.height);
            setMovingItemWidth(bounds.width);
        }

        e.stopPropagation();
    }

    const onDragOver = (e: DragEvent<HTMLDivElement>) => {
        if (canAddChildren(movingItem)) {
            setMovingItemContainer(items);
            setPlaceholderIndex(getIndexOfItem(e.clientY));
        }
        e.preventDefault();
        e.stopPropagation();
    }

    const getIndexOfItem = (clientY: number) => {
        const el = ref.current;

        if (el === undefined) return 0;

        let currentHeight = el.getBoundingClientRect().top;
        for (let i = 0; i < el.children.length; i++) {
            const height = el.children[i].getBoundingClientRect().height;
            if (clientY <= (currentHeight + (height / 2))) {
                return i;
            }
            currentHeight += height;
        }

        return el.children.length;
    }

    const getParentStyle = () => {
        if (!isHoverDragging) return {};

        const el: HTMLElement | undefined = ref.current;

        let height = 0;
        let width = el?.children.length === 0 ? '100%' : 0;

        if (el !== undefined) {
            for (let i = 0; i < el.children.length; i++) {
                height += el.children[i].getBoundingClientRect().height + (i === (el.children.length - 1) ? 0 : margin);
                width = el.children[i].getBoundingClientRect().width + (i === (el.children.length - 1) ? 0 : margin);
            }
        }

        const startIndex = items.indexOf(movingItem);
        if (startIndex === -1) height += (movingItemHeight + margin); // TODO : (Improving some weird spaces ?)

        return {
            height,
            width
        };
    }

    const getStyle = (item: any, key: number) => {
        if (!isHoverDragging) return {};

        if (item === movingItem && movingItemContainer !== items) {
            return {
                display: 'none'
            }
        }

        let top = 0;

        const el: HTMLElement | undefined = ref.current;

        const startIndex = items.indexOf(movingItem);

        if (placeholder !== null && el !== undefined) {
            if (startIndex !== -1) {
                const clone = Array.from(Array(items.length).keys());
                let item = clone.splice(startIndex, 1)[0];
                clone.splice(placeholder, 0, item);

                for (let i = 0; i < items.length; i++) {
                    if (clone[i] === key) break;
                    top += el.children[clone[i]].getBoundingClientRect().height + margin;
                }
            } else {
                for (let i = 0; i < items.length; i++) {
                    if (i === placeholder) { // TODO : (Improving some weird spaces ?)
                        top += movingItemHeight + margin;
                    }
                    if (i === key) break;
                    top += el.children[i].getBoundingClientRect().height + margin;
                }
            }
        }

        return {
            top,
            width: item === movingItem ? movingItemWidth : ref.current?.children[key].getBoundingClientRect().width,
        };
    }

    const onDragEnd = () => {
        setMovingItem(null);
    }

    return (
        <div
            onDragOver={onDragOver}
            onDragEnd={onDragEnd}
            onDrop={onDrop}
            style={{position: 'relative', ...getParentStyle()}} ref={ref}
        >
            {items.length === 0 && <div className="no-items">Déplacer un élément dans la zone…</div>}
            {items.map((item: any, i: number) => (
                <div
                    className={`draggable ${movingItem === item ? 'dragging' : ''}`}
                    style={{
                        transition: 'all 0.1s linear',
                        position: (isHoverDragging ? 'absolute' : 'unset'),
                        ...getStyle(item, i)
                    }}
                    key={i}
                    draggable
                    onDragStart={e => onDragStart(e, item)}
                >{renderItem(item, i)}</div>))}
            {children}
        </div>);
}
