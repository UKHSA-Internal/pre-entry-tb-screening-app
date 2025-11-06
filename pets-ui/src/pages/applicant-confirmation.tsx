import Confirmation from "@/components/confirmation/confirmation";
import Container from "@/components/container/container";

export default function ApplicantConfirmation() {
  return (
    <Container title="Visa applicant details confirmed - Complete UK pre-entry health screening - GOV.UK">
      <Confirmation
        confirmationText={"Visa applicant details confirmed"}
        furtherInfo={["You can now return to the progress tracker."]}
        buttonText={"Continue"}
        buttonLink={"/tracker"}
        whatHappensNext
      />
    </Container>
  );
}
