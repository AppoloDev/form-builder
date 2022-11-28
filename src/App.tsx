import React, {useRef, useState} from 'react';
import './App.scss';
import { blocks } from './components/Blocks/Definition';

function FormBuilder() {
    const [items, setItems] = useState([
        {
            type: "TextInput",
            label: "Label",
            placeHolder: "Lets go",
            value: "",
            required: true,
        },
        {
            type: "FieldSet",
            children: [
                {
                    type: "Title",
                    text: "Au petit matin, les oiseaux se réveillent"
                },
                {
                    type: "Paragraph",
                    text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
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
                    options: [{label: "test", value: "testt"}],
                    required: true,
                },
            ]
        },
        {
            type: "FieldSet",
            children: [
                {
                    type: "Title",
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

    const editItem = (item: any, key: string, value: any) => {
        item[key] = value;
        setItems([...items]);
    }

    return (
        <div className="form-builder">
          {/*  {items.map((item, i) =>
                React.createElement(blocks[item.type].component, {
                    key: i, ...item,
                    editItem: (key: string, value: any) => editItem(item, key, value)
                }))
            }*/}

            <SortableList setReorder={(items: any[]) => setItems(items)}
                          renderItem={(item: any, key: number) => React.createElement(blocks[item.type].component, {
                key, ...item,
                editItem: (key: string, value: any) => editItem(item, key, value)
            })} items={items}>
            </SortableList>

            <p>{JSON.stringify(items)}</p>
        </div>
    )
}

export function SortableList({ items, setReorder, renderItem }: any) {

    const [movingItem, setMovingItem] = useState(null);
    const [indexes, setIndexes] = useState(Array.from(Array(items.length).keys()));

    const ref = useRef<any>();

    const onDrop = (e: any) => {
        const target = e.target;
        const bounds = target.getBoundingClientRect();
        const clone = [...items];

        let item = clone.splice(clone.indexOf(movingItem), 1)[0];
        const newIndex = getIndexOfItem(e.clientY);

        clone.splice(newIndex, 0, item);
        setReorder(clone);
        setMovingItem(null);
    }

    const onDragStart = (e: any, item: any) => {
        setMovingItem(item);
        e.dataTransfer.setData("text/plain", items.indexOf(item));
    }

    const onDragOver = (e :any) => {
        const index = items.indexOf(movingItem);
        const clone = [...indexes];
        const val = clone.splice(clone.indexOf(index), 1)[0];
        clone.splice(getIndexOfItem(e.clientY), 0, val);
        setIndexes(clone);
        e.preventDefault();
    }

    const getIndexOfItem = (clientY: number) => { // TODO : Fix middle
        const el: HTMLElement|undefined = ref.current;

        if(el === undefined) return 0;

        for(let i = 0; i < el.children.length; i++) {
            const bounds = el.children[i].getBoundingClientRect();
            //console.log(el.children[i], bounds.top, bounds.height, clientY);
            if(clientY <= ((bounds.top+bounds.height)/2)) {
                return i;
            }
        }

        return el.children.length;
    }

    const getParentStyle = () => {
        if(movingItem === null) return {};

        let height = 0;

        const el: HTMLElement|undefined = ref.current;

        if(el != undefined) {
            for(let i = 0; i < el.children.length; i++) {
                height+=el.children[i].getBoundingClientRect().height;
            }
        }

        return {
            height,
        };
    }

    const getStyle = (key: any) => {
        if(movingItem === null) return {};

        let top = 0;

        const el: HTMLElement|undefined = ref.current;

        if(el != undefined) {
            for(const val of indexes) {
                if(val === key) break;
                const e = el.children[indexes[val]];
                console.log('val', val, e, e.getBoundingClientRect().height);
                top+=e.getBoundingClientRect().height;
            }
        }

        console.log("- -- -- - -- ");
        console.log(top);

        return {
            top,
            left: 0,
        };
    }

    return <div onDragOver={onDragOver} onDrop={onDrop} style={{ position: 'relative', ...getParentStyle() }} ref={ref}>
        {items.map((item: any, i: number) => <div style={{ transition: 'all 1s linear', position: (movingItem ? 'absolute' : 'unset'), ...getStyle(i) }} key={i} draggable onDragStart={e => onDragStart(e, item)} className={"test"}>{renderItem(item, i)}</div>)}
    </div>;
}

export default FormBuilder;
