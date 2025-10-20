import {
    arrow,
    autoUpdate,
    FloatingArrow,
    offset,
    shift, useDismiss,
    useFloating,
    useFocus,
    useHover,
    useInteractions,
} from "@floating-ui/react";
import { PropsWithChildren, useRef, useState } from "react";

type Props = { content: string } & PropsWithChildren
export const Tooltip = ({children, content}: Props) => {
    const arrowRef = useRef(null);
    const [isOpen, setIsOpen] = useState(false);

    const {refs, floatingStyles, context} = useFloating({
        placement: 'top',
        open: isOpen,
        onOpenChange: setIsOpen,
        whileElementsMounted: autoUpdate,
        middleware: [
            offset(10),
            shift(),
            arrow({
                element: arrowRef,
            }),
        ],
    });

    const hover = useHover(context, {move: false});
    const focus = useFocus(context);
    const dismiss = useDismiss(context);

    const {getReferenceProps, getFloatingProps} = useInteractions([
        hover,
        focus,
        dismiss,
    ]);

    return (
        <>
            <div ref={refs.setReference} {...getReferenceProps()}>
                {children}
            </div>

            {isOpen && (
                <>
                    <div
                        id="tooltip"
                        ref={refs.setFloating}
                        style={floatingStyles}
                        {...getFloatingProps()}
                    >
                        {content}

                        <FloatingArrow ref={arrowRef} context={context}/>
                    </div>
                </>
            )}
        </>
    );
}
