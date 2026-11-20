import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Container from "@mui/material/Container";
import Divider from "@mui/material/Divider";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

function residentLine(row) {
  if (row.residentCount === 0) return "No residents have mentioned this yet.";
  if (row.masked) {
    return `A few residents mentioned this (fewer than ${row.minDisplay}). We hide the exact number to keep them safe.`;
  }
  const n = row.displayCount;
  return `${n} resident${n === 1 ? "" : "s"} mentioned this.`;
}

export default function GapView({ provider, rows, provisionalLabel }) {
  return (
    <Container component="main" id="main" maxWidth="md" sx={{ py: 4 }}>
      <Typography component="h1" variant="h4" gutterBottom>
        Compare
      </Typography>
      <Typography color="text.secondary" sx={{ mb: 2 }}>
        What residents say, next to the official record.
      </Typography>

      {!provider ? (
        <Typography color="text.secondary">
          No provider is set up yet, so there&rsquo;s nothing to compare.
        </Typography>
      ) : (
        <>
          <Typography color="text.secondary" sx={{ mb: 1 }}>
            {provider.name} — the official record, next to what residents report.
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            This isn&rsquo;t a score or a grade. It just shows both sides and points out
            where the official record and what residents say don&rsquo;t match.
            Any numbers are what people reported themselves, not a grade. All data here is example data.
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
                      label="Residents disagree with the official record"
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
            We hide small counts to protect residents — this
            threshold is {provisionalLabel}. The notes themselves are never shown here;
            only counts, computed on the server.
          </Typography>
        </>
      )}
    </Container>
  );
}
