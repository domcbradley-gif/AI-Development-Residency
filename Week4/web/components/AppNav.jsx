"use client";

import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Link from "next/link";
import { signOut } from "@/app/auth-actions.js";

// Nav links are underlined so they read as links, not plain buttons.
const navLinkSx = { textDecoration: "underline", textUnderlineOffset: "3px" };

// `user` is passed from the server layout: { email } when signed in, else null.
export default function AppNav({ user }) {
  return (
    <AppBar position="static" color="default" elevation={1}>
      <Toolbar sx={{ gap: 1, flexWrap: "wrap" }}>
        <Typography
          variant="h6"
          component="div"
          sx={{ flexGrow: 1, fontSize: "1rem" }}
        >
          Community-Governed Data
        </Typography>

        <Button component={Link} href="/" color="inherit" sx={navLinkSx}>
          Community Record
        </Button>
        <Button component={Link} href="/gap" color="inherit" sx={navLinkSx}>
          Compare
        </Button>
        <Button component={Link} href="/body" color="inherit" sx={navLinkSx}>
          Residents&rsquo; Group
        </Button>
        <Button component={Link} href="/warrants" color="inherit" sx={navLinkSx}>
          Accountability
        </Button>
        <Button component={Link} href="/about" color="inherit" sx={navLinkSx}>
          About
        </Button>
        <Button component={Link} href="/provider" color="inherit" sx={navLinkSx}>
          Provider
        </Button>
        <Button component={Link} href="/funding" color="inherit" sx={navLinkSx}>
          Funding
        </Button>

        {user ? (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Typography variant="body2" color="text.secondary">
              {user.email}
            </Typography>
            <form action={signOut}>
              <Button type="submit" color="inherit" variant="outlined" size="small">
                Log out
              </Button>
            </form>
          </Box>
        ) : (
          <Button component={Link} href="/login" color="inherit" variant="outlined">
            Log in
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
}
