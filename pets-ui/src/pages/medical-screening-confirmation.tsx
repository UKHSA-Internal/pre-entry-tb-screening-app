import Confirmation from "@/components/confirmation/confirmation";
import Container from "@/components/container/container";

export default function MedicalConfirmation() {
  return (
    <Container title="TB symptoms and medical history confirmed - Complete UK pre-entry health screening - GOV.UK">
      <Confirmation
        confirmationText={"TB symptoms and medical history confirmed"}
        furtherInfo={[
          "We have sent the TB symptoms and medical history to UKHSA.",
          "You can now view a summary for this visa applicant.",
        ]}
        buttonText={"Continue"}
        buttonLink={"/tracker"}
        whatHappensNext
      />
    </Container>
  );
}
