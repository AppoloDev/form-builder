import { ChangeEvent, FocusEvent, KeyboardEvent, useEffect, useLayoutEffect, useRef, useState } from "react";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";

type Props = {
    value: string;
    onCommit: (value: string) => void;
    placeholder?: string;
    className?: string;
    multiline?: boolean;
};

const baseClassName = "border-transparent bg-transparent px-1 -mx-1 hover:border-input focus-visible:border-ring";
const inputOnlyClassName = "h-6 max-w-full";

// The mirror reproduces the input's own padding/border (border + px-1) so its
// offsetWidth already includes that chrome — only a small caret allowance is added.
const MIN_WIDTH = 96; // keeps an empty label clickable
const CARET_SPACE = 8; // room for the blinking caret past the last character

export const InlineEditableText = ({value, onCommit, placeholder, className = "", multiline = false}: Props) => {
    const [draft, setDraft] = useState(value);
    const mirrorRef = useRef<HTMLSpanElement>(null);
    const [width, setWidth] = useState(MIN_WIDTH);

    useEffect(() => {
        setDraft(value);
    }, [value]);

    // Measures synchronously before paint so the input is already the right
    // size on the first frame it's visible — no native field-sizing lag.
    useLayoutEffect(() => {
        if (multiline || !mirrorRef.current) return;
        const measured = mirrorRef.current.getBoundingClientRect().width;
        setWidth(Math.max(MIN_WIDTH, Math.ceil(measured) + CARET_SPACE));
    }, [draft, placeholder, multiline, className]);

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setDraft(e.target.value);
    };

    const handleBlur = (e: FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        if (e.target.value !== value) {
            onCommit(e.target.value);
        }
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            e.preventDefault();
            e.currentTarget.blur();
        }
    };

    if (multiline) {
        return (
            <Textarea
                value={draft}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder={placeholder}
                className={`resize-none ${baseClassName} ${className}`}
            />
        );
    }

    return (
        <>
            <span
                ref={mirrorRef}
                aria-hidden="true"
                className={`invisible absolute -z-10 whitespace-pre border px-1 ${className}`}
            >
                {draft || placeholder}
            </span>

            <Input
                value={draft}
                onChange={handleChange}
                onBlur={handleBlur}
                onKeyDown={handleKeyDown}
                placeholder={placeholder}
                style={{width}}
                className={`${baseClassName} ${inputOnlyClassName} ${className}`}
            />
        </>
    );
};
