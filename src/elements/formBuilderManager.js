class FormBuilderManager extends HTMLElement {
    connectedCallback() {
        console.log("okjeee");

        this.openBuilder = this.openBuilder.bind(this);

        this.formBuilderEl = this.querySelector('form-builder');
    }

    openBuilder() {
        this.formBuilderEl.removeAttribute('hidden');
    }

    closeBuilder() {
        //this.formBuilderEl.setAttribute('hidden', '');
    }
}

customElements.define("form-builder-manager", FormBuilderManager);
