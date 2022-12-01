import {createRoot} from "react-dom/client";
import FormBuilder from "../FormBuilder";
import TextInput from "../components/Blocks/TextInput";

class FormBuilderElement extends HTMLElement {
    connectedCallback() {
        const attrs = {};
        Object.values(this.attributes).forEach((item) => {
            attrs[item.name] = item.value;
        });

        console.log(attrs);

        const customBlocks = {
            TextInput: {
                base: {
                    label: 'Je suis un texte de type input'
                }
            },
        }

        this.root = createRoot(this);
        this.root.render(<FormBuilder {...attrs}/>);
    }

    disconnectedCallback() {
        this.root.unmount();
    }
}

customElements.define("form-builder", FormBuilderElement);
