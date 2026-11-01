import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Container from "@mui/material/Container";
import Divider from "@mui/material/Divider";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

function residentLine(row) {
  if (row.residentCount === 0) return "No resident accounts on this topic yet.";
  if (row.masked) {
    return `A few residents reported this (fewer than ${row.minDisplay}). The exact number is hidden to keep them safe.`;
  }
  const n = row.displayCount;
  return `${n} resident account${n === 1 ? "" : "s"} on this topic.`;
}

export default function GapView({ provider, rows, provisionalLabel }) {
  return (
    <Container component="main" id="main" maxWidth="md" sx={{ py: 4 }}>
      <Typography component="h1" variant="h4" gutterBottom>
        The gap
      </Typography>

      {!provider ? (
        <Typography color="text.secondary">
          No provider is set up yet. Add one to see the gap.
        </Typography>
      ) : (
        <>
          <Typography color="text.secondary" sx={{ mb: 1 }}>
            {provider.name} — the official record set beside what residents report.
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            This is not a score or a grade. It shows both sides and marks
            where the official record and residents&rsquo; accounts don&rsquo;t agree. All data is made-up.
          </Typography>

          <Stack spacing={2}>
            {rows.map((row) => (
              <Paper key={row.category} variant="outlined" sx={{ p: 2 }}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    flexWrap: "wrap",
                    mb: 1,
                  }}
                >
                  <Typography component="h2" variant="h6" sx={{ textTransform: "capitalize" }}>
                    {row.category}
                  </Typography>
                  {row.mismatch && (
                    <Chip
                      label="Official record disagrees with residents"
                      color="error"
                      variant="outlined"
                      size="small"
                    />
                  )}
                </Box>

                <Typography variant="subtitle2">Official record</Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  {row.official
                    ? `${row.official.reported_summary} (${row.official.source}${
                        row.official.record_date ? `, ${row.official.record_date}` : ""
                      })`
                    : "No official record on file for this topic."}
                </Typography>

                <Typography variant="subtitle2">Residents</Typography>
                <Typography variant="body2">{residentLine(row)}</Typography>
              </Paper>
            ))}
          </Stack>

          <Divider sx={{ my: 3 }} />
          <Typography variant="caption" color="text.secondary">
            Small resident-account counts are hidden to protect residents — this
            threshold is {provisionalLabel}. Raw accounts are never shown here;
            only counts, computed on the server.
          </Typography>
        </>
      )}
    </Container>
  );
}
