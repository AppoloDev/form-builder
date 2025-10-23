import DateTimeInput from "./Blocks/DateTimeInput";
import ChoiceGroupInput from "./Blocks/ChoiceGroupInput";
import TextInput from "./Blocks/TextInput";
import NumberInput from "./Blocks/NumberInput";
import EmailInput from "./Blocks/EmailInput";
import UrlInput from "./Blocks/UrlInput";
import TelInput from "./Blocks/TelInput";
import TextareaInput from "./Blocks/TextareaInput";
import SelectInput from "./Blocks/Select";
import Title from "./Blocks/Title";
import Paragaph from "./Blocks/Paragaph";

export const BLOCK_COMPONENTS = {
    'TextInput': TextInput,
    'NumberInput': NumberInput,
    'EmailInput': EmailInput,
    'TelInput': TelInput,
    'UrlInput': UrlInput,
    'TextareaInput': TextareaInput,
    'DateTimeInput': DateTimeInput,
    'Select': SelectInput,
    'Title': Title,
    'Paragraph': Paragaph,
    'ChoiceGroup': ChoiceGroupInput,
};
