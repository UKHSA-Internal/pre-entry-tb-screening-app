import Container from "@/components/container/container";
import SputumCollectionForm from "@/sections/sputum-collection-form";

export default function SputumCollectionPage() {
  return (
    <Container title="Enter sputum sample collection information" backLinkTo="/tracker">
      <SputumCollectionForm />
    </Container>
  );
}
