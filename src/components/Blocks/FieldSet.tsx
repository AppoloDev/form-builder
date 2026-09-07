import { FieldSetProps, Block, BlockDefinition } from "./Definition";
import { useFormBuilderStore } from "../../stores/block.store";
import { EditableBlock } from "./EditableBlock";
import { Empty } from "../Empty";
import { AddMenu } from "../AddMenu";
import { ChildrenSorter } from "./ChildrenSorter";
import { createBlockFromTemplate } from "../../utilities/block.utiles";
import { Button } from "@/src/components/ui/button";

const FieldSet = ({id, children}: FieldSetProps) => {
    const {updateBlock} = useFormBuilderStore();

    const addChild = (def: BlockDefinition, overrides?: Record<string, any>) => {
        const newBlock = createBlockFromTemplate(def, overrides);
        updateBlock(id, {children: [...children, newBlock]});
    };

    const handleReorder = (next: Block[]) => {
        updateBlock(id, {children: next});
    };

    return (
        <EditableBlock id={id}>
            <div className="space-y-3 rounded-lg border border-border p-4 flex-1">
                {children.length === 0 ? (
                    <Empty onPick={addChild}/>
                ) : (
                    <>
                        <ChildrenSorter childrenBlocks={children} onReorder={handleReorder}/>

                        <div className="pt-1">
                            <AddMenu onPick={addChild}>
                                <Button type="button" size="sm">
                                    Ajouter un bloc
                                </Button>
                            </AddMenu>
                        </div>
                    </>
                )}
            </div>
        </EditableBlock>
    );
};

export default FieldSet;
