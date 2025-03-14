import React from "react";

interface Props {
    children?: React.ReactNode;
}

export const PageWrapper: React.FC<Props> = ({children}) =>{
    return(
        <section className="w-full min-h-screen bg-yellow-200 mt-1 relative flex flex-col justify-center items-center">
            {children}
        </section>
    )
}