import Confirmation from "@/components/confirmation/confirmation";
import Container from "@/components/container/container";

export default function ApplicantConfirmation() {
  const furtherInfo = ["You can now add travel information for this applicant."];

  return (
    <Container title="Applicant details confirmation" backLinkTo="/applicant-summary">
      <Confirmation
        confirmationText={"Applicant record created"}
        furtherInfo={furtherInfo}
        buttonText={"Continue"}
        buttonLink={"/tracker"}
        whatHappensNext
      />
    </Container>
  );
}
