"use client";
import { Inter } from "next/font/google";
import "./globals.css";
import Footer from "@/components/footer";
import Header from "@/components/header";
import { createContext, useState } from "react";
import { MenuContext } from "./context";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
  showMenu = true,
}: Readonly<{
  children: React.ReactNode;
  showMenu?: boolean;
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
        <Layout showMenu={showMenu} setMenu={setMenu} menu={menu}>
          {children}
        </Layout>
      </body>
    </html>
  );
}

export function Layout({
  children,
  showMenu,
  setMenu,
  menu = '',
}: Readonly<{
  children: React.ReactNode;
  showMenu?: boolean;
  setMenu?: (item: string) => void;
  menu?: string;
}>) {
  return (
    <>
      <Header onSelect={setMenu} showMenu={!!showMenu} />
        <MenuContext.Provider value={menu}>{children}</MenuContext.Provider>
      <Footer />
    </>
  );
}
