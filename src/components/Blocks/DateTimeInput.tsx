import { EditionItem, makeInputBlock } from "./GenericInput";

const dateTimeExtras: EditionItem[] = [
    {
        key: "mode",
        label: "Type de saisie",
        type: "select",
        options: [
            { value: "date",           label: "Date" },
            { value: "datetime-local", label: "Date et heure" },
            { value: "time",           label: "Heure" },
        ],
    },
];

const DateTimeInput = makeInputBlock("date", {
    extraSchema: dateTimeExtras,
    toInputAttrs: (form) => {
        const allowed = ["date", "datetime-local", "time"];
        const mode = typeof form.mode === "string" && allowed.includes(form.mode)
            ? (form.mode as (typeof allowed)[number])
            : "datetime-local";

        return { type: mode };
    },
});

export default DateTimeInput;
