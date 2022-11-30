import { FC } from "react";
import TextInput from "./TextInput";
import FieldSet from "./FieldSet";
import Paragraph from "./Paragaph";
import TextAreaInput from "./TextAreaInput";
import FileInput from "./FileInput";
import Select from "./Select";
import Signature from "./Signature";
import Title from "./Title";
import Address from "./Address";
import NumberInput from "./NumberInput";
import EmailInput from "./EmailInput";
import TelInput from "./TelInput";
import UrlInput from "./UrlInput";
import HourMinuteInput from "./HourMinuteInput";

interface IDictionary<TValue> {
    [id: string]: TValue;
}

export interface Block {
    title: string;
    component: FC<any>;
    base: any
}

export const blocks: IDictionary<Block> = {
    Address: {
        title: "Adresse",
        component: Address,
        base: {
            label: "Adresse",
        }
    },
    TextInput: {
        title: "Champ texte",
        component: TextInput,
        base: {
            label: "Champ texte",
            placeHolder: "PlaceHolder",
            value: "",
            required: false,
        }
    },
    NumberInput: {
        title: "Champ numérique",
        component: NumberInput,
        base: {

        }
    },
    EmailInput: {
        title: "Champ email",
        component: EmailInput,
        base: {
            label: "Number input",
            helpText: "Text d'aide",
        }
    },
    TelInput: {
        title: "Champ téléphone",
        component: TelInput,
        base: {
            label: "Champ téléphone",
            helpText: "Text d'aide",
        }
    },
    UrlInput: {
        title: "Champ URL",
        component: UrlInput,
        base: {
            label: "Champ URL",
            helpText: "Text d'aide",
        }
    },
    HourMinuteInput: {
        title: "Champ heure : minute",
        component: HourMinuteInput,
        base: {

        }
    },
    FieldSet: {
        title: "FieldSet",
        component: FieldSet,
        base: {
            children: []
        }
    },
    Paragraph: {
        title: "Paragraphe",
        component: Paragraph,
        base: {
            text: "Paragraphe"
        }
    },
    Title: {
        title: "Titre",
        component: Title,
        base: {
            text: "Titre"
        }
    },
    TextAreaInput: {
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
        title: "Signature",
        component: Signature,
        base: {
            label: "Signature",
            required: false
        }
    }
};
