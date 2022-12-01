import React, { useState } from "react";

type DndContextType = {
    movingItem: any,
    setMovingItem: React.Dispatch<React.SetStateAction<any>>,
    movingItemContainer: any,
    setMovingItemContainer: React.Dispatch<React.SetStateAction<any>>,
    movingItemHeight: number,
    setMovingItemHeight: React.Dispatch<React.SetStateAction<number>>,
    movingItemWidth: number,
    setMovingItemWidth: React.Dispatch<React.SetStateAction<number>>,
    moveItem: (item: any, items: any[], index: number) => void
}

export const Context = React.createContext<DndContextType>({} as DndContextType);

export default function DndContext({ children, items, setReorder }: any) {
    const [movingItem, setMovingItem] = useState(null);
    const [movingItemHeight, setMovingItemHeight] = useState(0);
    const [movingItemWidth, setMovingItemWidth] = useState(0);
    const [movingItemContainer, setMovingItemContainer] = useState(null);

    const moveItem = (item: any, children: any[], index: number) => {
        const clone = recursiveMoveItem(item, items, children, index);
        setReorder(clone);
    }

    const recursiveMoveItem = (item: any, items: any[], children: any[], index: number) => {
        const clone = [...items];
        const i = clone.indexOf(item);

        if (i !== -1) {
            clone.splice(i, 1);
        }

        if (items === children) {
            clone.splice(index, 0, item);
        }

        for (const child of clone) {
            if (child.children) {
                child.children = recursiveMoveItem(item, child.children, children, index);
            }
        }

        return clone;
    }

    return <Context.Provider value={{movingItem, movingItemHeight, setMovingItem, setMovingItemHeight, movingItemWidth, setMovingItemWidth, movingItemContainer, setMovingItemContainer, moveItem}}>
        {children}
    </Context.Provider>
};
