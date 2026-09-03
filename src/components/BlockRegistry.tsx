import { ComponentType } from "react";
import ChoiceGroupInput from "./Blocks/ChoiceGroupInput";
import TextInput from "./Blocks/TextInput";
import TextareaInput from "./Blocks/TextareaInput";
import Title from "./Blocks/Title";
import Paragraph from "./Blocks/Paragraph";
import { BlockType } from "./Blocks/Definition";

export const BLOCK_COMPONENTS: Record<BlockType, ComponentType<any>> = {
    'TextInput': TextInput,
    'TextareaInput': TextareaInput,
    'Title': Title,
    'Paragraph': Paragraph,
    'ChoiceGroup': ChoiceGroupInput,
};
