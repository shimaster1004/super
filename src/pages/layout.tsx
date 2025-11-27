import { Outlet } from "react-router";
import { ThemeProvider } from "@/components/theme-provider";
import { AppFooter, AppHeader } from "@/components/common";
import { Toaster } from "@/components/ui/sonner";

function RootLayout() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <div className="w-full h-screen flex flex-col">
        <AppHeader />
        {/* 페이지별 콘텐츠 영역 */}
        <main className="w-full flex-1 flex justify-center mt-12">
          <Outlet />
        </main>
        <AppFooter />
        <Toaster position="top-center" richColors />
      </div>
    </ThemeProvider>
  );
}

export default RootLayout;
