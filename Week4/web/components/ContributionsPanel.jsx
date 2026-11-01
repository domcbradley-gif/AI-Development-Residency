"use client";

import { useCallback, useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import ContributionForm from "@/components/ContributionForm.jsx";
import ContributionList from "@/components/ContributionList.jsx";
import { listContributions } from "@/lib/api.js";
import { PROVISIONAL_LABEL, TOPIC_ALLOWLIST } from "@/lib/config.js";

export default function ContributionsPanel() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Provisional, community-owned values are client-side config (there is no API
  // tier to fetch them from). They stay clearly labelled as provisional.
  const topics = TOPIC_ALLOWLIST;
  const provisionalLabel = PROVISIONAL_LABEL;

  const refresh = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      setItems(await listContributions());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return (
    <>
      {/* Skip link for keyboard users. */}
      <Link
        href="#main"
        sx={{
          position: "absolute",
          left: -9999,
          "&:focus": { left: 8, top: 8, zIndex: 1, bgcolor: "background.paper", p: 1 },
        }}
      >
        Skip to main content
      </Link>

      <Container component="main" id="main" maxWidth="sm" sx={{ py: 4 }}>
        <Typography component="h1" variant="h4" gutterBottom>
          Community record
        </Typography>
        <Typography color="text.secondary" sx={{ mb: 1 }}>
          A space for residents to put what their housing is really like on the record —
          owned by the community, not the funder.
        </Typography>
        <Box
          role="note"
          sx={{
            mb: 3,
            p: 1.5,
            border: "1px solid",
            borderColor: "divider",
            borderRadius: 1,
            fontSize: "0.875rem",
          }}
        >
          <strong>Practice space.</strong> Everything here is made-up (test) data. You can&rsquo;t enter real resident data yet.
        </Box>

        <ContributionForm
          topics={topics}
          provisionalLabel={provisionalLabel}
          onSubmitted={refresh}
        />
        <ContributionList items={items} loading={loading} error={error} />
      </Container>
    </>
  );
}
