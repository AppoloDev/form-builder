import { create } from "zustand";
import { arrayMove } from "@dnd-kit/sortable";
import { Block, BlockId } from "../components/Blocks/Definition";
import { UniqueIdentifier } from "@dnd-kit/core";

interface FormBuilderState {
    blocks: Block[];
    overId: string | null;
    activeId: UniqueIdentifier | null;

    setBlocks: (blocks: Block[]) => void;
    addBlock: (block: Block, index?: number) => void;
    removeBlock: (id: BlockId) => void;
    updateBlock: <T extends Block>(id: BlockId, updates: Partial<Omit<T, 'id' | 'type'>>) => void;

    setOverId: (id: string | null) => void;
    setActiveId: (id: UniqueIdentifier | null) => void;
    moveBlock: (activeId: string, overId: string) => void;
    moveBlockToEnd: (activeId: string) => void;
}

// Applies `recurse` to every nested Block[] a container block carries,
// whether it lives directly on the block (FieldSet/Repeatable) or per-option (ChoiceGroup).
const recurseIntoChildren = (block: Block, recurse: (children: Block[]) => Block[]): Block => {
    if (block.type === 'FieldSet' || block.type === 'Repeatable') {
        if (block.children.length === 0) return block;
        return { ...block, children: recurse(block.children) };
    }

    if (block.type === 'ChoiceGroup') {
        const nextOptions = block.options.map((option) =>
            option.children.length === 0 ? option : { ...option, children: recurse(option.children) }
        );
        return { ...block, options: nextOptions };
    }

    return block;
};

const updateBlockRecursive = (blocks: Block[], id: BlockId, updates: any): Block[] => {
    return blocks.map((block) => {
        if (block.id === id) {
            return { ...block, ...updates };
        }

        return recurseIntoChildren(block, (children) => updateBlockRecursive(children, id, updates));
    });
};

const removeBlockRecursive = (blocks: Block[], id: BlockId): Block[] => {
    const filteredBlocks = blocks.filter((block) => block.id !== id);

    return filteredBlocks.map((block) =>
        recurseIntoChildren(block, (children) => removeBlockRecursive(children, id))
    );
};
export const useFormBuilderStore = create<FormBuilderState>((set) => ({
    blocks: [],
    overId: null,
    activeId: null,

    setBlocks: (blocks) => {
        set({ blocks });
    },

    addBlock: (block, index) => {
        set((state) => {
            const newBlocks = [...state.blocks];

            if (typeof index === "number") {
                newBlocks.splice(index, 0, block);
            } else {
                newBlocks.push(block);
            }

            return { blocks: newBlocks };
        });
    },

    removeBlock: (id) => {
        set((state) => ({
            blocks: removeBlockRecursive(state.blocks, id)
        }));
    },

    updateBlock: (id, updates) => {
        set((state) => ({
            blocks: updateBlockRecursive(state.blocks, id, updates)
        }));
    },

    setOverId: (id) => {
        set({ overId: id });
    },

    setActiveId: (id) => {
        set({ activeId: id });
    },

    moveBlock: (activeId, overId) => {
        set((state) => {
            const oldIndex = state.blocks.findIndex((b) => b.id === activeId);
            const newIndex = state.blocks.findIndex((b) => b.id === overId);

            if (oldIndex === -1 || newIndex === -1) return state;

            return {
                blocks: arrayMove(state.blocks, oldIndex, newIndex)
            };
        });
    },

    moveBlockToEnd: (activeId) => {
        set((state) => {
            const oldIndex = state.blocks.findIndex((b) => b.id === activeId);

            if (oldIndex === -1) return state;

            return {
                blocks: arrayMove(state.blocks, oldIndex, state.blocks.length - 1)
            };
        });
    },
}));
