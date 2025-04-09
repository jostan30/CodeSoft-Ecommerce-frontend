import { Toaster } from "sonner";
import ProtectedComponent from "../components/ProtectComponents";
import { ThemeProvider } from "../components/theme-provider";
import SidebarSeller from "../components/sidebarSeller";


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
          disableTransitionOnChange
        >
          <ProtectedComponent>
          <div className="flex h-screen overflow-hidden">
            <SidebarSeller/>
            <main className="flex-1 overflow-y-auto bg-background">
              {children}
            </main>
          </div>
          </ProtectedComponent>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
