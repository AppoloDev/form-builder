import React, { useState } from 'react';
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
                    type: "NumberInput",
                    label: "Number input",
                    helpText: "Text d'aide",
                },
                {
                    type: "TextInput",
                    label: "champ 2",
                    placeHolder: "inside !",
                    helpText: "",
                    required: true,
                },
                {
                    type: "TextAreaInput",
                    label: "champ 2",
                    defaultValue: 'Plop coin',
                    placeHolder: "inside !",
                    helpText: "",
                    required: true,
                },
                {
                    type: "FileInput",
                    label: "Fichier",
                    maxItems: 5,
                    helpText: "Fichier PDF",
                    required: true,
                },
                {
                    type: "Select",
                    label: "Select",
                    helpText: "",
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
                    type: "Address",
                    label: 'Adresse'
                },
                {
                    type: "Signature",
                    label: "Sign",
                    helpText: "",
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
            {items.map((item, i) =>
                React.createElement(blocks[item.type].component, {
                    key: i, ...item,
                    editItem: (key: string, value: any) => editItem(item, key, value)
                }))
            }

            <p>{JSON.stringify(items)}</p>
        </div>
    )
}

export default FormBuilder;
