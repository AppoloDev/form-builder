class FormBuilderManager extends HTMLElement {
    connectedCallback() {
        console.log("okjeee");

        this.openBuilder = this.openBuilder.bind(this);

        this.formBuilderEl = this.querySelector('form-builder');

        if (this.formBuilderEl) {
            this.openBuilderEl = this.querySelector(this.getAttribute('open'));
            this.targetEl = this.querySelector(this.getAttribute('target'));
            if (this.openBuilderEl && this.targetEl) {
                this.openBuilderEl.addEventListener('click', this.openBuilder);
                this.formBuilderEl.addEventListener('close', this.closeBuilder.bind(this));
                this.formBuilderEl.addEventListener('change', (e) => {
                });
            }
        }
    }

    openBuilder() {
        this.formBuilderEl.removeAttribute('hidden');
    }

    closeBuilder() {
        this.formBuilderEl.setAttribute('hidden', '');
    }
}

customElements.define("form-builder-manager", FormBuilderManager);
