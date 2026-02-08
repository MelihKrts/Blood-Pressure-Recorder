import React from "react";

interface Props {
    children?: React.ReactNode;
}

export const PageWrapper: React.FC<Props> = ({children}) =>{
    return(
        <section className="w-full min-h-dvh bg-gray-100  mt-14  relative  ">
            {children}
        </section>
    )
}