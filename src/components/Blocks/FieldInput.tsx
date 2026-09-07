import React, { ReactElement, PropsWithChildren } from "react";
import { EditableBlock } from "./EditableBlock";

type Props = { id: string;
    form: Record<string, any>;
    editionItems: ReactElement | ReactElement[];
    preview?: boolean; } & PropsWithChildren;

export const FieldInput = ({id, editionItems, form, children, preview}: Props) => {
    return (
        <EditableBlock id={id} editionItems={editionItems} preview={preview}>
            <div className={preview ? "flex flex-col gap-2" : "flex flex-col gap-2 rounded-lg p-2 transition-colors group-hover:bg-muted/50"}>
                {form.label && (
                    <label className="text-sm font-medium" htmlFor={id}>
                        {form.label}
                        {form.required && <span className="text-destructive pl-0.5">*</span>}
                    </label>
                )}

                {children}

                {form.helpText && (
                    <div className="text-sm text-muted-foreground">
                        {form.helpText}
                    </div>
                )}
            </div>
        </EditableBlock>
    )
};
