import type { Metadata } from "next";
import "./globals.css";
import LayoutWrapper from "@/components/LayoutWrapper";
import FinovaAuthProvider from "@/components/FinovaAuthProvider";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const metadata: Metadata = {
  title: "Finova AI",
  description: "Your AI-powered personal finance dashboard",
  icons: {
    icon: "/finova_logo.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Material+Symbols+Outlined:wght,FILL,GRAD,opsz@100..700,0..1,-50..200,24&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-surface text-text-primary font-sans min-h-screen flex">
        <FinovaAuthProvider>
          <LayoutWrapper>
            {children}
          </LayoutWrapper>
        </FinovaAuthProvider>
        <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover theme="colored" />
      </body>
    </html>
  );
}
