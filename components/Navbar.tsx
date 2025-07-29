import React from 'react'
import Link from "next/link";
import Image from "next/image";
import Navitems from "@/components/Navitems";
import { SignInButton, SignUpButton, UserButton, SignedIn, SignedOut } from "@clerk/nextjs";

const Navbar = () => {
    return (
        <nav className="navbar">
            <Link href="/">
                <div className="flex items-center gap-2.5 cursor-pointer">
                    <Image src="/images/logo.svg" alt="logo" width={46} height={46} />
                </div>
            </Link>

            <div className="flex items-center gap-8">
                <Navitems />
                <SignedOut>
                    <div className="flex btn-signin items-center gap-2">
                        <SignInButton />

                    </div>
                </SignedOut>
                <SignedIn>
                    <UserButton afterSignOutUrl="/" />
                </SignedIn>
            </div>
        </nav>
    )
}
export default Navbar
