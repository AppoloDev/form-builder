import { OptionProps } from "../Blocks/Types";

export type CheckboxEditionProps = {
    label: string
    helpText?: string
    checked: boolean
    disabled?: boolean
    editItem: (value: boolean) => void
}

export type EditionModalProps = {
    visible: boolean
    closeModal: () => void
    children: JSX.Element | JSX.Element[]
}

export type NumberEditionProps = {
    label: string
    value: number | string
    helpText?: string
    min?: number
    max?: number
    editItem: (value: string | boolean) => void
}

export type TextAreaEditionProps = {
    label: string
    value: string
    helpText?: string
    rows?: number
    editItem: (value: string) => void
}

export type TextEditionProps = {
    label: string
    value: string
    helpText?: string
    editItem: (value: string) => void
}

export type SelectEditionProps = {
    label: string
    value: string
    options: Array<{ label: string, value: string }>
    editItem: (value: any) => void
}

export type SelectOptionEditionProps = {
    label: string
    options: OptionProps[]
    multiple: boolean
    editItem: (value: OptionProps[]) => void
}
