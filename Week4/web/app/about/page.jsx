import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";

export const metadata = {
  title: "About — Many Strong",
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
        Your note goes onto the public record, where the community can see it and build on it.
        It <strong>doesn&rsquo;t</strong> go to your landlord or any agency, and no
        one promises it&rsquo;ll be acted on. Its power is simply being on the record, in
        the open, next to what other residents have shared.
      </Typography>

      <Typography component="h2" variant="h6" sx={{ mt: 3 }} gutterBottom>
        How anonymity works
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        We never ask for your name. Nothing about you is saved with your note,
        so it can&rsquo;t be traced back to you. A note isn&rsquo;t linked
        to any account, so it also can&rsquo;t be edited or removed later.
      </Typography>

      <Typography component="h2" variant="h6" sx={{ mt: 3 }} gutterBottom>
        Who runs it
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        The community runs this — not any landlord, funder, or
        nonprofit. A residents&rsquo; group (people who join on their own)
        can withdraw or restore its support for a provider. Each
        decision shows up on the public record.
      </Typography>

      <Typography component="h2" variant="h6" sx={{ mt: 3 }} gutterBottom>
        Staying independent
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        To stay independent, the project takes no money from the housing providers
        it watches. It also limits how much any one funder can give. See
        the Funding page for the details.
      </Typography>

      <Divider sx={{ my: 3 }} />
      <Typography variant="caption" color="text.secondary">
        This is a practice space. All data shown is example data while the tool is
        being tested.
      </Typography>
    </Container>
  );
}
