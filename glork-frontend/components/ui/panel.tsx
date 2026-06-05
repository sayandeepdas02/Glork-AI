import React from "react";
import { cn } from "@/lib/utils";

function Panel({ className, ...props }: React.ComponentProps<"section">) {
    return (
        <section
            data-slot="panel"
            className={cn(
                "screen-line-before screen-line-after border-x border-[#EAEAE5] max-w-[1200px] mx-auto",
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

function PanelTitle({ className, ...props }: React.ComponentProps<"h2">) {
    return (
        <h2
            data-slot="panel-title"
            className={cn(
                "text-4xl md:text-5xl leading-[1.1] font-normal tracking-tight text-[#111] pb-2",
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
                "-top-[0.75em] ml-1.5 text-xs font-normal text-[#bbb] select-none",
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
