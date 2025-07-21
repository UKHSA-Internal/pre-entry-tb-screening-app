import Container from "@/components/container/container";
import MedicalScreeningForm from "@/sections/medical-screening-form";

export default function MedicalScreeningPage() {
  return (
    <Container title="Medical screening form" backLinkTo="/tracker">
      <MedicalScreeningForm />
    </Container>
  );
}
