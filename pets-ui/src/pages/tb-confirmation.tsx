import Confirmation from "@/components/confirmation/confirmation";
import Container from "@/components/container/container";

export default function TbConfirmationPage() {
  return (
    <Container title="TB screening complete" backLinkTo="/tb-certificate-summary">
      <Confirmation
        confirmationText="TB screening complete"
        furtherInfo={["Thank you for recording the visa applicant's TB screening."]}
        buttonLink="/tracker"
        buttonText="Finish"
      />
    </Container>
  );
}
