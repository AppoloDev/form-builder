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
    id: number;
    title: string;
    component: FC<any>;
    base: any
}

export const blocks: IDictionary<Block> = {
    TextInput: {
        id: 1,
        title: "Champ texte",
        component: TextInput,
        base: {
            label: "Champ texte",
            placeHolder: "PlaceHolder",
            value: "",
            required: false,
        }
    },
    FieldSet: {
        id: 2,
        title: "FieldSet",
        component: FieldSet,
        base: {
            children: []
        }
    },
    Paragraph: {
        id: 3,
        title: "Paragraphe",
        component: Paragraph,
        base: {
            text: "Paragraphe"
        }
    },
    Title: {
        id: 4,
        title: "Titre",
        component: Title,
        base: {
            text: "Titre"
        }
    },
    TextAreaInput: {
        id: 5,
        title: "Zone de texte",
        component: TextAreaInput,
        base: {
            label: "Zone de texte",
            placeHolder: "PlaceHolder",
            value: "",
            required: false,
        }
    },
    FileInput: {
        id: 6,
        title: "Fichier",
        component: FileInput,
        base: {
            label: "Fichier",
            placeHolder: "PlaceHolder",
            value: "",
            required: false,
        }
    },
    Select: {
        id: 7,
        title: "Liste à choix",
        component: Select,
        base: {
            label: "Sélecteur",
            placeHolder: "PlaceHolder",
            options: [],
            multiple: false,
            checkCases: false,
            required: false,
        }
    },
    Signature: {
        id: 8,
        title: "Signature",
        component: Signature,
        base: {
            label: "Signature",
            required: false
        }
    }
};
