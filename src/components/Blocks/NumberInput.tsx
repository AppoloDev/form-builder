import { EditionItem, makeInputBlock } from "./GenericInput";

const numberExtras: EditionItem[] = [
    {key: "min", label: "Valeur minimale", type: "text"},
    {key: "max", label: "Valeur maximale", type: "text"},
    {key: "step", label: "Pas", type: "text"},
];

const NumberInput = makeInputBlock("number", {
    extraSchema: numberExtras,
    toInputAttrs: (form) => ({
        min: form.min,
        max: form.max,
        step: form.step,
    }),
});

export default NumberInput;
