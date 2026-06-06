import React from "react";
import { cn } from "@/lib/utils";

function Panel({ className, ...props }: React.ComponentProps<"section">) {
    return (
        <section
            data-slot="panel"
            className={cn(
                "border-x border-[#EAEAE5] max-w-[1200px] mx-auto",
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
            className={cn("px-8 lg:px-14 pt-10 pb-8", className)}
            {...props}
        />
    );
}

function PanelTitle({ className, ...props }: React.ComponentProps<"h2">) {
    return (
        <h2
            data-slot="panel-title"
            className={cn(
                "font-serif text-[1.75rem] md:text-[2.25rem] leading-[1.12] font-normal tracking-tight text-[#111]",
                className
            )}
            {...props}
        />
    );
}

function PanelContent({ className, ...props }: React.ComponentProps<"div">) {
    return (
        <div data-slot="panel-body" className={cn("px-8 lg:px-14 pt-8 pb-16", className)} {...props} />
    );
}

export { Panel, PanelContent, PanelHeader, PanelTitle };
