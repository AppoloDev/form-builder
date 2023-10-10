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
    tooltip: string;
    component: FC<any>;
    base: any
}

export const blocks: IDictionary<Block> = {
    "FieldSet": {
        title: "Groupe de champs",
        tooltip: 'Permet de regrouper visuellement des champs dans une encadré.',
        component: FieldSet,
        base: {
            id: "",
            children: []
        }
    },
    "Title": {
        title: "Titre",
        tooltip: 'Insertion d\'un titre informatif ne nécessitant pas de réponse de l\'utilisateur.',
        component: Title,
        base: {
            id: "",
            text: "Titre"
        }
    },
    "Paragraph": {
        title: "Texte de présentation",
        tooltip: 'Insertion d\'un paragraphe informatif ne nécessitant pas de réponse de l\'utilisateur.',
        component: Paragraph,
        base: {
            id: "",
            text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
        }
    },
    "Address": {
        title: "Adresse",
        tooltip: 'Permet d\'ajouter une adresse postale.',
        component: Address,
        base: {
            id: "",
            label: "Adresse",
            helpText: "",
            required: false,
        }
    },
    "TextInput": {
        title: "Texte court",
        tooltip: 'Permet la saisie d\'un texte court.',
        component: TextInput,
        base: {
            id: "",
            label: "Texte court",
            placeHolder: "",
            defaultValue: "",
            required: false,
            readOnly: false,
            helpText: ""
        }
    },
    "NumberInput": {
        title: "Numérique",
        tooltip: 'Saisie d\'une valeur numérique.',
        component: NumberInput,
        base: {
            id: "",
            label: "Numérique",
            helpText: "",
            defaultValue: "",
            readOnly: false,
            required: false,
            allowDecimal: false
        }
    },
    "EmailInput": {
        title: "Email",
        tooltip: 'Saisie d\'un email qui doit obligatoirement contenir un "@".',
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
        title: "Téléphone",
        tooltip: 'Saisie d\'un numéro de téléphone.',
        component: TelInput,
        base: {
            id: "",
            label: "Téléphone",
            placeHolder: '',
            defaultValue: '',
            helpText: "",
            readOnly: false,
            required: false
        }
    },
    "UrlInput": {
        title: "Lien",
        tooltip: 'Saisie d\'un lien url.',
        component: UrlInput,
        base: {
            id: "",
            label: "Lien",
            placeHolder: '',
            defaultValue: '',
            helpText: "",
            readOnly: false,
            required: false
        }
    },
    "TextAreaInput": {
        title: "Zone de texte",
        tooltip: 'Saisie d\'une grande quantité de texte par l\'utilisateur.',
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
        tooltip: 'Permet de joindre un ou des fichiers au formulaire.',
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
        tooltip: 'Saisie d\'une date.',
        component: DateTimeInput,
        base: {
            id: "",
            label: "Date",
            helpText: "",
            hasCurrentDate: false,
            readOnly: false,
            required: false,
            showDate: false,
            showHour: false,
        }
    },
    "Select": {
        title: "Liste de choix",
        tooltip: 'Affichage d\'une liste sélectionnable par l\'utilisateur.',
        component: Select,
        base: {
            id: "",
            label: "Liste de choix",
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
        tooltip: 'Je suis une description',
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
        tooltip: 'Affichage d\'une zone permettant à l\'utilisateur de dessiner sa signature.',
        component: Signature,
        base: {
            id: "",
            label: "Signature",
            helpText: "",
            required: false
        }
    },
    "Repeatable": {
        title: "Répétition de champs",
        tooltip: 'Permet de répéter un ensemble de champs configurable comme le reste du formulaire.',
        component: Repeatable,
        base: {
            id: "",
            children: [],
            maxItems: 1
        }
    },
};
