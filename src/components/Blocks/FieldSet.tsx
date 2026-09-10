import { FieldSetProps, Block, BlockDefinition, NESTABLE_BLOCK_TYPES } from "./Definition";
import { useFormBuilderStore } from "../../stores/block.store";
import { EditableBlock } from "./EditableBlock";
import { Empty } from "../Empty";
import { ChildrenSorter } from "./ChildrenSorter";
import { createBlockFromTemplate } from "../../utilities/block.utiles";

type Props = FieldSetProps & { preview?: boolean };

const FieldSet = ({id, type, children, preview}: Props) => {
    const {updateBlock} = useFormBuilderStore();

    const addChildAt = (index: number, def: BlockDefinition, overrides?: Record<string, any>) => {
        const newBlock = createBlockFromTemplate(def, overrides);
        const nextChildren = [...children];
        nextChildren.splice(index + 1, 0, newBlock);
        updateBlock(id, {children: nextChildren});
    };

    const handleReorder = (next: Block[]) => {
        updateBlock(id, {children: next});
    };

    return (
        <EditableBlock id={id} type={type} preview={preview}>
            <div className={preview ? "space-y-4" : "space-y-4 rounded-lg border border-border bg-muted/30 py-8 px-8 transition-colors"}>
                {children.length === 0 ? (
                    <Empty onPick={(def, overrides) => addChildAt(-1, def, overrides)} allowTypes={NESTABLE_BLOCK_TYPES}/>
                ) : (
                    <div className="pl-20">
                        <ChildrenSorter
                            childrenBlocks={children}
                            onReorder={handleReorder}
                            onAddAfter={addChildAt}
                            allowTypes={NESTABLE_BLOCK_TYPES}
                        />
                    </div>
                )}
            </div>
        </EditableBlock>
    );
};

export default FieldSet;
