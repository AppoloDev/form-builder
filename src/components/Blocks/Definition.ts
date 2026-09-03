import { UniqueIdentifier } from "@dnd-kit/core";
import { labelToName } from "../../utilities/string.utiles";

export type BlockId = UniqueIdentifier;

export interface BaseBlockProps {
    id: BlockId;
    type: BlockType;
}

export interface TextInputProps extends BaseBlockProps {
    type: 'TextInput';
    label: string;
    name: string;
    placeHolder?: string;
    helpText?: string;
    required?: boolean;
    readOnly?: boolean;
}


export interface TextareaInputProps extends BaseBlockProps {
    type: 'TextareaInput';
    label: string;
    name: string;
    placeHolder?: string;
    required?: boolean;
    helpText?: string;
    readOnly?: boolean;
    rows?: number;
}

export interface TitleProps extends BaseBlockProps {
    type: 'Title';
    text: string;
    heading: string;
}

export interface ParagraphProps extends BaseBlockProps {
    type: 'Paragraph';
    text: string;
}

export interface ChoiceGroupProps extends BaseBlockProps {
    type: 'ChoiceGroup';
    label: string;
    name: string;
    helpText?: string;
    required?: boolean;
    inline?: boolean;
    multiple?: boolean;
    options: OptionItem[];
}

export interface NumberInputProps extends BaseBlockProps {
    type: 'NumberInput';
    label: string;
    name: string;
    placeHolder?: string;
    helpText?: string;
    required?: boolean;
    min?: string;
    max?: string;
    step?: string;
}

export interface EmailInputProps extends BaseBlockProps {
    type: 'EmailInput';
    label: string;
    name: string;
    placeHolder?: string;
    helpText?: string;
    required?: boolean;
}

export interface TelInputProps extends BaseBlockProps {
    type: 'TelInput';
    label: string;
    name: string;
    placeHolder?: string;
    helpText?: string;
    required?: boolean;
}

export interface UrlInputProps extends BaseBlockProps {
    type: 'UrlInput';
    label: string;
    name: string;
    placeHolder?: string;
    helpText?: string;
    required?: boolean;
}

export interface DateTimeInputProps extends BaseBlockProps {
    type: 'DateTimeInput';
    label: string;
    name: string;
    placeHolder?: string;
    helpText?: string;
    required?: boolean;
    mode?: string;
}

export interface AddressInputProps extends BaseBlockProps {
    type: 'AddressInput';
    label: string;
    name: string;
    placeHolder?: string;
    helpText?: string;
    required?: boolean;
}

export interface FileInputProps extends BaseBlockProps {
    type: 'FileInput';
    label: string;
    name: string;
    helpText?: string;
    required?: boolean;
    acceptedFile?: string;
    allowMultiple?: boolean;
}

export interface HourMinuteInputProps extends BaseBlockProps {
    type: 'HourMinuteInput';
    label: string;
    name: string;
    placeHolder?: string;
    helpText?: string;
    required?: boolean;
}

export interface SelectProps extends BaseBlockProps {
    type: 'Select';
    label: string;
    name: string;
    helpText?: string;
    required?: boolean;
    multiple?: boolean;
    options: string[];
}

export interface SignatureProps extends BaseBlockProps {
    type: 'Signature';
    label: string;
    name: string;
    helpText?: string;
    required?: boolean;
}

export interface FieldSetProps extends BaseBlockProps {
    type: 'FieldSet';
    children: Block[];
}

export interface RepeatableProps extends BaseBlockProps {
    type: 'Repeatable';
    children: Block[];
    maxItems?: number;
}

export type OptionItem = {
    id: string;
    label: string;
    value: string;
    showConditionalField: boolean;
    children: Block[];
};

export type BlockPropsByType = {
    Title: TitleProps;
    Paragraph: ParagraphProps;
    TextInput: TextInputProps;
    TextareaInput: TextareaInputProps;
    ChoiceGroup: ChoiceGroupProps;
    NumberInput: NumberInputProps;
    EmailInput: EmailInputProps;
    TelInput: TelInputProps;
    UrlInput: UrlInputProps;
    DateTimeInput: DateTimeInputProps;
    AddressInput: AddressInputProps;
    FileInput: FileInputProps;
    HourMinuteInput: HourMinuteInputProps;
    Select: SelectProps;
    Signature: SignatureProps;
    FieldSet: FieldSetProps;
    Repeatable: RepeatableProps;
};

export type BlockType = keyof BlockPropsByType;

export type Block = BlockPropsByType[BlockType];

type BlockOf<T extends BlockType> = BlockPropsByType[T];

export interface BlockDefinition<T extends BlockType = BlockType> {
    id: string;
    type: T;
    title: string;
    description: string;
    defaultProps: Omit<BlockOf<T>, 'id'>;
}

type BlockDefinitions = { [T in BlockType]: BlockDefinition<T> };

export const blockDefinitions: BlockDefinitions = {
    Title: {
        id: "drag-title",
        type: "Title",
        title: "Titre",
        description: 'Insertion d\'un titre informatif ne nécessitant pas de réponse de l\'utilisateur.',
        defaultProps: {
            type: "Title",
            text: "Titre",
            heading: 'h1'
        }
    },
    Paragraph: {
        id: "drag-paragraph",
        type: "Paragraph",
        title: "Paragraphe",
        description: 'Insertion d\'un paragraphe informatif ne nécessitant pas de réponse de l\'utilisateur.',
        defaultProps: {
            type: "Paragraph",
            text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
        }
    },
    TextInput: {
        id: "drag-textinput",
        type: "TextInput",
        title: "Texte court",
        description: 'Permet la saisie d\'un texte court.',
        defaultProps: {
            type: "TextInput",
            label: "Libellé",
            name: labelToName("Libellé"),
            placeHolder: "",
            required: false,
            helpText: ""
        }
    },
    TextareaInput: {
        id: "drag-textareainput",
        type: "TextareaInput",
        title: "Zone de texte",
        description: 'Saisie d\'une grande quantité de texte par l\'utilisateur.',
        defaultProps: {
            type: "TextareaInput",
            label: "Libellé",
            name: labelToName("Libellé"),
            placeHolder: "",
            required: false,
            helpText: '',
            rows: 5
        }
    },
    ChoiceGroup: {
        id: "drag-choicegroup",
        type: "ChoiceGroup",
        title: "Choix (radio / cases)",
        description: 'Affiche des boutons radio (sélection unique) ou des cases à cocher (sélections multiples).',
        defaultProps: {
            type: "ChoiceGroup",
            label: "Libellé",
            name: labelToName("Libellé"),
            helpText: "",
            required: false,
            inline: false,
            multiple: false,
            options: [],
        }
    },
    NumberInput: {
        id: "drag-numberinput",
        type: "NumberInput",
        title: "Nombre",
        description: 'Permet la saisie d\'une valeur numérique, avec bornes min/max optionnelles.',
        defaultProps: {
            type: "NumberInput",
            label: "Libellé",
            name: labelToName("Libellé"),
            placeHolder: "",
            required: false,
            helpText: "",
            min: "",
            max: "",
            step: "",
        }
    },
    EmailInput: {
        id: "drag-emailinput",
        type: "EmailInput",
        title: "Email",
        description: 'Permet la saisie d\'une adresse email.',
        defaultProps: {
            type: "EmailInput",
            label: "Libellé",
            name: labelToName("Libellé"),
            placeHolder: "",
            required: false,
            helpText: "",
        }
    },
    TelInput: {
        id: "drag-telinput",
        type: "TelInput",
        title: "Téléphone",
        description: 'Permet la saisie d\'un numéro de téléphone.',
        defaultProps: {
            type: "TelInput",
            label: "Libellé",
            name: labelToName("Libellé"),
            placeHolder: "",
            required: false,
            helpText: "",
        }
    },
    UrlInput: {
        id: "drag-urlinput",
        type: "UrlInput",
        title: "URL",
        description: 'Permet la saisie d\'une adresse web.',
        defaultProps: {
            type: "UrlInput",
            label: "Libellé",
            name: labelToName("Libellé"),
            placeHolder: "",
            required: false,
            helpText: "",
        }
    },
    DateTimeInput: {
        id: "drag-datetimeinput",
        type: "DateTimeInput",
        title: "Date / Heure",
        description: 'Permet la saisie d\'une date, d\'une heure, ou des deux.',
        defaultProps: {
            type: "DateTimeInput",
            label: "Libellé",
            name: labelToName("Libellé"),
            placeHolder: "",
            required: false,
            helpText: "",
            mode: "datetime-local",
        }
    },
    AddressInput: {
        id: "drag-addressinput",
        type: "AddressInput",
        title: "Adresse",
        description: 'Permet la saisie d\'une adresse postale.',
        defaultProps: {
            type: "AddressInput",
            label: "Libellé",
            name: labelToName("Libellé"),
            placeHolder: "Indiquez un lieu…",
            required: false,
            helpText: "",
        }
    },
    FileInput: {
        id: "drag-fileinput",
        type: "FileInput",
        title: "Fichier",
        description: 'Permet le dépôt d\'un ou plusieurs fichiers.',
        defaultProps: {
            type: "FileInput",
            label: "Libellé",
            name: labelToName("Libellé"),
            required: false,
            helpText: "",
            acceptedFile: "image",
            allowMultiple: false,
        }
    },
    HourMinuteInput: {
        id: "drag-hourminuteinput",
        type: "HourMinuteInput",
        title: "Heure",
        description: 'Permet la saisie d\'une heure (HH:MM).',
        defaultProps: {
            type: "HourMinuteInput",
            label: "Libellé",
            name: labelToName("Libellé"),
            placeHolder: "",
            required: false,
            helpText: "",
        }
    },
    Select: {
        id: "drag-select",
        type: "Select",
        title: "Liste déroulante",
        description: 'Affiche une liste déroulante d\'options, à choix unique ou multiple.',
        defaultProps: {
            type: "Select",
            label: "Libellé",
            name: labelToName("Libellé"),
            helpText: "",
            required: false,
            multiple: false,
            options: [],
        }
    },
    Signature: {
        id: "drag-signature",
        type: "Signature",
        title: "Signature",
        description: 'Affiche une zone dédiée à la signature de l\'utilisateur.',
        defaultProps: {
            type: "Signature",
            label: "Libellé",
            name: labelToName("Libellé"),
            helpText: "",
            required: false,
        }
    },
    FieldSet: {
        id: "drag-fieldset",
        type: "FieldSet",
        title: "Groupe de champs",
        description: 'Regroupe plusieurs blocs à l\'intérieur d\'un même ensemble.',
        defaultProps: {
            type: "FieldSet",
            children: [],
        }
    },
    Repeatable: {
        id: "drag-repeatable",
        type: "Repeatable",
        title: "Répétable",
        description: 'Permet à l\'utilisateur de répéter un ensemble de blocs plusieurs fois.',
        defaultProps: {
            type: "Repeatable",
            children: [],
            maxItems: 1,
        }
    }
};

export const getAllBlockDefinitions = () => Object.values(blockDefinitions);
