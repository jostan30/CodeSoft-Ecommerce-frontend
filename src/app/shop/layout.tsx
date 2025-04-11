import { Toaster } from "sonner";
import ProtectedComponent from "../components/ProtectComponents";
import UserNavbar from "../components/UserNavbar";
import { ThemeProvider } from "../components/theme-provider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange>
          <Toaster />
          <ProtectedComponent>
            <UserNavbar />
            {children}
          </ProtectedComponent>
        </ThemeProvider>
      </body>
    </html>
  );
}
