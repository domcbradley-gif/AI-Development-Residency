import { useId, useRef, useState } from "react";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import FormHelperText from "@mui/material/FormHelperText";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { createContribution } from "../api.js";

const MAX_BODY = 5000; // mirrors the server's provisional limit (client UX only).

// Resident capture form. Anonymous by default — we never ask for any identity.
export default function ContributionForm({ topics, provisionalLabel, onSubmitted }) {
  const bodyId = useId();
  const topicId = useId();
  const [body, setBody] = useState("");
  const [topic, setTopic] = useState("");
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
      // Move focus to the field so screen-reader users hear the error.
      document.getElementById(bodyId)?.focus();
      return;
    }
    setStatus({ kind: "submitting", message: "" });
    try {
      await createContribution({ body: trimmed, topic });
      setBody("");
      setTopic("");
      setStatus({ kind: "success", message: "Thank you. Your note was added anonymously." });
      onSubmitted?.();
    } catch (err) {
      setStatus({ kind: "error", message: err.message });
    } finally {
      // Send focus to the status so the result is announced.
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

      {/* Native form => Enter submits and the browser handles semantics. */}
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

        <Button
          type="submit"
          variant="contained"
          disabled={status.kind === "submitting"}
        >
          {status.kind === "submitting" ? "Sending…" : "Send anonymously"}
        </Button>

        {/* Live region: results are announced; it's focusable for focus move. */}
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
