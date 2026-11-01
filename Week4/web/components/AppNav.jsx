"use client";

import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Link from "next/link";

// Simple top navigation. Links use next/link for client-side routing.
export default function AppNav() {
  return (
    <AppBar position="static" color="default" elevation={1}>
      <Toolbar sx={{ gap: 1 }}>
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
      </Toolbar>
    </AppBar>
  );
}
