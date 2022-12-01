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
