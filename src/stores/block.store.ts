import { create } from "zustand";
import { arrayMove } from "@dnd-kit/sortable";
import { Block, BlockId } from "../components/Blocks/Definition";
import { UniqueIdentifier } from "@dnd-kit/core";

// ============================================
// TYPES
// ============================================

interface FormBuilderState {
    // State
    blocks: Block[];
    overId: string | null;
    activeId: UniqueIdentifier | null;

    // Actions simples
    setBlocks: (blocks: Block[]) => void;
    addBlock: (block: Block, index?: number) => void;
    removeBlock: (id: BlockId) => void;
    updateBlock: <T extends Block>(id: BlockId, updates: Partial<Omit<T, 'id' | 'type'>>) => void;

    // DnD
    setOverId: (id: string | null) => void;
    setActiveId: (id: UniqueIdentifier | null) => void;
    moveBlock: (activeId: string, overId: string) => void;
    moveBlockToEnd: (activeId: string) => void;
}

// ============================================
// STORE
// ============================================

export const useFormBuilderStore = create<FormBuilderState>((set, get) => ({
    // État initial
    blocks: [],
    overId: null,
    activeId: null,

    // Définir tous les blocs
    setBlocks: (blocks) => {
        set({ blocks });
    },

    // Ajouter un bloc
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

    // Supprimer un bloc
    removeBlock: (id) => {
        set((state) => ({
            blocks: state.blocks.filter((b) => b.id !== id)
        }));
    },

    // Mettre à jour un bloc
    updateBlock: (id, updates) => {
        set((state) => ({
            blocks: state.blocks.map((block) =>
                block.id === id
                    ? { ...block, ...updates }
                    : block
            )
        }));
    },

    // Définir l'ID survolé (DnD)
    setOverId: (id) => {
        set({ overId: id });
    },

    // Définir l'ID actif (DnD)
    setActiveId: (id) => {
        set({ activeId: id });
    },

    // Déplacer un bloc
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
