import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Container from "@mui/material/Container";
import Divider from "@mui/material/Divider";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

const pct = (x) => `${Math.round(x * 100)}%`;

export default function FundingView({ summary, conflicts, provisionalLabel }) {
  return (
    <Container component="main" id="main" maxWidth="md" sx={{ py: 4 }}>
      <Typography component="h1" variant="h4" gutterBottom>
        Funding discipline
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        The guardrails in the open: no money from the people being watched, and no
        single funder over {pct(summary.capFraction)} of the budget ({provisionalLabel}).
      </Typography>

      {summary.anyFromWatched && (
        <Alert severity="error" sx={{ mb: 2 }}>
          A funder is marked as &ldquo;from the watched&rdquo; — this breaks the independence rule.
        </Alert>
      )}
      {summary.anyOverCap && (
        <Alert severity="error" sx={{ mb: 2 }}>
          A single funder is over the {pct(summary.capFraction)} cap.
        </Alert>
      )}
      {!summary.anyFromWatched && !summary.anyOverCap && summary.total > 0 && (
        <Alert severity="success" sx={{ mb: 2 }}>
          Within the rules: no money from the watched, and no funder over the cap.
        </Alert>
      )}

      <Typography component="h2" variant="h5" gutterBottom>
        Funders
      </Typography>
      <Stack spacing={1.5} sx={{ mb: 4 }}>
        {summary.rows.map((r) => (
          <Paper key={r.id} variant="outlined" sx={{ p: 2 }}>
            <Box sx={{ display: "flex", gap: 1, alignItems: "center", flexWrap: "wrap" }}>
              <Typography sx={{ flexGrow: 1 }}>{r.name}</Typography>
              <Typography variant="body2" color="text.secondary">
                ${r.amount.toLocaleString()} · {pct(r.share)}
              </Typography>
              {r.overCap && <Chip label="over cap" color="error" size="small" />}
              {r.fromWatched && (
                <Chip label="from the watched" color="error" size="small" />
              )}
            </Box>
          </Paper>
        ))}
        <Typography variant="body2" color="text.secondary">
          Total: ${summary.total.toLocaleString()}
        </Typography>
      </Stack>

      <Divider sx={{ mb: 3 }} />

      <Typography component="h2" variant="h5" gutterBottom>
        Conflict register
      </Typography>
      {conflicts.length === 0 ? (
        <Typography color="text.secondary">No conflicts disclosed.</Typography>
      ) : (
        <Stack spacing={1.5}>
          {conflicts.map((c) => (
            <Paper key={c.id} variant="outlined" sx={{ p: 2 }}>
              <Typography variant="body2">{c.description}</Typography>
            </Paper>
          ))}
        </Stack>
      )}
    </Container>
  );
}
