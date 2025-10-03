import Container from "@/components/container/container";
import MedicalScreeningForm from "@/sections/medical-screening-form";

export default function MedicalScreeningPage() {
  return (
    <Container
      title="Medical screening - Complete UK pre-entry health screening - GOV.UK"
      backLinkTo="/tracker"
    >
      <MedicalScreeningForm />
    </Container>
  );
}
