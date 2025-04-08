import { Toaster } from "sonner";
import ProtectedComponent from "../components/ProtectComponents";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Toaster
        position="top-center"
        />
        <ProtectedComponent>
        {children}
        </ProtectedComponent>
      </body>
    </html>
  );
}
