"use client";
import { Inter } from "next/font/google";
import "./globals.css";
import { useState } from "react";
import { Layout } from "./basic-layout";
import { I18nextProvider } from "react-i18next";
import i18n from "@/i18n";

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
        <title>JayChiu&apos;s Blog</title>
        <meta name="description" content="A blog about software development." />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className={inter.className}>
        <I18nextProvider i18n={i18n}>
          <Layout showMenu={true} setMenu={setMenu} menu={menu}>
            {children}
          </Layout>
        </I18nextProvider>
      </body>
    </html>
  );
}
