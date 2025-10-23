import React, { useEffect, useMemo, useRef, useState } from "react";
import { BlockDefinition, getAllBlockDefinitions } from "./Blocks/Definition";

type AddMenuProps = {
    onPick: (def: BlockDefinition) => void;
    trigger?: React.ReactNode; // bouton personnalisé optionnel
    placeholder?: string;
    allowTypes?: Array<BlockDefinition["type"]>;
};

const DefaultTrigger = () => (
    <button
        type="button"
        className="rounded-full border border-gray-300 bg-white shadow-sm p-2 hover:bg-gray-50"
        title="Ajouter un bloc"
    >
        <svg width="16" height="16" viewBox="0 0 24 24" className="text-gray-700">
            <path fill="currentColor" d="M11 11V5h2v6h6v2h-6v6h-2v-6H5v-2z" />
        </svg>
    </button>
);

export const AddMenu: React.FC<AddMenuProps> = ({
                                                    onPick,
                                                    trigger = <DefaultTrigger />,
                                                    placeholder = "Rechercher un bloc…",
                                                    allowTypes,
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
            d.tooltip.toLowerCase().includes(q) ||
            d.type.toLowerCase().includes(q)
        );
    }, [query, items]);

    // close on outside click
    useEffect(() => {
        if (!open) return;
        const onDoc = (e: MouseEvent) => {
            if (!rootRef.current) return;
            if (!rootRef.current.contains(e.target as Node)) setOpen(false);
        };
        document.addEventListener("mousedown", onDoc);
        return () => document.removeEventListener("mousedown", onDoc);
    }, [open]);

    // focus search when open
    useEffect(() => {
        if (open) setTimeout(() => inputRef.current?.focus(), 0);
    }, [open]);

    return (
        <div className="relative inline-block" ref={rootRef}>
            <div
                onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setOpen(o => !o);
                }}
            >
                {trigger}
            </div>

            {open && (
                <div className="absolute right-0 z-20 mt-2 w-80 rounded-md border border-gray-200 bg-white shadow-xl">
                    <div className="p-2 border-b border-gray-100">
                        <input
                            ref={inputRef}
                            type="text"
                            value={query}
                            onChange={e => setQuery(e.target.value)}
                            placeholder={placeholder}
                            className="w-full rounded border border-gray-200 px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                                            className="group w-full text-left px-2 py-2 rounded hover:bg-gray-50 focus:bg-gray-50"
                                            title={def.tooltip}
                                        >
                                            <div className="flex items-start gap-2">
                                                <div className="mt-0.5 h-6 w-6 rounded-md bg-blue-50 border border-blue-200 flex items-center justify-center text-[11px] text-blue-700">
                                                    {def.title.slice(0, 1)}
                                                </div>
                                                <div>
                                                    <div className="text-sm font-medium text-gray-800">{def.title}</div>
                                                    <div className="text-[11px] text-gray-500 line-clamp-2">{def.tooltip}</div>
                                                </div>
                                                <div className="ml-auto text-[11px] text-gray-400 self-center group-hover:text-gray-600">
                                                    {def.type}
                                                </div>
                                            </div>
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
