import {Geist, Geist_Mono} from "next/font/google";
import "./globals.css";
import {Footer, Header, PageWrapper} from "@/app/component"
import React from "react";


const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata = {
    title: "Pressure Recorder",
    description: "Save to blood pressure recorder",
};


export default function RootLayout({children,}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
        <head>
            <link rel="manifest" href="/manifest.json"/>
        </head>
        <body
            className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
        <Header/>
        <PageWrapper>
            {children}
        </PageWrapper>
        <Footer/>
        </body>
        </html>
    );
}
