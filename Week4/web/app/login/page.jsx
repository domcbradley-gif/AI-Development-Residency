"use client";

import { useId, useState } from "react";
import { useRouter } from "next/navigation";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import Typography from "@mui/material/Typography";
import { getSupabaseBrowserClient } from "@/lib/supabaseClient.js";

export default function LoginPage() {
  const router = useRouter();
  const emailId = useId();
  const pwId = useId();
  const [mode, setMode] = useState("login"); // "login" | "signup"
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [role, setRole] = useState("community_member");
  const [status, setStatus] = useState({ kind: "idle", message: "" });

  async function ensureProfile(supabase, userId, roleForNew) {
    const { data: existing } = await supabase
      .from("profiles")
      .select("id")
      .eq("id", userId)
      .maybeSingle();
    if (!existing) {
      await supabase.from("profiles").insert({
        id: userId,
        role: roleForNew,
        display_name: displayName || null,
      });
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setStatus({ kind: "submitting", message: "" });
    const supabase = getSupabaseBrowserClient();
    try {
      if (mode === "signup") {
        const { data, error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        if (data.session && data.user) {
          await ensureProfile(supabase, data.user.id, role);
          router.push("/");
          router.refresh();
          return;
        }
        setStatus({
          kind: "success",
          message:
            "Account created. Check your email to confirm, then come back and log in.",
        });
        return;
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      if (data.user) await ensureProfile(supabase, data.user.id, "community_member");
      router.push("/");
      router.refresh();
    } catch (err) {
      setStatus({
        kind: "error",
        message: err?.message || "Something went wrong. Please try again.",
      });
    }
  }

  return (
    <Container component="main" id="main" maxWidth="xs" sx={{ py: 4 }}>
      <Typography component="h1" variant="h4" gutterBottom>
        {mode === "login" ? "Log in" : "Sign up"}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Accounts are for community-body members and providers. Contributing to the
        record stays anonymous and needs no account.
      </Typography>

      <ToggleButtonGroup
        value={mode}
        exclusive
        onChange={(_e, v) => v && setMode(v)}
        aria-label="login or sign up"
        size="small"
        sx={{ mb: 3 }}
      >
        <ToggleButton value="login">Log in</ToggleButton>
        <ToggleButton value="signup">Sign up</ToggleButton>
      </ToggleButtonGroup>

      <Box component="form" onSubmit={handleSubmit} noValidate>
        <TextField
          id={emailId}
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          fullWidth
          required
          autoComplete="email"
          sx={{ mb: 2 }}
        />
        <TextField
          id={pwId}
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          fullWidth
          required
          autoComplete={mode === "signup" ? "new-password" : "current-password"}
          sx={{ mb: 2 }}
        />

        {mode === "signup" && (
          <>
            <TextField
              label="Display name (optional)"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              fullWidth
              sx={{ mb: 2 }}
            />
            <TextField
              label="I am a…"
              select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              fullWidth
              sx={{ mb: 2 }}
            >
              <MenuItem value="community_member">Community member</MenuItem>
              <MenuItem value="provider">Provider</MenuItem>
            </TextField>
          </>
        )}

        <Button
          type="submit"
          variant="contained"
          disabled={status.kind === "submitting"}
        >
          {status.kind === "submitting"
            ? "Please wait…"
            : mode === "login"
              ? "Log in"
              : "Create account"}
        </Button>

        <Box aria-live="polite" sx={{ mt: 2 }}>
          {status.kind === "success" && (
            <Alert severity="success">{status.message}</Alert>
          )}
          {status.kind === "error" && (
            <Alert severity="error">{status.message}</Alert>
          )}
        </Box>
      </Box>
    </Container>
  );
}
