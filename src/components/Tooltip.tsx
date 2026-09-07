import { PropsWithChildren } from "react";
import { Tooltip as TooltipRoot, TooltipContent, TooltipTrigger } from "./ui/tooltip";

type Props = { content: string } & PropsWithChildren;

export const Tooltip = ({ children, content }: Props) => {
    return (
        <TooltipRoot>
            <TooltipTrigger render={<span className="inline-block" />}>
                {children}
            </TooltipTrigger>
            <TooltipContent>{content}</TooltipContent>
        </TooltipRoot>
    );
}
