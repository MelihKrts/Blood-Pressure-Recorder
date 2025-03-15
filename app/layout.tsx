import type {Metadata} from "next";
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

export const metadata: Metadata = {
    title: "Pressure Recorder",
    description: "Save to blood pressure recorder",
    keywords: ["Budget", "Tracker", "Income", "Expense", "Balance"],
    authors: {
        name: "Melih Karatas",
    },
    manifest: "/manifest.json",
    icons: {
        icon: "/favicon.ico",
        apple: [
            { url: "/ios/180.png", sizes: "180x180", type: "image/png" },
            { url: "/ios/152.png", sizes: "152x152", type: "image/png" },
            { url: "/ios/144.png", sizes: "144x144", type: "image/png" },
            { url: "/ios/120.png", sizes: "120x120", type: "image/png" },
        ],
        shortcut: ["/favicon.ico"],
    },
    appleWebApp: {
        capable: true,
        statusBarStyle: "default",
        title: "Budget Tracking",
        startupImage: [
            {
                url: "/ios/1024.png",
                sizes: "1024x1024",
            },
        ],
    },
    viewport: {
        width: "device-width",
        initialScale: 1,
        maximumScale: 1,
        userScalable: false,
    },
    themeColor: "#cbdfbd",
    formatDetection: {
        telephone: false,
    },

};



export default function RootLayout({children,}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
        <meta name="application-name" content="Budget Tracking"/>
        <meta name="mobile-web-app-capable" content="yes"/>
        <meta name="theme-color" content="#cbdfbd"/>
        <meta name="apple-mobile-web-app-capable" content="yes"/>
        <meta name="apple-mobile-web-app-status-bar-style" content="default"/>
        <meta name="apple-mobile-web-app-title" content="Budget Tracking"/>
        <link rel="apple-touch-startup-image" href="/ios/1024.png"/>
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
