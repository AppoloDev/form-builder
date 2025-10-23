import { FC } from "react";
import { UniqueIdentifier } from "@dnd-kit/core";

import TextInput from "./TextInput";
import Paragraph from "./Paragaph";
import Select from "./Select";
import Title from "./Title";
import NumberInput from "./NumberInput";
import EmailInput from "./EmailInput";
import TelInput from "./TelInput";
import UrlInput from "./UrlInput";
import DateTimeInput from "./DateTimeInput";
import TextareaInput from "./TextareaInput";
import ChoiceGroupInput from "./ChoiceGroupInput";

export type BlockId = UniqueIdentifier;

export interface BaseBlockProps {
    id: BlockId;
    type: BlockType;
}

export interface TextInputProps extends BaseBlockProps {
    type: 'TextInput';
    label: string;
    placeHolder?: string;
    defaultValue?: string;
    helpText?: string;
    required?: boolean;
    readOnly?: boolean;
}

export interface NumberInputProps extends BaseBlockProps {
    type: 'NumberInput';
    label: string;
    helpText?: string;
    defaultValue?: string;
    readOnly?: boolean;
    required?: boolean;
    allowDecimal?: boolean;
    min?: number;
    max?: number;
    step?: number;
}

export interface EmailInputProps extends BaseBlockProps {
    type: 'EmailInput';
    label: string;
    helpText?: string;
    placeHolder?: string;
    defaultValue?: string;
    readOnly?: boolean;
    required?: boolean;
}

export interface TelInputProps extends BaseBlockProps {
    type: 'TelInput';
    label: string;
    placeHolder?: string;
    defaultValue?: string;
    helpText?: string;
    readOnly?: boolean;
    required?: boolean;
}

export interface UrlInputProps extends BaseBlockProps {
    type: 'UrlInput';
    label: string;
    placeHolder?: string;
    defaultValue?: string;
    helpText?: string;
    readOnly?: boolean;
    required?: boolean;
}

export interface TextareaInputProps extends BaseBlockProps {
    type: 'TextareaInput';
    label: string;
    placeHolder?: string;
    required?: boolean;
    helpText?: string;
    defaultValue?: string;
    readOnly?: boolean;
    rows?: number;
}

export interface DateTimeInputProps extends BaseBlockProps {
    type: 'DateTimeInput';
    label: string;
    helpText?: string;
    hasCurrentDate?: boolean;
    mode: 'date' | 'datetime-local' | 'time';
    readOnly?: boolean;
    required?: boolean;
    showDate?: boolean;
    showHour?: boolean;
}

export interface SelectProps extends BaseBlockProps {
    type: 'Select';
    label: string;
    options: Array<{ value: string; label: string }>;
    multiple?: boolean;
    checkCases?: boolean;
    required?: boolean;
    customOption?: boolean;
    helpText?: string;
}

export interface TitleProps extends BaseBlockProps {
    type: 'Title';
    text: string;
}

export interface ParagraphProps extends BaseBlockProps {
    type: 'Paragraph';
    text: string;
}

export interface ChoiceGroupProps extends BaseBlockProps {
    type: 'ChoiceGroup';
    label: string;
    helpText?: string;
    required?: boolean;
    inline?: boolean;
    multiple?: boolean;
    options: string[];
    followUps: Record<number, {
        enabled: boolean;
        type: 'text' | 'number' | 'date' | 'email';
        label: string;
        placeholder: string;
        parentId: string;
        optionIndex: number;
        optionValue?: string;
        open?: boolean;
    }>;
}

type BlockPropsByType = {
    TextInput: TextInputProps;
    NumberInput: NumberInputProps;
    EmailInput: EmailInputProps;
    TelInput: TelInputProps;
    UrlInput: UrlInputProps;
    TextareaInput: TextareaInputProps;
    DateTimeInput: DateTimeInputProps;
    Select: SelectProps;
    Title: TitleProps;
    Paragraph: ParagraphProps;
    ChoiceGroup: ChoiceGroupProps;
};

export type BlockType = keyof BlockPropsByType;

export type Block = BlockPropsByType[BlockType];

type BlockOf<T extends BlockType> = BlockPropsByType[T];

export interface BlockDefinition<T extends BlockType = BlockType> {
    id: string;
    type: T;
    title: string;
    tooltip: string;
    component: FC<any>;
    defaultProps: Omit<BlockOf<T>, 'id'>;
}

type BlockDefinitions = { [T in BlockType]: BlockDefinition<T> };

export const blockDefinitions: BlockDefinitions = {
    Title: {
        id: "drag-title",
        type: "Title",
        title: "Titre",
        tooltip: 'Insertion d\'un titre informatif ne nécessitant pas de réponse de l\'utilisateur.',
        component: Title,
        defaultProps: {
            type: "Title",
            text: "Titre"
        }
    },
    Paragraph: {
        id: "drag-paragraph",
        type: "Paragraph",
        title: "Paragraphe",
        tooltip: 'Insertion d\'un paragraphe informatif ne nécessitant pas de réponse de l\'utilisateur.',
        component: Paragraph,
        defaultProps: {
            type: "Paragraph",
            text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
        }
    },
    TextInput: {
        id: "drag-textinput",
        type: "TextInput",
        title: "Texte court",
        tooltip: 'Permet la saisie d\'un texte court.',
        component: TextInput,
        defaultProps: {
            type: "TextInput",
            label: "Texte court",
            placeHolder: "",
            defaultValue: "",
            required: false,
            readOnly: false,
            helpText: ""
        }
    },
    NumberInput: {
        id: "drag-numberinput",
        type: "NumberInput",
        title: "Numérique",
        tooltip: 'Saisie d\'une valeur numérique.',
        component: NumberInput,
        defaultProps: {
            type: "NumberInput",
            label: "Numérique",
            helpText: "",
            defaultValue: "",
            readOnly: false,
            required: false,
            allowDecimal: false
        }
    },
    EmailInput: {
        id: "drag-emailinput",
        type: "EmailInput",
        title: "Email",
        tooltip: 'Saisie d\'un email qui doit obligatoirement contenir un "@".',
        component: EmailInput,
        defaultProps: {
            type: "EmailInput",
            label: "Champ email",
            helpText: "",
            placeHolder: '',
            defaultValue: '',
            readOnly: false,
            required: false
        }
    },
    TelInput: {
        id: "drag-telinput",
        type: "TelInput",
        title: "Téléphone",
        tooltip: 'Saisie d\'un numéro de téléphone.',
        component: TelInput,
        defaultProps: {
            type: "TelInput",
            label: "Téléphone",
            placeHolder: '',
            defaultValue: '',
            helpText: "",
            readOnly: false,
            required: false
        }
    },
    UrlInput: {
        id: "drag-urlinput",
        type: "UrlInput",
        title: "Lien",
        tooltip: 'Saisie d\'un lien url.',
        component: UrlInput,
        defaultProps: {
            type: "UrlInput",
            label: "Lien",
            placeHolder: '',
            defaultValue: '',
            helpText: "",
            readOnly: false,
            required: false
        }
    },
    TextareaInput: {
        id: "drag-textareainput",
        type: "TextareaInput",
        title: "Zone de texte",
        tooltip: 'Saisie d\'une grande quantité de texte par l\'utilisateur.',
        component: TextareaInput,
        defaultProps: {
            type: "TextareaInput",
            label: "Zone de texte",
            placeHolder: "",
            required: false,
            helpText: '',
            defaultValue: '',
            readOnly: false,
            rows: 5
        }
    },
    DateTimeInput: {
        id: "drag-datetimeinput",
        type: "DateTimeInput",
        title: "Date",
        tooltip: 'Saisie d\'une date.',
        component: DateTimeInput,
        defaultProps: {
            type: "DateTimeInput",
            label: "Date",
            helpText: "",
            hasCurrentDate: false,
            mode: 'date',
            readOnly: false,
            required: false,
            showDate: false,
            showHour: false
        }
    },
    Select: {
        id: "drag-select",
        type: "Select",
        title: "Liste de choix",
        tooltip: 'Affichage d\'une liste sélectionnable par l\'utilisateur.',
        component: Select,
        defaultProps: {
            type: "Select",
            label: "Liste de choix",
            options: [],
            multiple: false,
            checkCases: false,
            required: false,
            customOption: false,
            helpText: ""
        }
    },
    ChoiceGroup: {
        id: "drag-choicegroup",
        type: "ChoiceGroup",
        title: "Choix (radio / cases)",
        tooltip: 'Affiche des boutons radio (sélection unique) ou des cases à cocher (sélections multiples).',
        component: ChoiceGroupInput,
        defaultProps: {
            type: "ChoiceGroup",
            label: "Groupe de choix",
            helpText: "",
            required: false,
            inline: false,
            multiple: false,
            options: [],
            followUps: {}
        }
    }
};

export const getAllBlockDefinitions = () => Object.values(blockDefinitions);
