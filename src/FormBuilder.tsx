import React, { useEffect } from "react";
import { Block, BlockDefinition } from "./components/Blocks/Definition";
import { useFormBuilderStore } from "./stores/block.store";
import { createBlockFromTemplate } from "./utilities/block.utiles";
import { AddMenu } from "./components/AddMenu";
import { BLOCK_COMPONENTS } from "./components/BlockRegistry";
import { Empty } from "./components/Empty";

type Props = {
    onChange: (blocks: Block[]) => void
    json: Block[];
}

export const FormBuilder = ({onChange, json}: Props) => {
    const {blocks, addBlock, setBlocks} = useFormBuilderStore();

    const handleAddAt = (afterIndex: number, def: BlockDefinition) => {
        const newBlock = createBlockFromTemplate(def);
        addBlock(newBlock, afterIndex + 1);
    };

    useEffect(() => {
        setBlocks(json);
    }, []);

    useEffect(() => {
        console.log(blocks);
        onChange(blocks);
    }, [blocks]);

    return (
        <div className="border border-dashed border-gray-200 rounded-lg p-4 space-y-4">
            {blocks.length === 0 ? (
                <Empty onPick={(def) => handleAddAt(-1, def)}/>
            ) : (
                <>
                    {
                        blocks.map((block, idx) => {
                            const Component = BLOCK_COMPONENTS[block.type];

                            if (!Component) {
                                console.error(`Composant non trouvé pour le type: ${block.type}`);
                                return null;
                            }

                            return (
                                <Component {...block} key={idx}/>
                            );
                        })
                    }
                </>
            )}
        </div>
    )
        ;
};

export default FormBuilder;
