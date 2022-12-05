import { createRoot } from "react-dom/client";
import FormBuilder from "../FormBuilder";

export class FormBuilderElement extends HTMLElement {
    connectedCallback() {
        const attrs = {};
        Object.values(this.attributes).forEach((item) => {
            attrs[item.name] = item.value;
        });

        const json = [];
        /*const json = [
            {
                type: "TextInput",
                label: "Label",
                placeHolder: "Lets go",
                value: "je suis une value",
                required: true,
            },
            {
                type: "DateTimeInput",
                label: "Datetime input",
                placeHolder: "Lets go",
                value: "",
                required: true,
            },
            {
                type: "Repeatable",
                maxItems: 5,
                children: [
                    {
                        type: "TextInput",
                        label: "Nom",
                        required: true,
                    },
                    {
                        type: "TextInput",
                        label: "Prénom",
                        required: true,
                    },
                ]
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
                        type: "EmailInput",
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
                        acceptedFile: [],
                        value: ['application/pdf'],
                        required: true,
                    },
                    {
                        type: "Repeatable",
                        maxItems: 5,
                        children: [
                            {
                                type: "TextInput",
                                label: "Nom",
                                required: true,
                            },
                            {
                                type: "TextInput",
                                label: "Prénom",
                                required: true,
                            },
                        ]
                    },
                ]
            }
        ]*/

        this.root = createRoot(this);
        this.root.render(
            <FormBuilder
                json={json}
                onChange={(value) => {
                    const changeEvent = new CustomEvent('change', {detail: value});
                    this.dispatchEvent(changeEvent)
                }}
                onClose={(value) => {
                    const closeEvent = new CustomEvent('close', {detail: value});
                    this.dispatchEvent(closeEvent)
                }}
                {...attrs}/>
        );
    }

    disconnectedCallback() {
        this.root.unmount();
    }
}

customElements.define("form-builder", FormBuilderElement);
