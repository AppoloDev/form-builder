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
import DateTimeInput from "./DateTimeInput";
import Repeatable from "./Repeatable";

interface IDictionary<TValue> {
    [id: string]: TValue;
}

export interface Block {
    title: string;
    component: FC<any>;
    base: any
}

export const blocks: IDictionary<Block> = {
    "Address": {
        title: "Adresse",
        component: Address,
        base: {
            id: "",
            label: "Adresse",
            helpText: "",
            required: false,
        }
    },
    "TextInput": {
        title: "Champ texte",
        component: TextInput,
        base: {
            id: "",
            label: "Champ texte",
            placeHolder: "",
            defaultValue: "",
            required: false,
            readOnly: false,
            helpText: ""
        }
    },
    "NumberInput": {
        title: "Champ numérique",
        component: NumberInput,
        base: {
            id: "",
            label: "Champ numérique",
            helpText: "",
            defaultValue: "",
            readOnly: false,
            required: false,
            allowDecimal: false
        }
    },
    "EmailInput": {
        title: "Champ email",
        component: EmailInput,
        base: {
            id: "",
            label: "Champ email",
            helpText: "",
            placeHolder: '',
            defaultValue: '',
            readOnly: false,
            required: false
        }
    },
    "TelInput": {
        title: "Champ téléphone",
        component: TelInput,
        base: {
            id: "",
            label: "Champ téléphone",
            placeHolder: '',
            defaultValue: '',
            helpText: "",
            readOnly: false,
            required: false
        }
    },
    "UrlInput": {
        title: "Champ URL",
        component: UrlInput,
        base: {
            id: "",
            label: "Champ URL",
            placeHolder: '',
            defaultValue: '',
            helpText: "",
            readOnly: false,
            required: false
        }
    },
    "FieldSet": {
        title: "FieldSet",
        component: FieldSet,
        base: {
            id: "",
            children: []
        }
    },
    "Paragraph": {
        title: "Paragraphe",
        component: Paragraph,
        base: {
            id: "",
            text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
        }
    },
    "Title": {
        title: "Titre",
        component: Title,
        base: {
            id: "",
            text: "Titre"
        }
    },
    "TextAreaInput": {
        title: "Zone de texte",
        component: TextAreaInput,
        base: {
            id: "",
            label: "Zone de texte",
            placeHolder: "",
            required: false,
            helpText: '',
            defaultValue: '',
            readOnly: false,
            rows: 5
        }
    },
    "FileInput": {
        title: "Fichier",
        component: FileInput,
        base: {
            id: "",
            label: "Fichier",
            helpText: "",
            maxItems: 1,
            required: false,
            acceptedFile: "image"
        }
    },
    "DateTimeInput": {
        title: "Date",
        component: DateTimeInput,
        base: {
            id: "",
            label: "Champ Date & Heure",
            helpText: "",
            hasCurrentDate: false,
            readOnly: false,
            required: false,
            showDate: false,
            showHour: false,
        }
    },
    "Select": {
        title: "Liste à choix",
        component: Select,
        base: {
            id: "",
            label: "Sélecteur",
            placeHolder: "",
            options: [],
            multiple: false,
            checkCases: false,
            required: false,
            customOption: false,
            helpText: ""
        }
    },
    /*"HourMinuteInput": {
        title: "Champ heure : minute",
        component: HourMinuteInput,
        base: {
            id: "",
            label: "Champ heure : minute",
            helpText: "",
            defaultValue: "",
            readOnly: false,
            required: false
        }
    },*/
    "Signature": {
        title: "Signature",
        component: Signature,
        base: {
            id: "",
            label: "Signature",
            helpText: "",
            required: false
        }
    },
    "Repeatable": {
        title: "Répétable",
        component: Repeatable,
        base: {
            id: "",
            children: [],
            maxItems: 1
        }
    },
};
