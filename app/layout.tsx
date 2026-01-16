import {Geist, Geist_Mono} from "next/font/google";
import "./globals.css";
import {Footer, Header, PageWrapper} from "@/app/component"
import React from "react";
import {Metadata} from "next"
import ToastProvider from "@/app/component/shared/ToastProvider";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "Pressure Recorder",
    description: "Save to blood pressure recorder",
    themeColor: "#f69435",
};


export default function RootLayout({children,}: Readonly<{
    children: React.ReactNode;
}>) {

    return (
        <html lang="en">
        <head>
            <link rel="manifest" href="/manifest.json"/>
            <link rel="icon" href="/icon-192x192.png"/>
            <meta name="theme-color" content="#ffffff"/>
        </head>
        <body
            className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
        <Header/>
        <PageWrapper>
            {children}
        </PageWrapper>
        <Footer/>
        <ToastProvider />
        </body>
        </html>
    );
}
