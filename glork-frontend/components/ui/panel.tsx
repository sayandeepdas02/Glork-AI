import React from "react";
import { cn } from "@/lib/utils";

/**
 * Panel — The core layout primitive for the landing page.
 * Uses max-w-[1200px] for a proper SaaS landing page width.
 * Screen-lines extend full viewport width for the blueprint grid effect.
 */
function Panel({ className, ...props }: React.ComponentProps<"section">) {
    return (
        <section
            data-slot="panel"
            className={cn(
                "screen-line-before screen-line-after border-x border-white/6 max-w-[1400px] mx-auto",
                className
            )}
            {...props}
        />
    );
}

function PanelHeader({ className, ...props }: React.ComponentProps<"header">) {
    return (
        <header
            data-slot="panel-header"
            className={cn("screen-line-after px-6 lg:px-12 py-5", className)}
            {...props}
        />
    );
}

function PanelTitle({
    className,
    ...props
}: React.ComponentProps<"h2">) {
    return (
        <h2
            data-slot="panel-title"
            className={cn(
                "text-5xl md:text-[3.5rem] leading-[1.1] font-serif font-normal italic tracking-tight text-white/95 pb-2",
                className
            )}
            {...props}
        />
    );
}

function PanelTitleSup({ className, ...props }: React.ComponentProps<"sup">) {
    return (
        <sup
            className={cn(
                "-top-[0.75em] ml-1.5 text-xs font-mono font-medium text-white/40 uppercase tracking-widest select-none",
                className
            )}
            {...props}
        />
    );
}

function PanelContent({ className, ...props }: React.ComponentProps<"div">) {
    return (
        <div data-slot="panel-body" className={cn("p-6 lg:p-10", className)} {...props} />
    );
}

export { Panel, PanelContent, PanelHeader, PanelTitle, PanelTitleSup };
