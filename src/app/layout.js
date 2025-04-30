import './globals.css';
import { ThemeProvider } from '../theme/ThemeProvider';

export const metadata = {
  title: 'Auto-Wright',
  description: 'Automated Testing Dashboard',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
