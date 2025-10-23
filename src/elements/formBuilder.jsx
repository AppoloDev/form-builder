import { createRoot } from "react-dom/client";
import { FormBuilder } from "../FormBuilder";

export class FormBuilderElement extends HTMLElement {
    connectedCallback() {
        let json = [];
        const inputTarget =  this.querySelector(this.getAttribute('target') ?? 'textarea');

        try {
            json = JSON.parse(inputTarget.value);
        } catch (e) {
            json = []
        }

        this.root = createRoot(this);
        this.root.render(
            <FormBuilder
                json={json}
                onChange={(value) => {
                    const changeEvent = new CustomEvent('change', {detail: value});
                    this.dispatchEvent(changeEvent)
                }}
            />
        );
    }

    disconnectedCallback() {
        this.root.unmount();
    }
}

customElements.define("form-builder", FormBuilderElement);
