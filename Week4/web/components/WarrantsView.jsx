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
        Warrants
      </Typography>

      {!provider ? (
        <Typography color="text.secondary">No provider set up yet.</Typography>
      ) : (
        <>
          {/* Provider standing — changes with the warrant. */}
          <Alert
            severity={activeWarrant ? "error" : "success"}
            variant="outlined"
            sx={{ mb: 3 }}
          >
            <strong>{provider.name}</strong> —{" "}
            {activeWarrant
              ? `under an active community warrant since ${fmt(activeWarrant.issued_at)}.`
              : "no active community warrant."}
          </Alert>

          {/* Member actions */}
          {user && isMember ? (
            activeWarrant ? (
              <Paper variant="outlined" sx={{ p: 2, mb: 3 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Revoke the warrant
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Revocation is one step and takes effect immediately.
                </Typography>
                <form action={revokeWarrant}>
                  <input type="hidden" name="warrantId" value={activeWarrant.id} />
                  <Button type="submit" variant="contained" color="error">
                    Revoke warrant
                  </Button>
                </form>
              </Paper>
            ) : quorumMet ? (
              <Paper variant="outlined" sx={{ p: 2, mb: 3 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Issue a warrant
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  An explicit community action. Quorum is met ({memberCount}/{quorum}).
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
                    Issue warrant
                  </Button>
                </Box>
              </Paper>
            ) : (
              <Alert severity="info" sx={{ mb: 3 }}>
                Quorum is not yet met ({memberCount}/{quorum} members). The body
                can issue a warrant once enough members have joined.
              </Alert>
            )
          ) : (
            <Alert severity="info" sx={{ mb: 3 }}>
              Only members of the community body can issue or revoke a warrant.{" "}
              <Link component={NextLink} href={user ? "/body" : "/login"}>
                {user ? "Join the body" : "Log in"}
              </Link>
              .
            </Alert>
          )}

          <Divider sx={{ my: 2 }} />

          {/* Public register */}
          <Typography component="h2" variant="h5" gutterBottom>
            Public warrant register
          </Typography>
          {warrants.length === 0 ? (
            <Typography color="text.secondary">
              No warrants have been issued yet.
            </Typography>
          ) : (
            <Stack spacing={2}>
              {warrants.map((w) => (
                <Paper key={w.id} variant="outlined" sx={{ p: 2 }}>
                  <Box sx={{ display: "flex", gap: 1, alignItems: "center", mb: 1 }}>
                    <Chip
                      label={w.status}
                      color={w.status === "issued" ? "error" : "default"}
                      size="small"
                    />
                    <Typography variant="body2" color="text.secondary">
                      Issued {fmt(w.issued_at)}
                      {w.revoked_at ? ` · revoked ${fmt(w.revoked_at)}` : ""}
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
