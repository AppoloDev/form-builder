import React, { useState } from 'react';
import './App.css';
import {
    closestCenter,
    DndContext, DragEndEvent,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors
} from "@dnd-kit/core";
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy
} from "@dnd-kit/sortable";
import { SortableItem } from "./components/SortableItem";
import { blocks } from './components/blocks/definition';
import { BlockType } from "./components/BlockType";

function App() {
    const [items, setItems] = useState([1, 2, 3]);

    const [items2, setItems2] = useState([
        {
            type: "TextInput",
            label: "a",
            placeHolder: "Lets go",
            value: "",
            required: true,
        },
        {
            type: "FieldSet",
            children: [
                {
                    type: "Text",
                    text: "Au petit matin, les oiseaux se réveillent"
                },
                {
                    type: "TextInput",
                    label: "fdfddfggdf",
                    placeHolder: "inside !",
                    tooltip: "",
                    required: true,
                },
                {
                    type: "TextInput",
                    label: "champ 2",
                    placeHolder: "inside !",
                    tooltip: "",
                    required: true,
                },
                {
                    type: "TextAreaInput",
                    label: "champ 2",
                    placeHolder: "inside !",
                    tooltip: "",
                    required: true,
                },
                {
                    type: "FileInput",
                    label: "Fichier",
                    maxItems: 5,
                    tooltip: "Fichier PDF",
                    required: true,
                },
                {
                    type: "Select",
                    label: "Select",
                    tooltip: "",
                    multiple: false,
                    options: [{ label: "test", value: "testt"}],
                    required: true,
                },
            ]
        },
        {
            type: "FieldSet",
            children: [
                {
                    type: "Text",
                    text: "Deuxieme fieldset"
                },
                {
                    type: "Signature",
                    label: "Sign",
                    tooltip: "",
                    required: true,
                },
            ]
        }
    ]);

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleDragEnd = (event: DragEndEvent) => {
        const {active, over} = event;

        if (active.id !== over?.id) {
            setItems((items) => {
                // @ts-ignore
                const oldIndex = items.indexOf(active.id);
                // @ts-ignore
                const newIndex = items.indexOf(over?.id);

                return arrayMove(items, oldIndex, newIndex);
            });
        }
    }

    const editItem = (item: any, key: string, value: any) => {
        item[key] = value;
        setItems2([...items2]);
    }

    return (
        <>
            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
            >
                <SortableContext
                    items={items}
                    strategy={verticalListSortingStrategy}
                >
                    {items.map(id => <SortableItem key={id} id={id} />)}
                </SortableContext>
            </DndContext>
            {items2.map((item, i) => React.createElement(blocks[item.type].component,{ key: i, ...item, editItem: (key: string, value: any) => editItem(item, key, value) }))}
            {Object.entries(blocks).map(([key, block], i) => <BlockType block={block} key={i} />)}

            <p>{JSON.stringify(items2)}</p>
        </>
    )
}

export default App;
