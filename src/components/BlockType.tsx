import { FC } from "react";
import {Block} from "../models/Block";

export const BlockType: FC<{key: number, block: Block}> = ({ block }) => {
    return (
        <div>
            <p>{block.title}</p>
        </div>
    );
}
