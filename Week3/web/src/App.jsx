import { useCallback, useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import ContributionForm from "./components/ContributionForm.jsx";
import ContributionList from "./components/ContributionList.jsx";
import { getProvisionalConfig, listContributions } from "./api.js";

export default function App() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [topics, setTopics] = useState([]);
  const [provisionalLabel, setProvisionalLabel] = useState(
    "provisional — not set by the community",
  );

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
    getProvisionalConfig()
      .then((cfg) => {
        setTopics(cfg.topics ?? []);
        if (cfg.label) setProvisionalLabel(cfg.label);
      })
      .catch(() => setTopics([]));
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
          A space for residents to put the truth about their housing on the record —
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
          <strong>Practice environment.</strong> All data here is synthetic. There is
          no way to enter real resident data in this phase.
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
