import { RepeatableProps, Block, BlockDefinition, NESTABLE_BLOCK_TYPES } from "./Definition";
import { useFormBuilderStore } from "../../stores/block.store";
import { EditableBlock } from "./EditableBlock";
import { Empty } from "../Empty";
import { ChildrenSorter } from "./ChildrenSorter";
import { createBlockFromTemplate } from "../../utilities/block.utiles";
import { TextEdition } from "../Edition/TextEdition";

type Props = RepeatableProps & { preview?: boolean };

const Repeatable = ({id, type, children, maxItems, preview}: Props) => {
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

    const handleMaxItemsChange = (v: string) => {
        updateBlock(id, {maxItems: Number(v) || 0});
    };

    return (
        <EditableBlock id={id} type={type} preview={preview} editionItems={[
            <TextEdition
                key="maxItems"
                label="Nombre maximum de répétitions"
                type="number"
                helpText="0 = illimité"
                value={String(maxItems ?? 0)}
                editItem={handleMaxItemsChange}
            />,
        ]}>
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

export default Repeatable;
