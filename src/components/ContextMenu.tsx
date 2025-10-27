import React, { useEffect, useRef, ReactNode } from "react";
import { createPortal } from "react-dom";

interface ContextMenuProps {
    visible: boolean;
    x?: number;
    y?: number;
    onClose: () => void;
    children: ReactNode;
    title?: string;
    maxWidth?: number;
    centered?: boolean;
}

export const ContextMenu = (
    {
        visible,
        x = 0,
        y = 0,
        onClose,
        children,
        title = "Configuration du champ",
        maxWidth = 400,
        centered = true,
    }: ContextMenuProps) => {
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!visible) return;

        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                onClose();
            }
        };

        document.addEventListener("keydown", handleEscape);
        return () => {
            document.removeEventListener("keydown", handleEscape);
        };
    }, [visible, onClose]);

    if (!visible) return null;

    const menuContent = (
        <>
            <div
                className="fixed inset-0 z-40 bg-black/30"
                onClick={onClose}
                role="presentation"
            />

            <div
                ref={menuRef}
                role="dialog"
                aria-modal="true"
                aria-label={title}
                className={`fixed z-50 bg-white rounded-lg border border-gray-200 py-2 min-w-[280px] max-h-[80vh] overflow-y-auto ${
                    centered ? 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2' : ''
                }`}
                style={centered ? {
                    maxWidth: `${maxWidth}px`,
                } : {
                    left: `${x}px`,
                    top: `${y}px`,
                    maxWidth: `${maxWidth}px`,
                }}
            >
                <div className="px-4 py-3 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                        <h3 className="text-sm font-semibold text-gray-700">
                            {title}
                        </h3>

                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                            aria-label="Fermer"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" height={16} width={16}>
                                <rect width="256" height="256" fill="none"/>
                                <line x1="200" y1="56" x2="56" y2="200" stroke="currentColor" strokeLinecap="round"
                                      strokeLinejoin="round" strokeWidth="16"/>
                                <line x1="200" y1="200" x2="56" y2="56" stroke="currentColor" strokeLinecap="round"
                                      strokeLinejoin="round" strokeWidth="16"/>
                            </svg>
                        </button>
                    </div>
                </div>

                <div className="px-4 py-3 space-y-4">
                    {children}
                </div>
            </div>
        </>
    );

    return createPortal(menuContent, document.body);
};

interface ContextMenuItemProps {
    children: ReactNode;
    className?: string;
}

export const ContextMenuItem = ({children, className = ""}: ContextMenuItemProps) => {
    return (
        <div className={`${className}`}>
            {children}
        </div>
    );
};
