import React, { PropsWithChildren, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { BlockDefinition, getAllBlockDefinitions } from "./Blocks/Definition";

type AddMenuProps = {
    onPick: (def: BlockDefinition) => void;
    trigger?: React.ReactNode;
    placeholder?: string;
    placement?: 'left' | 'right';
    allowTypes?: Array<BlockDefinition["type"]>;
} & PropsWithChildren;

export const AddMenu: React.FC<AddMenuProps> = (
    {
        onPick,
        placeholder = "Rechercher un bloc…",
        placement = 'left',
        allowTypes,
        children
    }) => {
    const ALL = useMemo(() => getAllBlockDefinitions(), []);
    const items = useMemo(() => {
        if (!allowTypes || allowTypes.length === 0) return ALL;
        const allow = new Set(allowTypes);
        return ALL.filter(d => allow.has(d.type));
    }, [ALL, allowTypes]);

    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState("");
    const rootRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();
        if (!q) return items;
        return items.filter(d =>
            d.title.toLowerCase().includes(q) ||
            d.description.toLowerCase().includes(q) ||
            d.type.toLowerCase().includes(q)
        );
    }, [query, items]);

    useEffect(() => {
        if (!open) return;

        setTimeout(() => inputRef.current?.focus(), 0);

        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                setOpen(false);
            }
        };

        document.addEventListener("keydown", handleEscape);
        return () => document.removeEventListener("keydown", handleEscape);
    }, [open]);

    const handleClose = () => {
        setOpen(false);
        setQuery("");
    };

    const menuContent = open && (
        <>
            <div
                className="fixed inset-0 z-40 bg-black/30"
                onClick={handleClose}
                role="presentation"
            />

            <div
                ref={rootRef}
                className="fixed z-50 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 rounded-lg border border-gray-200 bg-white"
            >
                <div className="p-2 border-b border-gray-200">
                    <input
                        ref={inputRef}
                        type="text"
                        value={query}
                        onChange={e => setQuery(e.target.value)}
                        placeholder={placeholder}
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                    />
                </div>

                <div className="max-h-80 overflow-auto">
                    {filtered.length === 0 ? (
                        <div className="p-3 text-sm text-gray-400">Aucun résultat…</div>
                    ) : (
                        <ul className="p-1">
                            {filtered.map(def => (
                                <li key={def.id}>
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            onPick(def);
                                            handleClose();
                                        }}
                                        className="flex-col !items-start btn btn-size-small btn-mode-ghost w-full text-left !gap-1"
                                        title={def.description}
                                    >
                                        <div className="text-black">{def.title}</div>
                                        <p className="text-xs">{def.description}</p>
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </>
    );

    return (
        <>
            <div className="relative inline-block cursor-pointer">
                <div
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setOpen(o => !o);
                    }}
                >
                    {children}
                </div>
            </div>

            {menuContent && createPortal(menuContent, document.body)}
        </>
    );
};
