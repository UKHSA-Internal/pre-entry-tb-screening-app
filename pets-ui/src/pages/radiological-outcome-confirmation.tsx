import Confirmation from "@/components/confirmation/confirmation";
import Container from "@/components/container/container";

export default function RadiologicalOutcomeConfirmation() {
  return (
    <Container
      title="Radiological outcome confirmed - Complete UK pre-entry health screening - GOV.UK"
      backLinkTo="/check-chest-x-ray-results-findings"
    >
      <Confirmation
        confirmationText={"Radiological outcome confirmed"}
        furtherInfo={[
          "We have sent the radiological outcome to UKHSA.",
          "You can now return to the progress tracker.",
        ]}
        buttonText={"Continue"}
        buttonLink={"/tracker"}
        whatHappensNext
      />
    </Container>
  );
}
