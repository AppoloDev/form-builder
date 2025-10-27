import React, { useEffect, useRef, ReactNode, useCallback } from "react";
import { createPortal } from "react-dom";

interface ContextMenuProps {
    visible: boolean;
    x: number;
    y: number;
    onClose: () => void;
    children: ReactNode;
    title?: string;
    maxWidth?: number;
}

export const ContextMenu = (
    {
        visible,
        x,
        y,
        onClose,
        children,
        title = "Configuration du champ",
        maxWidth = 400,
    }: ContextMenuProps) => {
    const menuRef = useRef<HTMLDivElement>(null);

    const adjustPosition = useCallback(() => {
        if (!menuRef.current) return {x, y};

        const menu = menuRef.current;
        const rect = menu.getBoundingClientRect();
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;

        const padding = 10;
        let adjustedX = x;
        let adjustedY = y;

        if (rect.right > viewportWidth - padding) {
            adjustedX = Math.max(padding, viewportWidth - rect.width - padding);
        }

        if (rect.bottom > viewportHeight - padding) {
            adjustedY = Math.max(padding, viewportHeight - rect.height - padding);
        }

        if (adjustedX < padding) {
            adjustedX = padding;
        }

        if (adjustedY < padding) {
            adjustedY = padding;
        }

        return {x: adjustedX, y: adjustedY};
    }, [x, y]);

    useEffect(() => {
        if (!visible) return;

        const handleClickOutside = (e: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                onClose();
            }
        };

        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                onClose();
            }
        };

        const timeoutId = setTimeout(() => {
            document.addEventListener("mousedown", handleClickOutside);
            document.addEventListener("keydown", handleEscape);
        }, 0);

        return () => {
            clearTimeout(timeoutId);
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("keydown", handleEscape);
        };
    }, [visible, onClose]);

    useEffect(() => {
        if (!visible || !menuRef.current) return;

        const {x: adjustedX, y: adjustedY} = adjustPosition();
        menuRef.current.style.left = `${adjustedX}px`;
        menuRef.current.style.top = `${adjustedY}px`;
    }, [visible, adjustPosition]);

    if (!visible) return null;

    const menuContent = (
        <>
            <div
                className="fixed inset-0 z-40 bg-black/5"
                onClick={onClose}
                role="presentation"
            />

            <div
                ref={menuRef}
                role="dialog"
                aria-modal="true"
                aria-label={title}
                className="fixed z-50 bg-white rounded-lg border border-gray-200 py-2 min-w-[280px] max-h-[80vh] overflow-y-auto"
                style={{
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
