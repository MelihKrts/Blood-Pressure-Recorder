import React from "react";
import Link from "next/link";

interface Props {
    children?: React.ReactNode;
}

export const Header: React.FC<Props> = (props) => {
    return(
        <header className="w-full bg-indigo-600 fixed top-0 z-10">
            <div className="container">
                <h1 className="text-xl text-white py-2 px-2"><Link href="/">Pressure Recorder</Link></h1>
            </div>
        </header>
    )
}
