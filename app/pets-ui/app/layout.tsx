import type { Metadata } from "next";
import { Inter } from "next/font/google";

import Footer from "@components/footer/footer";
import Header from "@components/header/header";

import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "PETs Clinic App",
  description: "Web Application for managing PETs applicant journey",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Header/>
        {children}
        <Footer/>
      </body>
    </html>
  );
}
