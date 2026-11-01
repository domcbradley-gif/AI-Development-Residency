import { AppRouterCacheProvider } from "@mui/material-nextjs/v14-appRouter";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { theme } from "./theme.js";
import AppNav from "@/components/AppNav.jsx";
import { getSupabaseServerClient } from "@/lib/supabaseServer.js";

// Every page reads the signed-in session in the layout, so render per-request
// (never statically cached) — the nav must reflect the current user everywhere.
export const dynamic = "force-dynamic";

export const metadata = {
  title: "Community record — share your housing experience",
  description:
    "A community-owned space for residents to put their housing experience on " +
    "the record. Practice environment — synthetic data only.",
};

export default async function RootLayout({ children }) {
  const supabase = getSupabaseServerClient();
  let user = null;
  if (supabase) {
    const {
      data: { user: u },
    } = await supabase.auth.getUser();
    user = u;
  }

  return (
    <html lang="en">
      <body>
        <AppRouterCacheProvider>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <AppNav user={user ? { email: user.email } : null} />
            {children}
          </ThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
