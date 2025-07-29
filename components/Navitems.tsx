"use client";
import React from 'react'

import Link from "next/link";

import {usePathname} from "next/navigation";
import { cn } from '@/lib/utils';
const navItems = [
    {label: "Home", href: "/" },
    {label: "Companions", href: "/companions" },
    {label: "My Journey", href: "/my-journey" },
]
const Navitems = () => {
    const pathname = usePathname()
    return (
        <div className="flex items-center gap-8">
            {navItems.map(navItem => (
                <Link key={navItem.label} href={navItem.href} className={cn(pathname === navItem.href && 'text-primary font-semibold')}>{navItem.label}</Link>
            ))}
        </div>
    )
}
export default Navitems
