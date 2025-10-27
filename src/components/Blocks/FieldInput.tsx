import React, { ReactElement, ReactNode, useState, MouseEvent, useCallback, PropsWithChildren } from "react";
import { EditIcon } from "../Icons/EditIcon";
import { TrashIcon } from "../Icons/TrashIcon";
import { Tooltip } from "../Tooltip";
import { UniqueIdentifier } from "@dnd-kit/core";
import { ContextMenu, ContextMenuItem } from "../ContextMenu";
import { useBlockOperations } from "../../hooks/useBlockOperations";
import { AddMenu } from "../AddMenu";
import { BlockDefinition } from "./Definition";
import { createBlockFromTemplate } from "../../utilities/block.utiles";
import { useFormBuilderStore } from "../../stores/block.store";
import { PlusIcon } from "../Icons/PlusIcon";
import { EditableBlock } from "./EditableBlock";

type Props = { id: string;
    form: Record<string, any>;
    editionItems: ReactElement | ReactElement[]; } & PropsWithChildren;

export const FieldInput = ({id, editionItems, form, children}: Props) => {
    return (
        <div className="flex items-center gap-4">
            <EditableBlock id={id} editionItems={editionItems}>
                <div className="form_row border border-gray-200 rounded-lg p-4 flex-1">
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
