"use client";

import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Link from "next/link";
import { signOut } from "@/app/auth-actions.js";

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

        <Button component={Link} href="/" color="inherit">
          Community record
        </Button>
        <Button component={Link} href="/gap" color="inherit">
          The gap
        </Button>
        <Button component={Link} href="/body" color="inherit">
          Community body
        </Button>
        <Button component={Link} href="/warrants" color="inherit">
          Warrants
        </Button>
        <Button component={Link} href="/provider" color="inherit">
          Provider
        </Button>
        <Button component={Link} href="/funding" color="inherit">
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
