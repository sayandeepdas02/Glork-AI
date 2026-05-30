import React from "react";
import { cn } from "@/lib/utils";

function Panel({ className, ...props }: React.ComponentProps<"section">) {
    return (
        <section
            data-slot="panel"
            className={cn(
                "screen-line-before screen-line-after border-x border-edge max-w-5xl mx-auto",
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
            className={cn("screen-line-after px-5 py-4", className)}
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
            className={cn("text-5xl md:text-[3.5rem] leading-tight font-serif font-normal italic tracking-tight text-white/95 pb-2", className)}
            {...props}
        />
    );
}

function PanelTitleSup({ className, ...props }: React.ComponentProps<"sup">) {
    return (
        <sup
            className={cn(
                "-top-[0.75em] ml-1.5 text-xs font-mono font-medium text-muted uppercase tracking-widest select-none",
                className
            )}
            {...props}
        />
    );
}

function PanelContent({ className, ...props }: React.ComponentProps<"div">) {
    return (
        <div data-slot="panel-body" className={cn("p-5", className)} {...props} />
    );
}

export { Panel, PanelContent, PanelHeader, PanelTitle, PanelTitleSup };
