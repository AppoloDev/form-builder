import { FC } from "react";
import TextInput from "./TextInput";
import FieldSet from "./FieldSet";
import Paragraph from "./Paragaph";
import TextAreaInput from "./TextAreaInput";
import FileInput from "./FileInput";
import Select from "./Select";
import Signature from "./Signature";
import Title from "./Title";

interface IDictionary<TValue> {
    [id: string]: TValue;
}

export interface Block {
    title: string;
    component: FC<any>;
}

export const blocks: IDictionary<Block> = {
    TextInput: {
        title: "Champ texte",
        component: TextInput,
    },
    FieldSet: {
        title: "FieldSet",
        component: FieldSet,
    },
    Paragraph: {
        title: "Paragraphe",
        component: Paragraph,
    },
    Title: {
        title: "Titre",
        component: Title,
    },
    TextAreaInput: {
        title: "Zone de texte",
        component: TextAreaInput,
    },
    FileInput: {
        title: "Fichier",
        component: FileInput,
    },
    Select: {
        title: "Liste à choix",
        component: Select,
    },
    Signature: {
        title: "Signature",
        component: Signature,
    }
};
