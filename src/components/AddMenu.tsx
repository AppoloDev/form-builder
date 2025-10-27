import React, { PropsWithChildren, useEffect, useMemo, useRef, useState } from "react";
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

        if (open) setTimeout(() => inputRef.current?.focus(), 0);

        const onDoc = (e: MouseEvent) => {
            if (!rootRef.current) return;
            if (!rootRef.current.contains(e.target as Node)) setOpen(false);
        };
        document.addEventListener("mousedown", onDoc);
        return () => document.removeEventListener("mousedown", onDoc);
    }, [open]);

    return (
        <div className="relative inline-block cursor-pointer" ref={rootRef}>
            <div
                onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setOpen(o => !o);
                }}
            >
                {children}
            </div>

            {open && (
                <div className={`absolute ${placement}-0 z-20 mt-2 w-80 rounded-lg border border-gray-200 bg-white`}>
                    <div className="p-2 border-b border-gray-200">
                        <input
                            ref={inputRef}
                            type="text"
                            value={query}
                            onChange={e => setQuery(e.target.value)}
                            placeholder={placeholder}
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
                                                setOpen(false);
                                                setQuery("");
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
            )}
        </div>
    );
};
