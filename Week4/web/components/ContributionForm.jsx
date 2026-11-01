"use client";

import { useId, useRef, useState } from "react";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormHelperText from "@mui/material/FormHelperText";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { createContribution } from "@/lib/api.js";
import { MAX_BODY_LENGTH as MAX_BODY } from "@/lib/config.js";

// Resident capture form. Anonymous by default — we never ask for any identity.
export default function ContributionForm({ topics, provisionalLabel, onSubmitted }) {
  const bodyId = useId();
  const topicId = useId();
  const [body, setBody] = useState("");
  const [topic, setTopic] = useState("");
  const [consented, setConsented] = useState(false);
  const [status, setStatus] = useState({ kind: "idle", message: "" });
  const statusRef = useRef(null);

  const trimmed = body.trim();
  const bodyError =
    trimmed.length === 0
      ? "Please describe what's happening before sending."
      : body.length > MAX_BODY
        ? `Please keep it under ${MAX_BODY} characters.`
        : "";

  async function handleSubmit(event) {
    event.preventDefault();
    if (bodyError) {
      document.getElementById(bodyId)?.focus();
      return;
    }
    if (!consented) {
      setStatus({
        kind: "error",
        message: "Please confirm you understand before sending.",
      });
      requestAnimationFrame(() => statusRef.current?.focus());
      return;
    }
    setStatus({ kind: "submitting", message: "" });
    try {
      await createContribution({ body: trimmed, topic });
      setBody("");
      setTopic("");
      setConsented(false);
      setStatus({ kind: "success", message: "Thank you. Your note was added anonymously." });
      onSubmitted?.();
    } catch (err) {
      setStatus({ kind: "error", message: err.message });
    } finally {
      requestAnimationFrame(() => statusRef.current?.focus());
    }
  }

  return (
    <Box component="section" aria-labelledby="form-heading">
      <Typography component="h2" variant="h5" id="form-heading" gutterBottom>
        Share your experience
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Your note is anonymous. We do not ask for your name and cannot trace it
        back to you. This is a practice space — all data here is synthetic.
      </Typography>

      <Box component="form" onSubmit={handleSubmit} noValidate>
        <TextField
          id={bodyId}
          label="What's happening in your housing?"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          multiline
          minRows={4}
          fullWidth
          required
          error={Boolean(bodyError) && body.length > 0}
          helperText={
            body.length > 0 && bodyError
              ? bodyError
              : `${body.length}/${MAX_BODY} characters`
          }
          inputProps={{ "aria-describedby": `${bodyId}-help`, maxLength: MAX_BODY + 1 }}
          sx={{ mb: 2 }}
        />

        <TextField
          id={topicId}
          label="Topic (optional)"
          select
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          fullWidth
          sx={{ mb: 1 }}
        >
          <MenuItem value="">
            <em>No topic</em>
          </MenuItem>
          {topics.map((t) => (
            <MenuItem key={t} value={t}>
              {t}
            </MenuItem>
          ))}
        </TextField>
        <FormHelperText sx={{ mb: 2 }}>
          Topics are {provisionalLabel}.
        </FormHelperText>

        {/* Consent & data minimization: an explicit, informed step before sending. */}
        <FormControlLabel
          control={
            <Checkbox
              checked={consented}
              onChange={(e) => setConsented(e.target.checked)}
            />
          }
          label="I understand this is a practice space with synthetic data, and my note is submitted anonymously."
          sx={{ mb: 2, display: "block" }}
        />

        <Button
          type="submit"
          variant="contained"
          disabled={status.kind === "submitting" || !consented}
        >
          {status.kind === "submitting" ? "Sending…" : "Send anonymously"}
        </Button>

        <Box
          ref={statusRef}
          tabIndex={-1}
          aria-live="polite"
          sx={{ mt: 2, outline: "none" }}
        >
          {status.kind === "success" && (
            <Alert severity="success">{status.message}</Alert>
          )}
          {status.kind === "error" && (
            <Alert severity="error">{status.message}</Alert>
          )}
        </Box>
      </Box>
    </Box>
  );
}
