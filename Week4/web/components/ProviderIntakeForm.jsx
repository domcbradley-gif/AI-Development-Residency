"use client";

import { useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import { addProviderRecord } from "@/app/provider-actions.js";
import { TOPIC_ALLOWLIST } from "@/lib/config.js";

// STUB (ADR 0007, tickets 5.1 / 5.2): add to the official record, including an
// "outcome" category for the minimal outcome stub.
export default function ProviderIntakeForm() {
  const [category, setCategory] = useState("outcome");
  const [summary, setSummary] = useState("");
  const [source, setSource] = useState("Provider self-report");

  return (
    <Box
      component="form"
      action={addProviderRecord}
      onSubmit={() => setSummary("")}
      sx={{ mt: 1 }}
    >
      <TextField
        name="source"
        label="Source"
        value={source}
        onChange={(e) => setSource(e.target.value)}
        fullWidth
        sx={{ mb: 2 }}
      />
      <TextField
        name="category"
        label="Category"
        select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        fullWidth
        sx={{ mb: 2 }}
      >
        <MenuItem value="outcome">outcome (housed / stayed-housed)</MenuItem>
        {TOPIC_ALLOWLIST.map((t) => (
          <MenuItem key={t} value={t}>
            {t}
          </MenuItem>
        ))}
      </TextField>
      <TextField
        name="summary"
        label="What the record says"
        value={summary}
        onChange={(e) => setSummary(e.target.value)}
        fullWidth
        multiline
        minRows={2}
        required
        sx={{ mb: 2 }}
      />
      <Button type="submit" variant="contained" disabled={!summary.trim()}>
        Add to the record
      </Button>
    </Box>
  );
}
