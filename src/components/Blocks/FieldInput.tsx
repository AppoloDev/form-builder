import React, { ReactElement, PropsWithChildren } from "react";
import { EditableBlock } from "./EditableBlock";

type Props = { id: string;
    form: Record<string, any>;
    editionItems: ReactElement | ReactElement[]; } & PropsWithChildren;

export const FieldInput = ({id, editionItems, form, children}: Props) => {
    return (
        <div className="flex items-center gap-4">
            <EditableBlock id={id} editionItems={editionItems}>
                <div className="form_row border border-border rounded-lg p-4 flex-1">
                    {form.label && (
                        <label className={`${form.required ? "required" : ""} `} htmlFor={id}>
                            {form.label}
                        </label>
                    )}

                    {children}

                    {form.helpText && (
                        <div className="help-text">
                            {form.helpText}
                        </div>
                    )}
                </div>
            </EditableBlock>
        </div>
    )
};
