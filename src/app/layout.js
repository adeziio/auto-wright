import React from 'react';
import { Roboto } from 'next/font/google';

const roboto = Roboto({ weight: '400', subsets: ['latin'] });

export default function Layout({ children }) {
  return (
    <html lang="en">
      <head>
        <title>Auto-Wright Dashboard</title>
      </head>
      <body className={roboto.className}>
        {children} {/* The children are the actual page content */}
      </body>
    </html>
  );
}
