import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Container from "@mui/material/Container";
import Divider from "@mui/material/Divider";
import Link from "@mui/material/Link";
import NextLink from "next/link";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { issueWarrant, revokeWarrant } from "@/app/warrant-actions.js";

function fmt(ts) {
  if (!ts) return "";
  try {
    return new Date(ts).toLocaleString();
  } catch {
    return ts;
  }
}

// DB stores status as "issued" / "revoked"; show plain words to people.
function statusLabel(status) {
  return status === "issued" ? "Active" : "Lifted";
}

export default function WarrantsView({
  provider,
  warrants,
  activeWarrant,
  user,
  isMember,
  memberCount,
  quorum,
}) {
  const quorumMet = quorum != null && memberCount >= quorum;

  return (
    <Container component="main" id="main" maxWidth="md" sx={{ py: 4 }}>
      <Typography component="h1" variant="h4" gutterBottom>
        Accountability
      </Typography>
      <Typography color="text.secondary" sx={{ mb: 3 }}>
        When enough members agree, the residents&rsquo; group can withdraw its
        support from a provider &mdash; a public, reversible way of saying it does
        not stand behind them. Support can be restored at any time.
      </Typography>

      {!provider ? (
        <Typography color="text.secondary">No provider set up yet.</Typography>
      ) : (
        <>
          {/* Provider standing — tracks whether support has been withdrawn. */}
          <Alert
            severity={activeWarrant ? "error" : "success"}
            variant="outlined"
            sx={{ mb: 3 }}
          >
            {activeWarrant ? (
              <>
                The community has withdrawn its support from{" "}
                <strong>{provider.name}</strong> (since {fmt(activeWarrant.issued_at)}).
              </>
            ) : (
              <>
                The community has not withdrawn support from{" "}
                <strong>{provider.name}</strong>.
              </>
            )}
          </Alert>

          {/* Member actions */}
          {user && isMember ? (
            activeWarrant ? (
              <Paper variant="outlined" sx={{ p: 2, mb: 3 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Restore support
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Restoring support is one step and takes effect immediately.
                </Typography>
                <form action={revokeWarrant}>
                  <input type="hidden" name="warrantId" value={activeWarrant.id} />
                  <Button type="submit" variant="contained" color="error">
                    Restore support
                  </Button>
                </form>
              </Paper>
            ) : quorumMet ? (
              <Paper variant="outlined" sx={{ p: 2, mb: 3 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Withdraw support
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  An explicit community action. Enough members have joined ({memberCount}/{quorum}).
                </Typography>
                <Box component="form" action={issueWarrant}>
                  <TextField
                    name="reason"
                    label="Reason (optional)"
                    fullWidth
                    multiline
                    minRows={2}
                    sx={{ mb: 2 }}
                  />
                  <Button type="submit" variant="contained">
                    Withdraw support
                  </Button>
                </Box>
              </Paper>
            ) : (
              <Alert severity="info" sx={{ mb: 3 }}>
                Not enough members yet ({memberCount}/{quorum}). The group can
                withdraw support once enough members have joined.
              </Alert>
            )
          ) : (
            <Alert severity="info" sx={{ mb: 3 }}>
              Only members of the residents&rsquo; group can withdraw or restore
              support.{" "}
              <Link component={NextLink} href={user ? "/body" : "/login"}>
                {user ? "Join the group" : "Log in"}
              </Link>
              .
            </Alert>
          )}

          <Divider sx={{ my: 2 }} />

          {/* Public record */}
          <Typography component="h2" variant="h5" gutterBottom>
            Public record
          </Typography>
          {warrants.length === 0 ? (
            <Typography color="text.secondary">
              Nothing has been recorded yet.
            </Typography>
          ) : (
            <Stack spacing={2}>
              {warrants.map((w) => (
                <Paper key={w.id} variant="outlined" sx={{ p: 2 }}>
                  <Box sx={{ display: "flex", gap: 1, alignItems: "center", mb: 1 }}>
                    <Chip
                      label={statusLabel(w.status)}
                      color={w.status === "issued" ? "error" : "default"}
                      size="small"
                    />
                    <Typography variant="body2" color="text.secondary">
                      Support withdrawn {fmt(w.issued_at)}
                      {w.revoked_at ? ` · restored ${fmt(w.revoked_at)}` : ""}
                    </Typography>
                  </Box>
                  {w.reason && (
                    <Typography variant="body2">Reason: {w.reason}</Typography>
                  )}
                </Paper>
              ))}
            </Stack>
          )}
        </>
      )}
    </Container>
  );
}
