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
    removeItem: () => void
}

export type EditableBlockProps = {
    editionItems: JSX.Element | JSX.Element[]
    children: JSX.Element | JSX.Element[]
    className?: string
    removeItem: () => void
}

export type FieldSetProps = {
    children: JSX.Element[]
    editItem: (key: string, children: JSX.Element[]) => void
    removeItem: () => void
}

export type RepeatableProps = {
    children: JSX.Element[]
    maxItems: number | string
    editItem: (key: string, children: JSX.Element[] | string | boolean) => void
    removeItem: () => void
}

export type FileInputProps = {
    label: string
    helpText: string
    maxItems: number
    required: boolean
    value: string
    acceptedFile?: Array<{ label: string, value: string }>
    editItem: (key: string, value: string | boolean | OptionProps[]) => void
    removeItem: () => void
}

export type ParagraphProps = {
    text: string
    editItem: (key: string, value: string) => void
    removeItem: () => void
}

export type SignatureProps = {
    label: string
    helpText: string
    required: boolean
    editItem: (key: string, value: string | boolean) => void
    removeItem: () => void
}

export type TextAreaProps = {
    label: string
    placeHolder: string
    helpText: string
    required: boolean
    defaultValue: string
    readOnly: boolean
    rows: number
    editItem: (key: string, value: string | boolean) => void
    removeItem: () => void
}

export type AddressProps = {
    label: string
    helpText: string
    required: boolean
    editItem: (key: string, value: string | boolean) => void
    removeItem: () => void
}

export type TextInputProps = {
    label: string
    placeHolder: string
    helpText: string
    defaultValue: string
    readOnly: boolean
    required: boolean
    editItem: (key: string, value: string | boolean) => void
    removeItem: () => void
}

export type EmailInputProps = TextInputProps

export type HourMinuteInputProps = TextInputProps

export type TelInputProps = TextInputProps

export type UrlInputProps = TextInputProps

export type DateTimeInputProps = TextInputProps & {
    showDate: boolean
    showHour: boolean
}

export type NumberInputProps = {
    label: string
    helpText: string
    defaultValue: number
    readOnly: boolean
    required: boolean
    allowDecimal: boolean
    editItem: (key: string, value: string | boolean) => void
    removeItem: () => void
}

export type TitleProps = {
    text: string
    editItem: (key: string, value: string) => void
    removeItem: () => void
}

export type DndContextProps<T> = {
    children: [],
    setReorder: (items: T[]) => void,
    items: T[],
}
