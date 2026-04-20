"use client";
import { usePathname } from "next/navigation";
import { Providers } from "./providers";
import "./globals.css";
import Script from "next/script";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  //Récupère le chemin actuel 
  const pathname = usePathname();

  //Détermine si la page est une page d'administration ou de connexion
  const isAdminPage = pathname?.startsWith('/admin') || pathname?.startsWith('/login');

  return (
    <html lang="fr">
      <head>
        {!isAdminPage && (
          <>
            
            <link rel="stylesheet" href="/assets/css/main.css" />
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" />
          </>
        )}
      </head>
      <body className="is-preload">
        <Providers>
          {children}
        </Providers>

      {!isAdminPage && (
  <>
        
        <Script src="/assets/js/jquery.min.js" strategy="beforeInteractive" />
        <Script src="/assets/js/browser.min.js" strategy="beforeInteractive" />
        <Script src="/assets/js/breakpoints.min.js" strategy="beforeInteractive" />
        <Script src="/assets/js/util.js" strategy="beforeInteractive" />
        
        
        <Script src="/assets/js/jquery.scrollex.min.js" strategy="afterInteractive" />
        <Script src="/assets/js/jquery.scrolly.min.js" strategy="afterInteractive" />
        <Script src="/assets/js/main.js" strategy="afterInteractive" />
      </>
    )}
      </body>
    </html>
  );
}