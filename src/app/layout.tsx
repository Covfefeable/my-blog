"use client";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Footer from "@/components/footer";
import Header from "@/components/header";
import { createContext, useState } from "react";
import { MenuContext } from "./context";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [menu, setMenu] = useState("Home");
  return (
    <html lang="en">
      <head>
        <title>Covfefeable&apos;s Blog</title>
        <meta name="description" content="A blog about software development." />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className={inter.className}>
        <Header onSelect={setMenu} />
        <MenuContext.Provider value={menu}>{children}</MenuContext.Provider>
        <Footer />
      </body>
    </html>
  );
}
