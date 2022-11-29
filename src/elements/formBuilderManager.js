class FormBuilderManager extends HTMLElement {
    connectedCallback() {
        this.openBuilder = this.openBuilder.bind(this);

        this.formBuilderEl = this.querySelector('form-builder');
        if (this.formBuilderEl) {
            this.openBuilderEl = this.querySelector(this.getAttribute('open'));
            this.targetEl = this.querySelector(this.getAttribute('target'));
            if (this.openBuilderEl && this.targetEl) {
                this.openBuilderEl.addEventListener('click', this.openBuilder);
            }
        }
    }

    openBuilder() {
        this.formBuilderEl.removeAttribute('hidden');
        // TODO gérer l'event onClose (ou onSave ou les 2) afin de mettre le json dans le this.targetEl.value
    }
}

customElements.define("form-builder-manager", FormBuilderManager);
