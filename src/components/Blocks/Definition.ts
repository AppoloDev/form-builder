import { UniqueIdentifier } from "@dnd-kit/core";

export type BlockId = UniqueIdentifier;

export interface BaseBlockProps {
    id: BlockId;
    type: BlockType;
}

export interface TextInputProps extends BaseBlockProps {
    type: 'TextInput';
    label: string;
    placeHolder?: string;
    helpText?: string;
    required?: boolean;
    readOnly?: boolean;
}


export interface TextareaInputProps extends BaseBlockProps {
    type: 'TextareaInput';
    label: string;
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
    helpText?: string;
    required?: boolean;
    inline?: boolean;
    multiple?: boolean;
    options: string[];
}

export type BlockPropsByType = {
    Title: TitleProps;
    Paragraph: ParagraphProps;
    TextInput: TextInputProps;
    TextareaInput: TextareaInputProps;
    ChoiceGroup: ChoiceGroupProps;
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
            placeHolder: "",
            required: false,
            helpText: "Lorem ipsum dolor sit amet, consectetur adipiscing elit"
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
            placeHolder: "",
            required: false,
            helpText: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
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
            helpText: "Lorem ipsum dolor sit amet, consectetur adipiscing elit",
            required: false,
            inline: false,
            multiple: false,
            options: [],
        }
    }
};

export const getAllBlockDefinitions = () => Object.values(blockDefinitions);
