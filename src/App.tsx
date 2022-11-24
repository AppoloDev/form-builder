import React, { useState } from 'react';
import './App.scss';
import { blocks } from './components/blocks/definition';
import { BlockType } from "./components/BlockType";

function App() {
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
                    options: [{label: "test", value: "testt"}],
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

    const editItem = (item: any, key: string, value: any) => {
        item[key] = value;
        setItems2([...items2]);
    }

    return (
        <>
            {items2.map((item, i) =>
                React.createElement(blocks[item.type].component, {
                    key: i, ...item,
                    editItem: (key: string, value: any) => editItem(item, key, value)
                }))
            }
            {Object.entries(blocks).map(([key, block], i) => <BlockType block={block} key={i}/>)}

            <p>{JSON.stringify(items2)}</p>
        </>
    )
}

export default App;
