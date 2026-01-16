import React from "react";
import Link from "next/link";
import {Heart} from "lucide-react"

interface Props {
    children?: React.ReactNode;
}

export const Header: React.FC<Props> = (props) => {
    return(
        <header className="w-full bg-indigo-600 fixed top-0 z-10">
            <div className="container">
                <div className="flex flex-row items-center px-4">
                    <Heart fill="#fff" className="stroke-none" />
                    <h1 className="text-xl text-white py-2 px-2"><Link href="/">Pressure Recorder</Link></h1>
                </div>
            </div>
        </header>
    )
}