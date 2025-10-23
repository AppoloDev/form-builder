import { Block, BlockId } from "../components/Blocks/Definition";
import { v4 as uuidv4 } from 'uuid';

export const generateBlockId = (type: string): BlockId => {
    return `${type}-${uuidv4()}`;
};

export const isValidDropTarget = (
    id: BlockId | null,
    validDropIds: Set<string>
): boolean => {
    return !!id && validDropIds.has(String(id));
};

export const findBlockIndex = (blocks: Block[], id: BlockId): number => {
    return blocks.findIndex((b) => b.id === id);
};

export const createBlockFromTemplate = <T extends Block>(
    template: T,
    overrides?: Partial<T>
): T => {
    return {
        ...template,
        id: generateBlockId(template.type),
        ...overrides,
    };
};
