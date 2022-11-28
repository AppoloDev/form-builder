import { OptionProps } from "../Blocks/Types";

export type CheckboxEditionProps = {
    label: string
    checked: boolean
    editItem: (value: boolean) => void
}

export type EditionModalProps = {
    visible: boolean
    closeModal: () => void
    children: JSX.Element | JSX.Element[]
}

export type NumberEditionProps = {
    label: string
    value: number
    editItem: (value: string | boolean) => void
}

export type TextAreaEditionProps = {
    label: string
    value: string
    editItem: (value: string) => void
}

export type TextEditionProps = {
    label: string
    value: string
    editItem: (value: string) => void
}

export type SelectOptionEditionProps = {
    label: string
    options: OptionProps[]
    editItem: (value: OptionProps[]) => void
}
