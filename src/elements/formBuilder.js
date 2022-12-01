import { createRoot } from "react-dom/client";
import FormBuilder from "../FormBuilder";

class FormBuilderElement extends HTMLElement {
    connectedCallback() {
        const attrs = {};
        Object.values(this.attributes).forEach((item) => {
            attrs[item.name] = item.value;
        });

        this.root = createRoot(this);
        this.root.render(
            <FormBuilder
                onChange={(value) => {
                    console.log('onChange', value);
                }}
                onClose={(value) => {
                    console.log('onClose', value);
                }}
                {...attrs}/>
        );
    }

    disconnectedCallback() {
        this.root.unmount();
    }
}

customElements.define("form-builder", FormBuilderElement);
