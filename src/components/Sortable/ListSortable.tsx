import React, { DragEvent, useContext, useRef, useState } from "react";
import useDebounce from "../../hooks/Debounce";
import { Context } from "./DndContext";

export function SortableList({ items, renderItem }: any) {
    const { movingItem, setMovingItem, movingItemHeight, setMovingItemHeight, moveItem } = useContext(Context);

    const ref = useRef<any>();

    const [placeholder, setPlaceholderIndex] = useState<number|null>(null);
    const isHoverDragging = movingItem !== null && placeholder !== null;

    const onDrop = (e: DragEvent<HTMLDivElement>) => {
        setMovingItem(null);
        moveItem(movingItem, items, getIndexOfItem(e.clientY));
        e.stopPropagation();
    }

    const onDragStart = (e: DragEvent<HTMLDivElement>, item: any) => {
        setMovingItem(item);
        if(ref.current) {
            setMovingItemHeight(ref.current.children[items.indexOf(item)].getBoundingClientRect().height);
        }
        e.stopPropagation();
    }

    const debounced = useDebounce(() => {
        setPlaceholderIndex(null);
    }, 100);

    const onDragOver = (e: DragEvent<HTMLDivElement>) => {
        setPlaceholderIndex(getIndexOfItem(e.clientY));
        debounced();
        e.preventDefault();
        e.stopPropagation();
    }

    const getIndexOfItem = (clientY: number) => {
        const el = ref.current;

        if(el === undefined) return 0;

        let currentHeight = el.getBoundingClientRect().top;
        for(let i = 0; i < el.children.length; i++) {
            const height = el.children[i].getBoundingClientRect().height;
            if(clientY <= (currentHeight + (height / 2))) {
                return i;
            }
            currentHeight += height;
        }

        return el.children.length;
    }

    const getParentStyle = () => {
        if(!isHoverDragging) return {};

        let height = 0;

        const el: HTMLElement|undefined = ref.current;

        if(el != undefined) {
            for(let i = 0; i < el.children.length; i++) {
                height+=el.children[i].getBoundingClientRect().height;
            }
        }

        const startIndex = items.indexOf(movingItem);
        if(startIndex === -1) height+=movingItemHeight;

        return {
            height,
            width: '100%'
        };
    }

    const getStyle = (key: number) => {
        if(!isHoverDragging) return {};

        let top = 0;

        const el: HTMLElement|undefined = ref.current;

        const startIndex = items.indexOf(movingItem);

        if(placeholder !== null && el !== undefined) {
            if(startIndex !== -1) {
                const clone = Array.from(Array(items.length).keys());
                let item = clone.splice(startIndex, 1)[0];
                clone.splice(placeholder, 0, item);

                for(let i = 0; i < items.length; i++) {
                    if(clone[i] === key) break;
                    top += el.children[clone[i]].getBoundingClientRect().height;
                }
            } else {
                for(let i = 0; i < items.length; i++) {
                    if(i === placeholder) top += movingItemHeight;
                    if(i === key) break;
                    top += el.children[i].getBoundingClientRect().height;
                }
            }
        }

        return {
            top,
            width: ref.current?.children[key].getBoundingClientRect().width,
        };
    }

    const onDragEnd = () => {
        setMovingItem(null);
    }

    return <div onDragOver={onDragOver} onDragEnd={onDragEnd} onDrop={onDrop} style={{ position: 'relative', ...getParentStyle() }} ref={ref}>
        {items.map((item: any, i: number) => <div style={{ transition: 'all 0.1s linear', position: (isHoverDragging ? 'absolute' : 'unset'), ...getStyle(i) }}
                                                  key={i}
                                                  draggable
                                                  onDragStart={e => onDragStart(e, item)}>{renderItem(item, i)}</div>)}
    </div>;
}
