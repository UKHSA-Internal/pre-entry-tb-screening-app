import Confirmation from "@/components/confirmation/confirmation";
import Container from "@/components/container/container";

export default function ChestXrayConfirmation() {
  const furtherInfo = ["You can now return to the progress tracker."];

  return (
    <Container title="Radiological outcome confirmed" backLinkTo="/chest-xray-summary">
      <Confirmation
        confirmationText={"Radiological outcome confirmed"}
        furtherInfo={furtherInfo}
        buttonText={"Continue"}
        buttonLink={"/tracker"}
        whatHappensNext
      />
    </Container>
  );
}
