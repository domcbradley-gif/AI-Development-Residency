import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Link from "@mui/material/Link";
import NextLink from "next/link";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { joinBody, leaveBody } from "@/app/body-actions.js";

export default function BodyView({
  body,
  providerName,
  user,
  memberCount,
  isMember,
  provisionalLabel,
}) {
  return (
    <Container component="main" id="main" maxWidth="sm" sx={{ py: 4 }}>
      <Typography component="h1" variant="h4" gutterBottom>
        Community body
      </Typography>

      {!body ? (
        <Typography color="text.secondary">
          No community body exists yet.
        </Typography>
      ) : (
        <Paper variant="outlined" sx={{ p: 3 }}>
          <Typography component="h2" variant="h5" gutterBottom>
            {body.name}
          </Typography>
          {providerName && (
            <Typography color="text.secondary" sx={{ mb: 1 }}>
              Holds {providerName} to account.
            </Typography>
          )}
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            To act, the body needs {body.quorum} members ({provisionalLabel}). People join themselves — no organization picks who is on the body.
          </Typography>

          {user ? (
            <>
              <Typography sx={{ mb: 2 }}>
                <strong>{memberCount}</strong> member{memberCount === 1 ? "" : "s"}.{" "}
                {memberCount >= body.quorum
                  ? "Enough members have joined — the body can issue a warrant."
                  : `Not enough members yet (needs ${body.quorum}).`}
              </Typography>

              {isMember ? (
                <Box
                  sx={{ display: "flex", alignItems: "center", gap: 2, flexWrap: "wrap" }}
                >
                  <Alert severity="success" sx={{ flexGrow: 1 }}>
                    You are a member of this body.
                  </Alert>
                  <form action={leaveBody}>
                    <input type="hidden" name="bodyId" value={body.id} />
                    <Button type="submit" variant="outlined">
                      Leave
                    </Button>
                  </form>
                </Box>
              ) : (
                <form action={joinBody}>
                  <input type="hidden" name="bodyId" value={body.id} />
                  <Button type="submit" variant="contained">
                    Join this body
                  </Button>
                </form>
              )}
            </>
          ) : (
            <Alert severity="info">
              <Link component={NextLink} href="/login">
                Log in
              </Link>{" "}
              to join this community body.
            </Alert>
          )}
        </Paper>
      )}
    </Container>
  );
}
