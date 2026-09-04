import { Html, Head, Main, NextScript } from 'next/document';
export default function Document() {
  return <Html lang="en" data-scroll-behavior="smooth"><Head><link rel="icon" href="/icon.svg" type="image/svg+xml"/><link rel="preload" href="/fonts/manrope-variable.ttf" as="font" type="font/ttf" crossOrigin="anonymous"/></Head><body><Main/><NextScript/></body></Html>;
}
