import Confirmation from "@/components/confirmation/confirmation";
import Container from "@/components/container/container";

export default function ApplicantConfirmation() {
  return (
    <Container title="Visa applicant details confirmed - Complete UK pre-entry health screening - GOV.UK">
      <Confirmation
        confirmationText={"Visa applicant details confirmed"}
        furtherInfo={[
          "We have sent the visa applicant details to UKHSA.",
          "You can now view a summary for this visa applicant.",
        ]}
        buttonText={"Continue"}
        buttonLink={"/tracker"}
        whatHappensNext
      />
    </Container>
  );
}
