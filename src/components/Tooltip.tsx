import { PropsWithChildren } from "react";

type Props = { content: string } & PropsWithChildren;

export const Tooltip = ({ children, content }: Props) => {
    return (
        <div className="hs-tooltip inline-block" data-hs-tooltip>
            {children}

            <span
                className="hs-tooltip-content hs-tooltip-shown:opacity-100 hs-tooltip-shown:visible opacity-0 transition-opacity inline-block absolute invisible z-10 py-1 px-2 bg-gray-900 text-xs font-medium text-white rounded-md shadow-2xs dark:bg-neutral-700"
                role="tooltip">
                    {content}
                </span>
        </div>
    );
}
