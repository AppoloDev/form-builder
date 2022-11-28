export type OptionProps = {
    label: string
    isSelected: boolean
}

export type SelectProps = {
    label: string
    placeHolder: string
    helpText: string
    maxItems: number
    multiple: boolean
    checkCases: boolean
    customOption: boolean
    required: boolean
    options: OptionProps[]
    editItem: (key: string, value: string | boolean | OptionProps[]) => void
}

export type EditableBlockProps = {
    editionItems: JSX.Element | JSX.Element[]
    children: JSX.Element | JSX.Element[]
}

export type FieldSetProps = {
    children: JSX.Element[]
    editItem: (key: string, children: JSX.Element[]) => void
}

export type FileInputProps = {
    label: string
    helpText: string
    maxItems: number
    required: boolean
    editItem: (key: string, value: string | boolean) => void
}

export type ParagraphProps = {
    text: string
    editItem: (key: string, value: string) => void
}

export type SignatureProps = {
    label: string
    helpText: string
    required: boolean
    editItem: (key: string, value: string | boolean) => void
}

export type TextAreaProps = {
    label: string
    placeHolder: string
    helpText: string
    required: boolean
    editItem: (key: string, value: string | boolean) => void
}

export type AddressProps = {
    label: string
    helpText: string
    required: boolean
    editItem: (key: string, value: string | boolean) => void
}

export type TextInputProps = {
    label: string
    placeHolder: string
    helpText: string
    required: boolean
    editItem: (key: string, value: string | boolean) => void
}

export type TitleProps = {
    text: string
    editItem: (key: string, value: string) => void
}
