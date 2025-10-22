import Container from "@/components/container/container";
import SputumCollectionForm from "@/sections/sputum-collection-form";

export default function SputumCollectionPage() {
  return (
    <Container
      title="Enter sputum sample collection information - Complete UK pre-entry health screening - GOV.UK"
      backLinkTo="/tracker"
    >
      <SputumCollectionForm />
    </Container>
  );
}
