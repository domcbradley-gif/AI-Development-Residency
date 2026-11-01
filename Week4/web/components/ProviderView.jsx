import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import ProviderIntakeForm from "@/components/ProviderIntakeForm.jsx";

function fmt(ts) {
  if (!ts) return "";
  try {
    return new Date(ts).toLocaleString();
  } catch {
    return ts;
  }
}

export default function ProviderView({
  provider,
  activeWarrant,
  events,
  outcomes,
  independence,
  user,
  isProvider,
}) {
  return (
    <Container component="main" id="main" maxWidth="md" sx={{ py: 4 }}>
      <Typography component="h1" variant="h4" gutterBottom>
        Provider standing
      </Typography>

      {!provider ? (
        <Typography color="text.secondary">No provider set up yet.</Typography>
      ) : (
        <>
          <Typography color="text.secondary" sx={{ mb: 2 }}>
            The community-issued credential a provider sees about itself.
          </Typography>
          <Alert severity={activeWarrant ? "error" : "success"} variant="outlined" sx={{ mb: 3 }}>
            <strong>{provider.name}</strong> —{" "}
            {activeWarrant
              ? `currently under a community warrant (since ${fmt(activeWarrant.issued_at)}).`
              : "in good standing — no active community warrant."}
          </Alert>

          {/* STUB (ADR 0007, 4.3): independence re-check, computed from data. */}
          <Typography component="h2" variant="h5" gutterBottom>
            Independence check
          </Typography>
          <List dense sx={{ mb: 3 }}>
            {independence.map((c) => (
              <ListItem key={c.label} disableGutters>
                <ListItemText
                  primary={`${c.ok ? "✓" : "✗"} ${c.label}`}
                  primaryTypographyProps={{
                    color: c.ok ? "success.main" : "error.main",
                  }}
                />
              </ListItem>
            ))}
          </List>

          <Divider sx={{ mb: 2 }} />

          {/* STUB (ADR 0007, 5.2): minimal outcome stub. */}
          <Typography component="h2" variant="h5" gutterBottom>
            Outcomes
          </Typography>
          {outcomes.length === 0 ? (
            <Typography color="text.secondary" sx={{ mb: 3 }}>
              No outcomes reported yet.
            </Typography>
          ) : (
            <Stack spacing={1.5} sx={{ mb: 3 }}>
              {outcomes.map((o) => (
                <Paper key={o.id} variant="outlined" sx={{ p: 2 }}>
                  <Typography variant="body2">{o.reported_summary}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    {o.source}
                    {o.record_date ? ` · ${o.record_date}` : ""}
                  </Typography>
                </Paper>
              ))}
            </Stack>
          )}

          {/* STUB (ADR 0007, 5.1): provider record intake. */}
          <Typography component="h2" variant="h5" gutterBottom>
            Add to the record
          </Typography>
          {isProvider ? (
            <ProviderIntakeForm />
          ) : user ? (
            <Alert severity="info" sx={{ mb: 3 }}>
              Only provider accounts can add to the record. You are signed in as a
              community member.
            </Alert>
          ) : (
            <Alert severity="info" sx={{ mb: 3 }}>
              Log in with a provider account to add a record or report an outcome.
            </Alert>
          )}

          <Divider sx={{ my: 3 }} />
          <Typography component="h2" variant="h5" gutterBottom>
            History (receipts)
          </Typography>
          {events.length === 0 ? (
            <Typography color="text.secondary">No warrant activity yet.</Typography>
          ) : (
            <Stack spacing={1.5}>
              {events.map((e) => (
                <Paper key={e.id} variant="outlined" sx={{ p: 2 }}>
                  <Typography variant="body2">
                    Warrant <strong>{e.event_type}</strong> · {fmt(e.created_at)}
                    {e.note ? ` · ${e.note}` : ""}
                  </Typography>
                </Paper>
              ))}
            </Stack>
          )}
        </>
      )}
    </Container>
  );
}
