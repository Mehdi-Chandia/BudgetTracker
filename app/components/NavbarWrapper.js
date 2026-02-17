"use client"
import React from 'react'
import Navbar from "@/app/components/Navbar";
import {usePathname} from "next/navigation";

export default function NavbarWrapper() {
    const pathname = usePathname();

    if(["/register", "/login",].includes(pathname)) {
        return null;
    }
    return <Navbar/>
}
