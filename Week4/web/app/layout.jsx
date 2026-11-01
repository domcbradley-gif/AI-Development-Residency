import { AppRouterCacheProvider } from "@mui/material-nextjs/v14-appRouter";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { theme } from "./theme.js";
import AppNav from "@/components/AppNav.jsx";

export const metadata = {
  title: "Community record — share your housing experience",
  description:
    "A community-owned space for residents to put their housing experience on " +
    "the record. Practice environment — synthetic data only.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {/* AppRouterCacheProvider keeps MUI's emotion styles correct with SSR. */}
        <AppRouterCacheProvider>
          <ThemeProvider theme={theme}>
            {/* CssBaseline normalizes styles and respects system color scheme. */}
            <CssBaseline />
            <AppNav />
            {children}
          </ThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
