import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "JuegosLiterarios.com - ¿Qué tan bien conoces los libros?",
  description: "El juego de trivia literaria más adictivo. Lee primeros párrafos de obras icónicas y adivina de qué libro se trata. Compite por el puntaje más alto.",
  keywords: "trivia literaria, juegos literarios, primeros párrafos, libros, lectura, gamificación, cultura",
  authors: [{ name: "JuegosLiterarios" }],
  openGraph: {
    title: "JuegosLiterarios.com",
    description: "¿Puedes adivinar de qué libro es este primer párrafo?",
    type: "website",
    locale: "es_ES",
  },
  twitter: {
    card: "summary_large_image",
    title: "JuegosLiterarios.com",
    description: "El juego de trivia literaria más adictivo",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;0,800;0,900;1,400;1,500;1,600;1,700&family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet" />
      </head>
      <body className="font-sans antialiased bg-parchment-50 text-ink-900">
        {children}
      </body>
    </html>
  );
}