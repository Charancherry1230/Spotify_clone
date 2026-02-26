"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, Library } from "lucide-react";
import { cn } from "@/lib/utils";

const routes = [
    { label: "Home", icon: Home, href: "/dashboard" },
    { label: "Search", icon: Search, href: "/search" },
    { label: "Library", icon: Library, href: "/library" },
];

export default function MobileNav() {
    const pathname = usePathname();

    return (
        <div className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-black border-t border-white/10 flex items-center justify-around z-40">
            {routes.map((route) => (
                <Link
                    key={route.href}
                    href={route.href}
                    className={cn(
                        "flex flex-col items-center justify-center space-y-1 p-2 w-full",
                        pathname === route.href ? "text-white" : "text-neutral-500 hover:text-neutral-300"
                    )}
                >
                    <route.icon className="w-5 h-5" />
                    <span className="text-[10px] font-medium">{route.label}</span>
                </Link>
            ))}
        </div>
    );
}
