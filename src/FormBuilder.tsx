import React, { useEffect } from "react";
import { Block, BlockDefinition } from "./components/Blocks/Definition";
import { useFormBuilderStore } from "./stores/block.store";
import { createBlockFromTemplate } from "./utilities/block.utiles";
import { AddMenu } from "./components/AddMenu";
import { BLOCK_COMPONENTS } from "./components/BlockRegistry";

type Props = {
    onChange: (blocks: Block[]) => void
    json: Block[];
}

export const FormBuilder = ({onChange, json}: Props) => {
    const { blocks, addBlock, setBlocks } = useFormBuilderStore();

    const handleAddAt = (afterIndex: number, def: BlockDefinition) => {
        const newBlock = createBlockFromTemplate(def as unknown as Block);
        addBlock(newBlock, afterIndex + 1);
    };

    useEffect(() => {
        console.log(json);
        setBlocks(json);
    }, [])

    useEffect(() => {
        onChange(blocks)
    }, [blocks]);

    return (
        <div className="flex h-screen bg-gray-50">
            <main className="flex-1 p-8 overflow-y-auto">
                <div className="max-w-3xl mx-auto">
                    <div className="mb-3">
                        <AddMenu
                            onPick={(def) => handleAddAt(-1, def)}
                            placeholder="Rechercher un type…"
                            trigger={
                                <button
                                    type="button"
                                    className="inline-flex items-center gap-2 text-sm px-3 py-1.5 rounded-lg border border-gray-300 bg-white hover:bg-gray-50"
                                >
                                    <span className="text-lg leading-none">＋</span> Ajouter un bloc
                                </button>
                            }
                        />
                    </div>

                    {blocks.length === 0 ? (
                        <div className="min-h-[240px] border-2 border-dashed rounded-xl p-8 flex items-center justify-center bg-white border-gray-300">
                            <div className="text-center text-gray-400">Aucun bloc pour l'instant.</div>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {blocks && blocks.map((b, idx) => {
                                const Component = BLOCK_COMPONENTS[b.type as keyof typeof BLOCK_COMPONENTS];

                                if (!Component) {
                                    console.error(`Component not found for type: ${b.type}`);
                                    return null;
                                }

                                return (
                                    <div key={b.id} className="group relative">
                                        <div className="absolute -right-3 -top-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <AddMenu
                                                onPick={(def) => handleAddAt(idx, def)}
                                                placeholder="Rechercher un type…"
                                            />
                                        </div>

                                        <div className="bg-white border-2 border-gray-200 rounded-lg shadow-sm p-4">
                                            <Component {...b} />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default FormBuilder;
