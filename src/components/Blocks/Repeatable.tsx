import { RepeatableProps, Block, BlockDefinition, NESTABLE_BLOCK_TYPES } from "./Definition";
import { useFormBuilderStore } from "../../stores/block.store";
import { EditableBlock } from "./EditableBlock";
import { Empty } from "../Empty";
import { AddMenu } from "../AddMenu";
import { ChildrenSorter } from "./ChildrenSorter";
import { createBlockFromTemplate } from "../../utilities/block.utiles";
import { TextEdition } from "../Edition/TextEdition";

type Props = RepeatableProps & { preview?: boolean; isChildBlock?: boolean };

const Repeatable = ({id, type, children, maxItems, preview, isChildBlock}: Props) => {
    const {updateBlock} = useFormBuilderStore();

    const addChild = (def: BlockDefinition, overrides?: Record<string, any>) => {
        const newBlock = createBlockFromTemplate(def, overrides);
        updateBlock(id, {children: [...children, newBlock]});
    };

    const handleReorder = (next: Block[]) => {
        updateBlock(id, {children: next});
    };

    const handleMaxItemsChange = (v: string) => {
        updateBlock(id, {maxItems: Number(v) || 0});
    };

    return (
        <EditableBlock id={id} type={type} preview={preview} isChildBlock={isChildBlock} editionItems={[
            <TextEdition
                key="maxItems"
                label="Nombre maximum de répétitions"
                type="number"
                helpText="0 = illimité"
                value={String(maxItems ?? 0)}
                editItem={handleMaxItemsChange}
            />,
        ]}>
            <div className={preview ? "space-y-4" : "space-y-4 p-4 border-l-4 border-border pl-4 transition-colors"}>
                {children.length === 0 ? (
                    <Empty onPick={addChild} allowTypes={NESTABLE_BLOCK_TYPES}/>
                ) : (
                    <div className="relative pb-3">
                        <ChildrenSorter childrenBlocks={children} onReorder={handleReorder}/>

                        <div className="absolute -right-3 -bottom-3 z-10">
                            <AddMenu onPick={addChild} placeholder="Rechercher un type…" allowTypes={NESTABLE_BLOCK_TYPES}>
                                <button
                                    type="button"
                                    className="rounded-full border border-input bg-primary shadow-sm p-2 hover:bg-primary/80 cursor-pointer transition-colors"
                                    title="Ajouter un bloc"
                                >
                                    <svg width="16" height="16" viewBox="0 0 24 24"
                                         className="text-primary-foreground">
                                        <path fill="currentColor"
                                              d="M11 11V5h2v6h6v2h-6v6h-2v-6H5v-2z"/>
                                    </svg>
                                </button>
                            </AddMenu>
                        </div>
                    </div>
                )}
            </div>
        </EditableBlock>
    );
};

export default Repeatable;
