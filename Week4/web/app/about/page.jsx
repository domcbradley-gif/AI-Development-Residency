import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";

export const metadata = {
  title: "About — Community record",
  description: "What this is, who runs it, and what happens after you post.",
};

export default function AboutPage() {
  return (
    <Container component="main" id="main" maxWidth="sm" sx={{ py: 4 }}>
      <Typography component="h1" variant="h4" gutterBottom>
        About
      </Typography>

      <Typography variant="body1" sx={{ mb: 2 }}>
        This is a shared, public record of what residents are living with in their
        housing. Anyone can read it. Residents can add to it anonymously.
      </Typography>

      <Typography component="h2" variant="h6" sx={{ mt: 3 }} gutterBottom>
        What happens when you post
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Your note goes onto the public record for the community to see and build on.
        It is <strong>not</strong> sent to your landlord or to any agency, and no
        one promises it will be acted on. Its power is that it is on the record, in
        the open, alongside other residents&rsquo; accounts.
      </Typography>

      <Typography component="h2" variant="h6" sx={{ mt: 3 }} gutterBottom>
        How anonymity works
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        We never ask for your name, and nothing identifying is attached to a note,
        so a note can&rsquo;t be traced back to you. Because posts aren&rsquo;t tied
        to an account, they also can&rsquo;t be edited or removed afterward.
      </Typography>

      <Typography component="h2" variant="h6" sx={{ mt: 3 }} gutterBottom>
        Who runs it
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        The record is community-controlled, not run by any landlord, funder, or
        nonprofit. A residents&rsquo; group — made up of people who join themselves
        — can withdraw or restore its support for a provider, and every such
        decision is shown on the public record.
      </Typography>

      <Typography component="h2" variant="h6" sx={{ mt: 3 }} gutterBottom>
        Staying independent
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        To stay independent, the project takes no money from the housing providers
        it holds accountable, and limits how much any single funder can give. See
        the Funding page for the details.
      </Typography>

      <Divider sx={{ my: 3 }} />
      <Typography variant="caption" color="text.secondary">
        This is a practice environment. All data shown is made-up while the tool is
        being tested.
      </Typography>
    </Container>
  );
}
