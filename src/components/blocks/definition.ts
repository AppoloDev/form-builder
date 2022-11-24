import { Block } from "../../models/Block";
import TextInput from "./TextInput";
import FieldSet from "./FieldSet";
import Text from "./Text";
import TextAreaInput from "./TextAreaInput";
import FileInput from "./FileInput";
import Select from "./Select";
import Signature from "./Signature";

interface IDictionary<TValue> {
    [id: string]: TValue;
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
    Text: {
        title: "Texte",
        component: Text,
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
