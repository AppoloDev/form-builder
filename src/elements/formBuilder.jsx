import { createRoot } from "react-dom/client";
import { FormBuilder } from "../FormBuilder";

export class FormBuilderElement extends HTMLElement {
    connectedCallback() {
        let json = [];
        const inputTarget = this.querySelector(this.getAttribute('target') ?? 'textarea');

        if (inputTarget) {
            const elementRoot = document.createElement("div");
            this.appendChild(elementRoot);

            try {
                json = JSON.parse(inputTarget.value);
            } catch (e) {
                json = []
            }

            inputTarget.style.display = "none";

            this.root = createRoot(elementRoot);
            this.root.render(
                <FormBuilder
                    json={json}
                    onChange={(value) => {
                        inputTarget.value = JSON.stringify(value);
                    }}
                />
            );
        }
    }

    disconnectedCallback() {
        this.root.unmount();
    }
}

customElements.define("form-builder", FormBuilderElement);
