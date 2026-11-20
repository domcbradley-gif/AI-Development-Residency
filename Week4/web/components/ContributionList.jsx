import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";

function formatDate(iso) {
  try {
    return new Date(iso).toLocaleDateString(undefined, { timeZone: "UTC" });  // date only, in UTC — matches the day the DB truncated to (de-anon, AC-1)
  } catch {
    return iso;
  }
}

// Read-back view of the synthetic, anonymous record.
export default function ContributionList({ items, loading, error }) {
  return (
    <Box component="section" aria-labelledby="record-heading" sx={{ mt: 5 }}>
      <Typography component="h2" variant="h5" id="record-heading" gutterBottom>
        The Community Record
      </Typography>

      {loading && (
        <Typography aria-live="polite" color="text.secondary">
          Loading the record…
        </Typography>
      )}

      {error && (
        <Typography role="alert" color="error">
          {error}
        </Typography>
      )}

      {!loading && !error && items.length === 0 && (
        <Typography color="text.secondary">
          No contributions yet. Be the first to add one above.
        </Typography>
      )}

      {items.length > 0 && (
        <List>
          {items.map((item) => (
            <ListItem key={item.id} disableGutters>
              <Paper variant="outlined" sx={{ p: 2, width: "100%" }}>
                <Typography variant="body1" sx={{ whiteSpace: "pre-wrap" }}>
                  {item.body}
                </Typography>
                <Box
                  sx={{
                    mt: 1,
                    display: "flex",
                    gap: 1,
                    alignItems: "center",
                    flexWrap: "wrap",
                  }}
                >
                  {item.topic && <Chip label={item.topic} size="small" />}
                  <Typography variant="caption" color="text.secondary">
                    {formatDate(item.created_at)}
                  </Typography>
                  {item.synthetic && (
                    <Chip
                      label="example"
                      size="small"
                      color="primary"
                      variant="outlined"
                    />
                  )}
                </Box>
              </Paper>
            </ListItem>
          ))}
        </List>
      )}
    </Box>
  );
}
