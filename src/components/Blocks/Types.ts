export type OptionProps = {
    value: string
    label: string
}

export type SelectProps = {
    label: string
    placeHolder: string
    tooltip: string
    maxItems: number
    multiple: boolean
    checkCases: boolean
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
    tooltip: string
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
    tooltip: string
    required: boolean
    editItem: (key: string, value: string | boolean) => void
}

export type TextAreaProps = {
    label: string
    placeHolder: string
    tooltip: string
    required: boolean
    editItem: (key: string, value: string | boolean) => void
}

export type AddressProps = {
    label: string
    tooltip: string
    required: boolean
    editItem: (key: string, value: string | boolean) => void
}

export type TextInputProps = {
    label: string
    placeHolder: string
    tooltip: string
    required: boolean
    editItem: (key: string, value: string | boolean) => void
}

export type TitleProps = {
    text: string
    editItem: (key: string, value: string) => void
}
