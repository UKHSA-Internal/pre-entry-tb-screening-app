import Confirmation from "@/components/confirmation/confirmation";
import Container from "@/components/container/container";

export default function RadiologicalOutcomeConfirmation() {
  return (
    <Container title="Radiological outcome confirmed - Complete UK pre-entry health screening - GOV.UK">
      <Confirmation
        confirmationText={"Radiological outcome confirmed"}
        furtherInfo={[
          "We have sent the radiological outcome to UKHSA.",
          "You can now view summary for this visa applicant.",
        ]}
        buttonText={"Continue"}
        buttonLink={"/tracker"}
        whatHappensNext
      />
    </Container>
  );
}
